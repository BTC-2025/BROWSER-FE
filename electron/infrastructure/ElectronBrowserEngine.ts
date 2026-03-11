// Infrastructure: ElectronBrowserEngine
// Concrete implementation of IBrowserEngine using Electron's WebContentsView API.
// Uses BaseWindow.contentView.addChildView() for tab management.
// Implements aggressive tab suspension for 8GB RAM defense.

import { BaseWindow, WebContentsView, session } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { IBrowserEngine } from '../domain/interfaces/IBrowserEngine';
import { TabState, createDefaultTabState } from '../domain/entities/TabState';
import { BrowserUIState, createDefaultBrowserUIState } from '../domain/entities/BrowserUIState';

interface TabEntry {
    state: TabState;
    view: WebContentsView | null; // null when suspended
    isSuspended: boolean;
}

export class ElectronBrowserEngine implements IBrowserEngine {
    private window: BaseWindow;
    private tabs: Map<string, TabEntry> = new Map();
    private activeTabId: string | null = null;
    private stateListeners: Array<(state: BrowserUIState) => void> = [];
    private contentBounds = { x: 0, y: 0, width: 800, height: 600 };
    private isPrivateMode = false;

    constructor(window: BaseWindow) {
        this.window = window;
    }

    async createTab(url?: string): Promise<TabState> {
        const id = uuidv4();
        const tabState = createDefaultTabState(id, url);

        const view = this.createWebContentsView();
        this.tabs.set(id, { state: tabState, view, isSuspended: false });

        // If we have an active tab, deactivate it first
        if (this.activeTabId) {
            const prevEntry = this.tabs.get(this.activeTabId);
            if (prevEntry) {
                prevEntry.state.isActive = false;
                if (prevEntry.view) {
                    prevEntry.view.setVisible(false);
                }
            }
        }

        // Activate the new tab
        this.activeTabId = id;
        tabState.isActive = true;

        // Add view to window's content view
        this.window.contentView.addChildView(view);
        view.setBounds(this.contentBounds);
        view.setVisible(true);

        // Navigate if URL provided and not the internal new tab page
        if (url && url !== 'nexus://newtab') {
            this.setupViewListeners(id, view);
            view.webContents.loadURL(this.normalizeUrl(url));
            tabState.isLoading = true;
        } else {
            this.setupViewListeners(id, view);
        }

        this.emitStateChange();
        return { ...tabState };
    }

    async closeTab(tabId: string): Promise<void> {
        const entry = this.tabs.get(tabId);
        if (!entry) return;

        // Destroy the WebContentsView
        if (entry.view) {
            this.window.contentView.removeChildView(entry.view);
            (entry.view.webContents as any)?.close?.();
        }

        this.tabs.delete(tabId);

        // If we closed the active tab, activate another
        if (this.activeTabId === tabId) {
            const remaining = Array.from(this.tabs.keys());
            if (remaining.length > 0) {
                this.setActiveTab(remaining[remaining.length - 1]);
            } else {
                this.activeTabId = null;
            }
        }

        this.emitStateChange();
    }

    async navigateTo(tabId: string, url: string): Promise<void> {
        const entry = this.tabs.get(tabId);
        if (!entry) return;

        // If tab is suspended, restore it first
        if (entry.isSuspended) {
            await this.restoreTab(tabId);
        }

        const normalizedUrl = this.normalizeUrl(url);
        entry.state.url = normalizedUrl;

        if (normalizedUrl.startsWith('nexus://')) {
            // Internal pages are rendered by the React UI (WebViewContainer), 
            // so we don't load them in the Chromium WebContentsView.
            entry.state.isLoading = false;
            if (entry.view) {
                entry.view.webContents.loadURL('about:blank');
            }
        } else {
            // Real web pages
            entry.state.isLoading = true;
            if (entry.view) {
                entry.view.webContents.loadURL(normalizedUrl);
            }
        }

        this.emitStateChange();
    }

    async goBack(tabId: string): Promise<void> {
        const entry = this.tabs.get(tabId);
        if (entry?.view?.webContents.canGoBack()) {
            entry.view.webContents.goBack();
        }
    }

    async goForward(tabId: string): Promise<void> {
        const entry = this.tabs.get(tabId);
        if (entry?.view?.webContents.canGoForward()) {
            entry.view.webContents.goForward();
        }
    }

    async reload(tabId: string): Promise<void> {
        const entry = this.tabs.get(tabId);
        if (entry?.view) {
            entry.state.isLoading = true;
            entry.view.webContents.reload();
            this.emitStateChange();
        }
    }

    getTabState(tabId: string): TabState | undefined {
        const entry = this.tabs.get(tabId);
        return entry ? { ...entry.state } : undefined;
    }

    getAllTabs(): TabState[] {
        return Array.from(this.tabs.values()).map((e) => ({ ...e.state }));
    }

    getActiveTabId(): string | null {
        return this.activeTabId;
    }

    setActiveTab(tabId: string): void {
        const entry = this.tabs.get(tabId);
        if (!entry) return;

        // Deactivate current tab
        if (this.activeTabId && this.activeTabId !== tabId) {
            const prevEntry = this.tabs.get(this.activeTabId);
            if (prevEntry) {
                prevEntry.state.isActive = false;
                if (prevEntry.view) {
                    prevEntry.view.setVisible(false);
                }
            }
        }

        // If tab is suspended, restore it
        if (entry.isSuspended) {
            // Synchronous restore for user-initiated tab switch
            this.restoreTab(tabId);
        }

        // Activate new tab
        this.activeTabId = tabId;
        entry.state.isActive = true;
        if (entry.view) {
            entry.view.setVisible(true);
            entry.view.setBounds(this.contentBounds);
        }

        this.emitStateChange();
    }

