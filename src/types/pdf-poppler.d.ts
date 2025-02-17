declare module 'pdf-poppler' {
  interface PdfToPngOptions {
    format?: 'png' | 'jpeg';
    out_dir?: string;
    out_prefix?: string;
    page?: number | null;
    scale?: number;
  }

  export function pdf2png(input: string, options: PdfToPngOptions): Promise<void>;
} 