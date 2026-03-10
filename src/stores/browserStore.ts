// Zustand Store: BrowserUIState
// MVVM state management decoupled from engine specifics.
// Syncs with Electron main process via IPC events.
// All actions go through IPC — this always runs inside Electron.

import { create } from 'zustand';
import type { TabState, BrowserUIState } from '@/types/electron';

interface BrowserStore extends BrowserUIState {
    // State setters
    setUIState: (state: BrowserUIState) => void;

    // Actions (call IPC and update state)
    openTab: (url?: string) => Promise<void>;
    closeTab: (tabId: string) => Promise<void>;
    navigateToUrl: (tabId: string, url: string) => Promise<void>;
    setActiveTab: (tabId: string) => Promise<void>;
    goBack: () => Promise<void>;
    goForward: () => Promise<void>;
    reload: () => Promise<void>;

    // Side panel
    toggleSidePanel: (panel: string) => void;
    closeSidePanel: () => void;

    // Init
    initialize: () => void;
}

export const useBrowserStore = create<BrowserStore>((set, get) => ({
    // Initial state
    tabs: [],
    activeTabId: null,
    isPrivateMode: false,
    sidePanel: { isOpen: false, activePanel: null },

    setUIState: (state: BrowserUIState) => {
        set({
            tabs: state.tabs,
            activeTabId: state.activeTabId,
            isPrivateMode: state.isPrivateMode,
            sidePanel: state.sidePanel,
        });
    },

    openTab: async (url?: string) => {
        await window.browserAPI.openTab(url);
    },

    closeTab: async (tabId: string) => {
        const state = await window.browserAPI.closeTab(tabId);
        get().setUIState(state);
    },

    navigateToUrl: async (tabId: string, url: string) => {
        const state = await window.browserAPI.navigateToUrl(tabId, url);
        get().setUIState(state);
    },

    setActiveTab: async (tabId: string) => {
        const state = await window.browserAPI.setActiveTab(tabId);
        get().setUIState(state);
    },

    goBack: async () => {
        const { activeTabId } = get();
        if (!activeTabId) return;
        const state = await window.browserAPI.goBack(activeTabId);
        get().setUIState(state);
    },

    goForward: async () => {
        const { activeTabId } = get();
        if (!activeTabId) return;
        const state = await window.browserAPI.goForward(activeTabId);
        get().setUIState(state);
    },

    reload: async () => {
        const { activeTabId } = get();
        if (!activeTabId) return;
        const state = await window.browserAPI.reload(activeTabId);
        get().setUIState(state);
    },

    toggleSidePanel: (panel: string) => {
        const current = get().sidePanel;
        if (current.isOpen && current.activePanel === panel) {
            set({ sidePanel: { isOpen: false, activePanel: null } });
        } else {
            set({ sidePanel: { isOpen: true, activePanel: panel } });
        }
    },

    closeSidePanel: () => {
        set({ sidePanel: { isOpen: false, activePanel: null } });
    },

    initialize: () => {
        // Listen for state changes from the main process
        window.browserAPI.onTabStateChange((state) => {
            get().setUIState(state);
        });

        // Fetch initial state
        window.browserAPI.getUIState().then((state) => {
            get().setUIState(state);
        });
    },
}));
