// Domain Entity: BrowserUIState
// Aggregate state for the entire browser UI

import { TabState } from './TabState';

export interface BrowserUIState {
    /** All open tabs */
    tabs: TabState[];
    /** ID of the currently active tab */
    activeTabId: string | null;
    /** Whether private browsing mode is globally active */
    isPrivateMode: boolean;
    /** Side panel state */
    sidePanel: {
        isOpen: boolean;
        activePanel: 'ai' | 'bookmarks' | 'history' | 'downloads' | null;
    };
}

export function createDefaultBrowserUIState(): BrowserUIState {
    return {
        tabs: [],
        activeTabId: null,
        isPrivateMode: false,
        sidePanel: {
            isOpen: false,
            activePanel: null,
        },
    };
}
