'use client';

import React from 'react';
import TabStrip from './TabStrip';
import NavigationBar from './NavigationBar';
import { useBrowserStore } from '@/stores/browserStore';

export default function HeaderBar() {
    const activeTab = useBrowserStore((s) => {
        const tab = s.tabs.find((t) => t.id === s.activeTabId);
        return tab;
    });

    return (
        <header
            className="relative z-50 flex flex-col w-full shadow-lg"
            style={{
                background: 'rgba(17, 19, 24, 0.9)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #282e39',
            }}
        >
            {/* Loading Bar */}
            {activeTab?.isLoading && (
                <div className="loading-bar" style={{ width: '100%' }} />
            )}

            <TabStrip />
            <NavigationBar />
        </header>
    );
}
