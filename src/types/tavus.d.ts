// Tavus SDK type definitions
declare global {
  interface Window {
    Tavus: {
      init: (config: TavusInitConfig) => Promise<void>;
      startConversation: (config: TavusConversationConfig) => Promise<void>;
      endConversation: () => Promise<void>;
      sendMessage: (message: string) => Promise<void>;
      sendAudio: (audioBlob: Blob) => Promise<void>;
      toggleVideo: () => void;
      toggleAudio: () => void;
      disconnect: () => void;
    };
  }
}

interface TavusInitConfig {
  apiKey: string;
  onReady?: () => void;
  onError?: (error: any) => void;
  onMessage?: (message: any) => void;
  onConnectionStatusChange?: (status: string) => void;
}

interface TavusConversationConfig {
  conversationId: string;
  replicaId: string;
  container: HTMLElement | null;
  enableAudio?: boolean;
  enableVideo?: boolean;
}

export {};