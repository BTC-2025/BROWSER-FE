// Domain Interface: IBrowserEngine
// Core abstraction implementing Dependency Inversion Principle.
// High-level agents and use cases depend on this interface,
// allowing the underlying Chromium bindings to be swapped.

import { TabState } from '../entities/TabState';
import { BrowserUIState } from '../entities/BrowserUIState';

export interface IBrowserEngine {
    /** Create a new tab, optionally with an initial URL */
    createTab(url?: string): Promise<TabState>;

    /** Close a tab by its ID */
    closeTab(tabId: string): Promise<void>;

    /** Navigate the specified tab to a URL */
    navigateTo(tabId: string, url: string): Promise<void>;

    /** Go back in the specified tab's history */
    goBack(tabId: string): Promise<void>;

    /** Go forward in the specified tab's history */
    goForward(tabId: string): Promise<void>;

    /** Reload the specified tab */
    reload(tabId: string): Promise<void>;

    /** Get the current state of a specific tab */
    getTabState(tabId: string): TabState | undefined;

    /** Get all open tabs */
    getAllTabs(): TabState[];

    /** Get the ID of the currently active tab */
    getActiveTabId(): string | null;

    /** Switch the active (visible) tab */
    setActiveTab(tabId: string): void;

    /** Suspend an inactive tab — destroys WebContentsView but keeps TabState to free RAM */
    suspendTab(tabId: string): Promise<void>;

    /** Restore a previously suspended tab — recreates WebContentsView and reloads URL */
    restoreTab(tabId: string): Promise<void>;

    /** Alias for suspendTab — used by MemoryManager */
    unloadTab(tabId: string): Promise<void>;

    /** Check if a tab is currently suspended (unloaded from memory) */
    isTabSuspended(tabId: string): boolean;

    /** Get the full aggregated UI state */
    getUIState(): BrowserUIState;

    /** Register a callback for state changes */
    onStateChange(callback: (state: BrowserUIState) => void): void;

    /** Update view bounds when window resizes */
    updateBounds(bounds: { x: number; y: number; width: number; height: number }): void;

    /** Bring the React UI to the front of all WebContentsViews */
    setUIOnTop?(onTop: boolean): void;

    /** Cleanup all resources */
    destroy(): void;
}
