// TypeScript declarations for the browserAPI exposed via contextBridge
// This file ensures type safety when calling IPC methods from React components.

export interface TabState {
    id: string;
    url: string;
    title: string;
    favicon: string;
    isLoading: boolean;
    canGoBack: boolean;
    canGoForward: boolean;
    isActive: boolean;
    isPrivate: boolean;
    createdAt: number;
    hoverUrl?: string;
}

export interface BrowserUIState {
    tabs: TabState[];
    activeTabId: string | null;
    isPrivateMode: boolean;
    sidePanel: {
        isOpen: boolean;
        activePanel: string | null;
    };
}

export interface BrowserAPI {
    // Browser Core
    openTab: (url?: string) => Promise<TabState>;
    closeTab: (tabId: string) => Promise<BrowserUIState>;
    navigateToUrl: (tabId: string, url: string) => Promise<BrowserUIState>;
    setActiveTab: (tabId: string) => Promise<BrowserUIState>;
    goBack: (tabId: string) => Promise<BrowserUIState>;
    goForward: (tabId: string) => Promise<BrowserUIState>;
    reload: (tabId: string) => Promise<BrowserUIState>;
    getUIState: () => Promise<BrowserUIState>;
    updateBounds: (bounds: { x: number; y: number; width: number; height: number }) => Promise<void>;

    // Window Controls
    minimizeWindow: () => Promise<void>;
    maximizeWindow: () => Promise<void>;
    closeWindow: () => Promise<void>;

    // AI Copilot (Phase 3)
    requestSummary: (tabId: string) => Promise<string>;
    chatAboutPage: (tabId: string, query: string) => Promise<string>;

    // Agent Runtime (Phase 4)
    runAgentTask: (taskConfig: any) => Promise<any>;
    approveAgentAction: (taskId: string, actionId: string) => Promise<any>;
    cancelAgentTask: (taskId: string) => Promise<void>;

    // Events
    onTabStateChange: (callback: (state: BrowserUIState) => void) => () => void;
    onAgentObservation: (callback: (observation: any) => void) => () => void;
}

declare global {
    interface Window {
        browserAPI: BrowserAPI;
    }
}

export { };
