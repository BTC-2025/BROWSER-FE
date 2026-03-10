// Preload Script
// Security bridge between untrusted renderers and the main process.
// Uses contextBridge to expose a typed API — no direct ipcRenderer exposure.

import { contextBridge, ipcRenderer } from 'electron';

// Types matching the domain entities
interface TabState {
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
}

interface BrowserUIState {
    tabs: TabState[];
    activeTabId: string | null;
    isPrivateMode: boolean;
    sidePanel: {
        isOpen: boolean;
        activePanel: string | null;
    };
}

contextBridge.exposeInMainWorld('browserAPI', {
    // --- Browser Core Intents ---
    openTab: (url?: string) => ipcRenderer.invoke('core:openTab', url),
    closeTab: (tabId: string) => ipcRenderer.invoke('core:closeTab', tabId),
    navigateToUrl: (tabId: string, url: string) => ipcRenderer.invoke('core:navigateToUrl', tabId, url),
    setActiveTab: (tabId: string) => ipcRenderer.invoke('core:setActiveTab', tabId),
    goBack: (tabId: string) => ipcRenderer.invoke('core:goBack', tabId),
    goForward: (tabId: string) => ipcRenderer.invoke('core:goForward', tabId),
    reload: (tabId: string) => ipcRenderer.invoke('core:reload', tabId),
    getUIState: () => ipcRenderer.invoke('core:getUIState'),
    updateBounds: (bounds: { x: number; y: number; width: number; height: number }) =>
        ipcRenderer.invoke('core:updateBounds', bounds),

    // --- Window Controls ---
    minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
    maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
    closeWindow: () => ipcRenderer.invoke('window:close'),

    // --- AI Copilot Intents (Phase 3) ---
    requestSummary: (tabId: string) => ipcRenderer.invoke('ai:requestSummary', tabId),
    chatAboutPage: (tabId: string, query: string) => ipcRenderer.invoke('ai:chatAboutPage', tabId, query),

    // --- Agent Runtime Intents (Phase 4) ---
    runAgentTask: (taskConfig: any) => ipcRenderer.invoke('agent:runTask', taskConfig),
    approveAgentAction: (taskId: string, actionId: string) => ipcRenderer.invoke('agent:approveAction', taskId, actionId),
    cancelAgentTask: (taskId: string) => ipcRenderer.invoke('agent:cancelTask', taskId),

    // --- Event Listeners (Main → Renderer) ---
    onTabStateChange: (callback: (state: BrowserUIState) => void) => {
        const handler = (_event: any, state: BrowserUIState) => callback(state);
        ipcRenderer.on('ui:tabStateUpdated', handler);
        return () => {
            ipcRenderer.removeListener('ui:tabStateUpdated', handler);
        };
    },
    onAgentObservation: (callback: (observation: any) => void) => {
        const handler = (_event: any, observation: any) => callback(observation);
        ipcRenderer.on('ui:agentObservation', handler);
        return () => {
            ipcRenderer.removeListener('ui:agentObservation', handler);
        };
    },
});
