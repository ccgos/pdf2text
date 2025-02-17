export interface WorkerEventTarget {
  addEventListener(type: string, listener: (event: any) => void): void;
  removeEventListener(type: string, listener: (event: any) => void): void;
  postMessage(message: any): void;
}

export interface WorkerGlobalScope {
  self: WorkerEventTarget;
  postMessage(message: any): void;
  addEventListener(type: string, listener: (event: any) => void): void;
  removeEventListener(type: string, listener: (event: any) => void): void;
  importScripts(...urls: string[]): void;
} 