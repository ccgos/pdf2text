import * as path from 'path';
import * as fs from 'fs';
import { EventEmitter } from 'events';
import { WorkerEventTarget, WorkerGlobalScope } from './types';

console.log('Setting up PDF.js worker...');

// Import PDF.js using require for better Node.js compatibility
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

// Create a fake worker environment
class NodeWorker extends EventEmitter implements WorkerEventTarget {
  constructor() {
    super();
    console.log('Creating NodeWorker instance');
  }

  addEventListener(type: string, listener: (event: any) => void): void {
    console.log('Adding event listener:', type);
    this.addListener(type, listener);
  }

  removeEventListener(type: string, listener: (event: any) => void): void {
    console.log('Removing event listener:', type);
    this.removeListener(type, listener);
  }

  postMessage(data: any): void {
    console.log('Worker received message:', data);
    // Process the message and emit response
    setImmediate(() => {
      if (data.cmd === '_ready') {
        console.log('Worker sending ready response');
        this.emit('message', { cmd: '_ready', result: true });
      } else {
        console.log('Worker processing command:', data.cmd);
        this.emit('message', { cmd: data.cmd, result: data });
      }
    });
  }
}

// Create a fake worker port
const fakeWorker = new NodeWorker();
const fakePort: WorkerEventTarget = {
  postMessage: (data: any) => {
    console.log('Port sending message:', data);
    fakeWorker.emit('message', data);
  },
  addEventListener: (type: string, handler: (event: any) => void) => {
    console.log('Port adding listener:', type);
    fakeWorker.on(type, handler);
  },
  removeEventListener: (type: string, handler: (event: any) => void) => {
    console.log('Port removing listener:', type);
    fakeWorker.off(type, handler);
  },
};

// Configure PDF.js to use our fake worker
console.log('Configuring PDF.js worker...');
pdfjsLib.GlobalWorkerOptions.workerPort = fakePort;

// Get the worker script path and load it
const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
const workerPath = path.join(pdfjsDistPath, 'legacy', 'build', 'pdf.worker.js');

console.log('Worker path:', workerPath);
console.log('Worker exists:', fs.existsSync(workerPath));

if (fs.existsSync(workerPath)) {
  const workerSrc = fs.readFileSync(workerPath, 'utf8');
  console.log('Worker source loaded, length:', workerSrc.length);
  
  // Create a worker context
  const vm = require('vm');
  const context = vm.createContext({
    self: fakeWorker,
    require,
    __dirname,
    __filename: workerPath,
    postMessage: (data: any) => {
      console.log('Context postMessage called:', data);
      fakePort.postMessage(data);
    },
    addEventListener: (type: string, handler: (event: any) => void) => {
      console.log('Context addEventListener called:', type);
      fakeWorker.addEventListener(type, handler);
    },
    removeEventListener: (type: string, handler: (event: any) => void) => {
      console.log('Context removeEventListener called:', type);
      fakeWorker.removeEventListener(type, handler);
    },
    importScripts: () => {
      console.log('importScripts called (no-op)');
    },
  } as WorkerGlobalScope);
  
  // Run the worker code
  console.log('Running worker code...');
  vm.runInContext(workerSrc, context);
  console.log('Worker code executed successfully');
} else {
  throw new Error(`PDF.js worker not found at: ${workerPath}`);
}

console.log('PDF.js worker setup complete');

export { pdfjsLib }; 