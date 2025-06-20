
interface Window {
  UnicornStudio?: {
    isInitialized: boolean;
    init: () => void;
  };
}

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init: () => void;
    };
  }
  
  const UnicornStudio: {
    init: () => void;
  };
}

export {};
