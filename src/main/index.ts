import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as remoteMain from '@electron/remote/main';
import { PdfConverter } from './pdfConverter';
import * as fs from 'fs';

remoteMain.initialize();

const pdfConverter = new PdfConverter();

console.log('Setting up main process...');

function createWindow() {
  console.log('Creating main window...');
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
  });

  const htmlPath = path.join(__dirname, 'index.html');
  console.log('Loading HTML from:', htmlPath);
  console.log('File exists:', fs.existsSync(htmlPath));
  console.log('Directory contents:', fs.readdirSync(__dirname));

  if (!fs.existsSync(htmlPath)) {
    console.error('HTML file not found! Creating window with error message...');
    win.loadURL(`data:text/html,
      <html>
        <body>
          <h1>Error: Could not load application</h1>
          <p>The main HTML file was not found at: ${htmlPath}</p>
          <pre>${fs.readdirSync(__dirname).join('\n')}</pre>
        </body>
      </html>
    `);
  } else {
    win.loadFile(htmlPath);
  }

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }

  win.webContents.on('did-finish-load', () => {
    console.log('Window loaded successfully');
  });

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load window:', errorCode, errorDescription);
  });
}

app.whenReady().then(() => {
  console.log('App ready, setting up IPC handlers...');

  createWindow();

  // Set up IPC handlers
  ipcMain.handle('select-file', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
    });
    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.handle('convert-file', async (_, filePath: string) => {
    return await pdfConverter.convertFile(filePath);
  });

  ipcMain.handle('convert-directory', async (event, dirPath: string) => {
    try {
      return await pdfConverter.processDirectory(dirPath, (progress) => {
        // Send progress updates to the renderer
        event.sender.send('conversion-progress', progress);
      });
    } catch (error) {
      throw error;
    }
  });

  ipcMain.handle('delete-file', async (_, filePath: string) => {
    return await pdfConverter.deleteFile(filePath);
  });

  ipcMain.handle('convert-to-images', async (event, filePath: string) => {
    console.log('Main process: convert-to-images called with:', filePath);
    try {
      const result = await pdfConverter.convertToImages(filePath, (progress) => {
        console.log('Conversion progress:', progress);
        event.sender.send('conversion-progress', progress);
      });
      console.log('Main process: conversion complete:', result);
      return result;
    } catch (error) {
      console.error('Main process: conversion error:', error);
      throw error;
    }
  });

  ipcMain.handle('convert-directory-to-images', async (event, dirPath: string) => {
    try {
      return await pdfConverter.convertDirectoryToImages(dirPath, (progress: number) => {
        event.sender.send('conversion-progress', progress);
      });
    } catch (error) {
      console.error('Directory image conversion error:', error);
      throw error;
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 