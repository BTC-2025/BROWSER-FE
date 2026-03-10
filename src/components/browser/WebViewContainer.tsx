'use client';

import React, { useRef, useEffect } from 'react';
import { useBrowserStore } from '@/stores/browserStore';
import NewTabPage from './NewTabPage';
import HistoryBookmarksPage from '../pages/HistoryBookmarksPage';
import SettingsPage from '../pages/SettingsPage';
import DownloadsPage from '../pages/DownloadsPage';
import PrivateBrowsingPage from '../pages/PrivateBrowsingPage';
import SecurityPage from '../pages/SecurityPage';

// Internal pages rendered by React (no WebContentsView needed)
const INTERNAL_PAGES: Record<string, React.ComponentType> = {
    'nexus://newtab': NewTabPage,
    'nexus://history': HistoryBookmarksPage,
    'nexus://bookmarks': HistoryBookmarksPage,
    'nexus://settings': SettingsPage,
    'nexus://downloads': DownloadsPage,
    'nexus://private': PrivateBrowsingPage,
    'nexus://security': SecurityPage,
};

export default function WebViewContainer() {
    const activeTab = useBrowserStore((s) => {
        return s.tabs.find((t) => t.id === s.activeTabId);
    });

    const url = activeTab?.url || 'nexus://newtab';
    const InternalPage = INTERNAL_PAGES[url];

    // Render internal page if it matches a nexus:// URL
    if (InternalPage) {
        return <InternalPage />;
    }

    // For real URLs (http/https), the main process ElectronBrowserEngine
    // renders them in a WebContentsView that overlays this area.
    // We just show a transparent placeholder so the real content shows through.
    return (
        <div className="flex-1 relative" style={{ background: 'transparent' }}>
            {activeTab?.isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="flex flex-col items-center gap-4 animate-fadeIn">
                        <span className="material-symbols-outlined text-[48px] text-[#135bec] animate-spin">
                            progress_activity
                        </span>
                        <p className="text-sm text-slate-500">Loading...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