    // --- Tab Suspension (8GB RAM Defense) ---

    async suspendTab(tabId: string): Promise<void> {
        const entry = this.tabs.get(tabId);
        if (!entry || entry.isSuspended || tabId === this.activeTabId) return;

        // Destroy the WebContentsView but keep the TabState
        if (entry.view) {
            this.window.contentView.removeChildView(entry.view);
            (entry.view.webContents as any)?.close?.();
            entry.view = null;
        }

        entry.isSuspended = true;
        this.emitStateChange();
    }

    async restoreTab(tabId: string): Promise<void> {
        const entry = this.tabs.get(tabId);
        if (!entry || !entry.isSuspended) return;

        // Recreate the WebContentsView
        const view = this.createWebContentsView();
        entry.view = view;
        entry.isSuspended = false;

        this.window.contentView.addChildView(view);
        view.setBounds(this.contentBounds);
        this.setupViewListeners(tabId, view);

        // Reload the last URL
        if (entry.state.url && entry.state.url !== 'nexus://newtab') {
            entry.state.isLoading = true;
            view.webContents.loadURL(entry.state.url);
        }

        this.emitStateChange();
    }

    async unloadTab(tabId: string): Promise<void> {
        return this.suspendTab(tabId);
    }

    isTabSuspended(tabId: string): boolean {
        const entry = this.tabs.get(tabId);
        return entry?.isSuspended ?? false;
    }

    // --- State Management ---

    getUIState(): BrowserUIState {
        return {
            tabs: this.getAllTabs(),
            activeTabId: this.activeTabId,
            isPrivateMode: this.isPrivateMode,
            sidePanel: { isOpen: false, activePanel: null },
        };
    }

    onStateChange(callback: (state: BrowserUIState) => void): void {
        this.stateListeners.push(callback);
    }

    updateBounds(bounds: { x: number; y: number; width: number; height: number }): void {
        this.contentBounds = bounds;

        // Update all visible views
        for (const entry of this.tabs.values()) {
            if (entry.view && entry.state.isActive) {
                entry.view.setBounds(bounds);
            }
        }
    }

    destroy(): void {
        for (const entry of this.tabs.values()) {
            if (entry.view) {
                this.window.contentView.removeChildView(entry.view);
                (entry.view.webContents as any)?.close?.();
            }
        }
        this.tabs.clear();
        this.stateListeners = [];
    }

    // --- Private Helpers ---

    private createWebContentsView(): WebContentsView {
        const view = new WebContentsView({
            webPreferences: {
                sandbox: true,
                contextIsolation: true,
                nodeIntegration: false,
                webviewTag: false,
                spellcheck: true,
            },
        });
        return view;
    }

    private setupViewListeners(tabId: string, view: WebContentsView): void {
        const wc = view.webContents;

        // Handle target="_blank" links and window.open() calls — open in a new tab
        wc.setWindowOpenHandler(({ url }) => {
            if (url && url !== 'about:blank') {
                // Open in a new tab inside our browser
                this.createTab(url);
            }
            // Always deny the native popup — we handle it ourselves above
            return { action: 'deny' };
        });

        wc.on('did-start-loading', () => {
            const entry = this.tabs.get(tabId);
            if (entry) {
                entry.state.isLoading = true;
                this.emitStateChange();
            }
        });

        wc.on('did-stop-loading', () => {
            const entry = this.tabs.get(tabId);
            if (entry) {
                entry.state.isLoading = false;
                this.emitStateChange();
            }
        });

        wc.on('did-navigate', (_event, url) => {
            const entry = this.tabs.get(tabId);
            if (entry) {
                entry.state.url = url;
                entry.state.canGoBack = wc.canGoBack();
                entry.state.canGoForward = wc.canGoForward();
                this.emitStateChange();
            }
        });

        wc.on('did-navigate-in-page', (_event, url) => {
            const entry = this.tabs.get(tabId);
            if (entry) {
                entry.state.url = url;
                entry.state.canGoBack = wc.canGoBack();
                entry.state.canGoForward = wc.canGoForward();
                this.emitStateChange();
            }
        });

        wc.on('page-title-updated', (_event, title) => {
            const entry = this.tabs.get(tabId);
            if (entry) {
                entry.state.title = title;
                this.emitStateChange();
            }
        });

        wc.on('page-favicon-updated', (_event, favicons) => {
            const entry = this.tabs.get(tabId);
            if (entry && favicons.length > 0) {
                entry.state.favicon = favicons[0];
                this.emitStateChange();
            }
        });
    }

    private normalizeUrl(url: string): string {
        if (url === 'nexus://newtab') return url;
        if (url.match(/^https?:\/\//)) return url;
        if (url.includes('.') && !url.includes(' ')) return `https://${url}`;
        return `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    }

    private emitStateChange(): void {
        const state = this.getUIState();
        for (const listener of this.stateListeners) {
            try {
                listener(state);
            } catch (err) {
                console.error('[ElectronBrowserEngine] State listener error:', err);
            }
        }
    }
}
