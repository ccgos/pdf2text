import * as fs from 'fs';
import * as path from 'path';
import TurndownService from 'turndown';
import PDFParser from 'pdf2json';
import { fromPath } from 'pdf2pic';
import { createCanvas } from 'canvas';
import { pdfjsLib } from './pdfWorker';
import sharp from 'sharp';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '_'
});

interface TextItem {
  x: number;
  text: string;
  y: number;
}

interface PdfPopperOptions {
  format: 'png';
  out_dir: string;
  out_prefix: string;
  page: number | null;
  scale: number;
}

export class PdfConverter {
  async convertFile(filePath: string): Promise<string> {
    try {
      const pdfParser = new PDFParser();

      const pdfData = await new Promise((resolve, reject) => {
        pdfParser.on('pdfParser_dataReady', (pdfData) => {
          resolve(pdfData);
        });

        pdfParser.on('pdfParser_dataError', (error: any) => {
          reject(new Error(error?.parserError?.message || 'PDF parsing failed'));
        });

        pdfParser.loadPDF(filePath);
      });

      // Process PDF data
      const pages = (pdfData as any).Pages;
      let html = '';

      for (const page of pages) {
        const textItems: TextItem[] = page.Texts.map((text: any) => ({
          x: text.x,
          text: decodeURIComponent(text.R[0].T),
          y: text.y
        }));

        // Sort by y position first, then x position
        textItems.sort((a, b) => {
          if (Math.abs(a.y - b.y) < 0.1) { // If on same line (within small threshold)
            return a.x - b.x;
          }
          return a.y - b.y;
        });

        // Group items by line and process indentation
        let currentY = -1;
        let currentLine = '';
        let lines: string[] = [];

        textItems.forEach((item) => {
          if (currentY !== -1 && Math.abs(item.y - currentY) > 0.1) {
            // New line
            if (currentLine.trim()) {
              lines.push(currentLine.trim());
            }
            currentLine = '';
          }

          // Calculate indentation based on x position
          if (!currentLine) {
            const indent = Math.floor(item.x / 2); // Adjust divisor as needed
            currentLine = '    '.repeat(indent);
          }

          currentLine += item.text + ' ';
          currentY = item.y;
        });

        if (currentLine.trim()) {
          lines.push(currentLine.trim());
        }

        // Convert to HTML preserving structure
        const pageHtml = lines.map(line => {
          // Check if line starts with a number or letter followed by period
          if (/^[A-Z0-9]+\.\s/.test(line)) {
            return `<h3>${line}</h3>`;
          } else if (/^\s*[a-z]+\.\s/.test(line)) {
            return `<h4>${line.trim()}</h4>`;
          } else if (/^\s*[ivx]+\.\s/.test(line)) {
            return `<h5>${line.trim()}</h5>`;
          } else if (/^\s*\d+\.\s/.test(line)) {
            return `<h6>${line.trim()}</h6>`;
          }
          return `<p>${line}</p>`;
        }).join('\n');

        html += `<div class="page">${pageHtml}</div>\n`;
      }

      // Convert to markdown
      const markdown = turndownService.turndown(html)
        // Clean up extra newlines
        .replace(/\n{3,}/g, '\n\n')
        // Fix heading markers
        .replace(/#{3,6} /g, match => match.replace(/#/g, '  '));
      
      // Save the markdown file
      const markdownPath = filePath.replace('.pdf', '.md');
      await fs.promises.writeFile(markdownPath, markdown, 'utf-8');
      
      return markdownPath;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to convert ${filePath}: ${error.message}`);
      }
      throw new Error(`Failed to convert ${filePath}: Unknown error`);
    }
  }

  async processDirectory(dirPath: string, progressCallback: (progress: number) => void): Promise<string[]> {
    try {
      const files = await fs.promises.readdir(dirPath);
      const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
      const convertedFiles: string[] = [];
      
      if (pdfFiles.length === 0) {
        throw new Error('No PDF files found in directory');
      }
      
      for (let i = 0; i < pdfFiles.length; i++) {
        const file = pdfFiles[i];
        const filePath = path.join(dirPath, file);
        try {
          const markdownPath = await this.convertFile(filePath);
          convertedFiles.push(markdownPath);
          // Update progress after each file
          progressCallback(Math.round((i + 1) / pdfFiles.length * 100));
        } catch (error) {
          console.error(`Error converting ${filePath}:`, error);
          throw error; // Re-throw to handle in the UI
        }
      }
      
      return convertedFiles;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to process directory ${dirPath}: ${error.message}`);
      }
      throw new Error(`Failed to process directory ${dirPath}: Unknown error`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete ${filePath}: ${error.message}`);
      }
      throw new Error(`Failed to delete ${filePath}: Unknown error`);
    }
  }

  async convertToImages(filePath: string, progressCallback: (progress: number) => void): Promise<string[]> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      console.log('\n=== PDF Conversion Details ===');
      console.log('File exists:', fs.existsSync(filePath));
      console.log('File size:', fs.statSync(filePath).size);
      
      const outputDir = path.dirname(filePath);
      const outputFile = path.basename(filePath, '.pdf');

      const options = {
        density: 300,
        saveFilename: outputFile,
        savePath: outputDir,
        format: "png",
        width: 2480,
        height: 3508,
        quality: 100,
        compression: "none",
        useGM: true,
        gs: {
          path: '/opt/homebrew/bin/gs',
          options: {
            '-dQUIET': true,
            '-dBATCH': true,
            '-dSAFER': true,
            '-dNOPAUSE': true,
            '-dNOPROMPT': true,
            '-dMaxBitmap=500000000': true,
            '-dAlignToPixels=0': true,
            '-dGridFitTT=2': true,
            '-sDEVICE=pngalpha': true,
            '-dTextAlphaBits=4': true,
            '-dGraphicsAlphaBits=4': true
          }
        }
      };

      // Get total pages
      const pdfParser = new PDFParser();
      const pdfData = await new Promise((resolve, reject) => {
        pdfParser.on('pdfParser_dataReady', resolve);
        pdfParser.on('pdfParser_dataError', reject);
        pdfParser.loadPDF(filePath);
      });
      const totalPages = (pdfData as any).Pages.length;

      console.log('Total pages:', totalPages);
      const imagePaths: string[] = [];

      // Create converter instance
      const convert = fromPath(filePath, options);

      // Convert each page
      for (let i = 1; i <= totalPages; i++) {
        try {
          console.log(`Converting page ${i}/${totalPages}`);
          
          // Convert current page
          const result = await convert(i);
          console.log('Conversion result:', result);
          
          if (result.path) {
            imagePaths.push(result.path);
          }
          
          progressCallback(Math.round((i / totalPages) * 100));
        } catch (error) {
          console.error(`Error converting page ${i}:`, error);
          throw error;
        }
      }

      console.log('Conversion complete. Generated images:', imagePaths);
      return imagePaths;
    } catch (error) {
      console.error('Conversion error:', error);
      throw error;
    }
  }

  async convertDirectoryToImages(dirPath: string, progressCallback: (progress: number) => void): Promise<string[]> {
    try {
      const files = await fs.promises.readdir(dirPath);
      const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
      const convertedFiles: string[] = [];
      
      if (pdfFiles.length === 0) {
        throw new Error('No PDF files found in directory');
      }
      
      for (let i = 0; i < pdfFiles.length; i++) {
        const file = pdfFiles[i];
        const filePath = path.join(dirPath, file);
        try {
          const imagePaths = await this.convertToImages(filePath, (fileProgress) => {
            // Calculate total progress considering all files
            const totalProgress = Math.round(((i + fileProgress / 100) / pdfFiles.length) * 100);
            progressCallback(totalProgress);
          });
          convertedFiles.push(...imagePaths);
        } catch (error) {
          console.error(`Error converting ${filePath}:`, error);
          throw error;
        }
      }
      
      return convertedFiles;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to process directory ${dirPath}: ${error.message}`);
      }
      throw new Error(`Failed to process directory ${dirPath}: Unknown error`);
    }
  }

  private async getPageCount(filePath: string): Promise<number> {
    const pdfParser = new PDFParser();
    const pdfData = await new Promise((resolve, reject) => {
      pdfParser.on('pdfParser_dataReady', resolve);
      pdfParser.on('pdfParser_dataError', reject);
      pdfParser.loadPDF(filePath);
    });
    
    return (pdfData as any).Pages.length;
  }
}