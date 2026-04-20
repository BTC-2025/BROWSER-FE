'use client';

import React, { useState, useEffect } from 'react';
import { useBrowserStore } from '@/stores/browserStore';

export default function TabStrip() {
    const { tabs, activeTabId, openTab, closeTab, setActiveTab } = useBrowserStore();
    const [isElectron, setIsElectron] = useState(false);

    // Detect Electron only after mount so server and initial client render match
    useEffect(() => {
        setIsElectron(!!window.browserAPI);
    }, []);

    const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
        e.stopPropagation();
        closeTab(tabId);
    };
    const handleCloseWindow = () => window.browserAPI?.closeWindow();
    const handleMinimizeWindow = () => window.browserAPI?.minimizeWindow();
    const handleMaximizeWindow = () => window.browserAPI?.maximizeWindow();

    return (
        <div className="flex items-end px-2 pt-2 gap-2 select-none drag" style={{ height: '40px' }}>
            {/* Window Controls — only show in Electron, not in browser dev mode */}
            {isElectron && (
                <div className="flex items-center gap-2 px-3 pb-2 no-drag">
                    <div
                        className="w-3 h-3 rounded-full bg-red-500 hover:brightness-110 transition-all cursor-pointer"
                        onClick={handleCloseWindow}
                    />
                    <div
                        className="w-3 h-3 rounded-full bg-yellow-500 hover:brightness-110 transition-all cursor-pointer"
                        onClick={handleMinimizeWindow}
                    />
                    <div
                        className="w-3 h-3 rounded-full bg-green-500 hover:brightness-110 transition-all cursor-pointer"
                        onClick={handleMaximizeWindow}
                    />
                </div>
            )}

            {/* Tab List */}
            <div className="flex flex-1 gap-1 overflow-x-auto no-scrollbar items-end h-full no-drag">
                {tabs.map((tab) => {
                    const isActive = tab.id === activeTabId;
                    return (
                        <div
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                group relative flex items-center gap-2 px-4 py-2
                min-w-[160px] max-w-[240px] h-full
                rounded-t-lg text-xs font-medium cursor-pointer
                transition-colors
                ${isActive
                                    ? 'bg-[#DDEEFF] text-[#0A1F44] border-t border-x border-[#A6C8FF]/50'
                                    : 'hover:bg-[#DDEEFF]/50 text-[#5F7FA6] hover:text-[#0A1F44]'
                                }
              `}
                        >
                            {/* Tab Favicon */}
                            {tab.favicon ? (
                                <img src={tab.favicon} alt="" className="w-4 h-4 rounded-sm" />
                            ) : (
                                <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-[#004AAD]' : ''}`}>
                                    {tab.url === 'dive://newtab' ? 'public' : 'language'}
                                </span>
                            )}

                            {/* Tab Title */}
                            <span className="truncate flex-1">{tab.title}</span>

                            {/* Loading Indicator */}
                            {tab.isLoading && (
                                <span className="material-symbols-outlined text-[14px] animate-spin text-[#004AAD]">
                                    progress_activity
                                </span>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={(e) => handleCloseTab(e, tab.id)}
                                className="opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded p-0.5 transition-opacity"
                            >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>

                            {/* Active Tab Indicator */}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#004AAD]" />
                            )}
                        </div>
                    );
                })}

                {/* New Tab Button */}
                <button
                    onClick={() => openTab()}
                    className="flex items-center justify-center w-8 h-8 hover:bg-[#DDEEFF]/50 rounded-lg text-[#5F7FA6] hover:text-[#0A1F44] transition-colors mb-1 ml-1"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
            </div>
        </div>
    );
}
