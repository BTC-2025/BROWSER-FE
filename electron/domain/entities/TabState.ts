// Domain Entity: TabState
// Represents the state of a single browser tab

export interface TabState {
    /** Unique identifier for this tab */
    id: string;
    /** Current URL loaded in the tab */
    url: string;
    /** Page title */
    title: string;
    /** Favicon URL */
    favicon: string;
    /** Whether the tab is currently loading */
    isLoading: boolean;
    /** Whether forward navigation is possible */
    canGoBack: boolean;
    /** Whether backward navigation is possible */
    canGoForward: boolean;
    /** Whether this is the currently active/visible tab */
    isActive: boolean;
    /** Whether this tab is in private/incognito mode */
    isPrivate: boolean;
    /** Timestamp of when the tab was created */
    createdAt: number;
    /** URL currently hovered by the user */
    hoverUrl?: string;
}

export function createDefaultTabState(id: string, url?: string): TabState {
    return {
        id,
        url: url || 'dive://newtab',
        title: 'New Tab',
        favicon: '',
        isLoading: false,
        canGoBack: false,
        canGoForward: false,
        isActive: true,
        isPrivate: false,
        createdAt: Date.now(),
    };
}
