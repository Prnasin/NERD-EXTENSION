export {};

declare global {
  const chrome: any;

  interface Window {
    chrome?: any;
    ChatbotSDK: {
      renderMyComponent: (containerId: string, props?: any) => void;
    };
  }
}
