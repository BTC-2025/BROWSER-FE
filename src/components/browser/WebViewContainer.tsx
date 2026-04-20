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
    'dive://newtab': NewTabPage,
    'dive://history': HistoryBookmarksPage,
    'dive://bookmarks': HistoryBookmarksPage,
    'dive://settings': SettingsPage,
    'dive://downloads': DownloadsPage,
    'dive://private': PrivateBrowsingPage,
    'dive://security': SecurityPage,
};

export default function WebViewContainer() {
    const activeTab = useBrowserStore((s) => {
        return s.tabs.find((t) => t.id === s.activeTabId);
    });

    const url = activeTab?.url || 'dive://newtab';
    const InternalPage = INTERNAL_PAGES[url];

    // Render internal page if it matches a dive:// URL
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
                        <span className="material-symbols-outlined text-[48px] text-[#004AAD] animate-spin">
                            progress_activity
                        </span>
                        <p className="text-sm text-[#8FA9C9]">Loading...</p>
                    </div>
                </div>
            )}

            {/* Link Hover Status Overlay (defaults to bottom-left) */}
            {activeTab?.hoverUrl && (
                <div className="absolute bottom-0 left-0 z-50 max-w-[70%] sm:max-w-md pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div
                        className="px-3 py-1.5 text-[11px] text-slate-300 truncate rounded-tr-xl shadow-[2px_-2px_15px_rgba(0,0,0,0.5)] border-t border-r border-white/10"
                        style={{
                            background: 'rgba(23, 27, 36, 0.95)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {activeTab.hoverUrl}
                    </div>
                </div>
            )}
        </div>
    );
}
