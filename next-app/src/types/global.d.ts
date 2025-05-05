// Global type declarations

// Google Analytics
interface Window {
  gtag: (
    command: 'config' | 'event' | 'js' | 'set' | 'consent',
    targetId: string,
    config?: {
      [key: string]: any;
    }
  ) => void;
  
  // Microsoft Clarity
  clarity?: (method: string, ...args: any[]) => void;
} 