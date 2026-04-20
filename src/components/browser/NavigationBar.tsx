'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useBrowserStore } from '@/stores/browserStore';
import { useAICopilotStore } from '@/stores/aiCopilotStore';

import { useMemorySecurityStore } from '@/stores/memorySecurityStore';
import { useSettingsStore, searchEngineUrls } from '@/stores/settingsStore';
import BrowserMenu from './BrowserMenu';

export default function NavigationBar() {
    const { tabs, activeTabId, goBack, goForward, reload, navigateToUrl } = useBrowserStore();
    const toggleAI = useAICopilotStore((s) => s.togglePanel);
    const isAIOpen = useAICopilotStore((s) => s.isOpen);
    const toggleNotes = useMemorySecurityStore((s) => s.toggleNotePanel);
    const isNotesOpen = useMemorySecurityStore((s) => s.isNotePanelOpen);
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const searchEngine = useSettingsStore((s) => s.searchEngine);
    const accentColor = useSettingsStore((s) => s.accentColor);

    const activeTab = tabs.find((t) => t.id === activeTabId);

    // Sync input with active tab URL
    useEffect(() => {
        if (activeTab && !isFocused) {
            const displayUrl = activeTab.url === 'dive://newtab' ? '' : activeTab.url;
            setInputValue(displayUrl);
        }
    }, [activeTab?.url, activeTab?.id, isFocused]);

    const handleNavigate = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTabId && inputValue.trim()) {
            const raw = inputValue.trim();
            let url = raw;
            // Internal pages
            if (raw.startsWith('dive://')) {
                url = raw;
            }
            // Already a full URL
            else if (raw.startsWith('http://') || raw.startsWith('https://')) {
                url = raw;
            }
            // Looks like a URL (has dot, no spaces)
            else if (raw.includes('.') && !raw.includes(' ')) {
                url = `https://${raw}`;
            }
            // Treat as search query via user's configured search engine
            else {
                const searchPrefix = searchEngineUrls[searchEngine] || searchEngineUrls.google;
                url = `${searchPrefix}${encodeURIComponent(raw)}`;
            }
            navigateToUrl(activeTabId, url);
            inputRef.current?.blur();
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
        // Select all text on focus for easy replacement
        setTimeout(() => inputRef.current?.select(), 0);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            inputRef.current?.blur();
        }
    };

    const isNewTab = !activeTab || activeTab.url === 'dive://newtab';
    const isSecure = activeTab?.url?.startsWith('https://');

    return (
        <div
            className="flex items-center gap-3 px-4 py-2 no-drag"
            style={{ background: '#F4F8FF', borderTop: '1px solid #DDEEFF' }}
        >
            {/* Navigation Controls */}
            <div className="flex items-center gap-1 text-[#5F7FA6]">
                <button
                    onClick={goBack}
                    disabled={!activeTab?.canGoBack}
                    className="p-1.5 hover:bg-[#DDEEFF] rounded-lg transition-colors hover:text-[#0A1F44] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <button
                    onClick={goForward}
                    disabled={!activeTab?.canGoForward}
                    className="p-1.5 hover:bg-[#DDEEFF] rounded-lg transition-colors hover:text-[#0A1F44] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
                <button
                    onClick={reload}
                    className="p-1.5 hover:bg-[#DDEEFF] rounded-lg transition-colors hover:text-[#0A1F44]"
                >
                    <span className={`material-symbols-outlined text-[20px] ${activeTab?.isLoading ? 'animate-spin' : ''}`}>
                        {activeTab?.isLoading ? 'progress_activity' : 'refresh'}
                    </span>
                </button>
            </div>

            {/* Omnibox */}
            <form onSubmit={handleNavigate} className="flex-1 max-w-3xl mx-auto">
                <div
                    className={`
            group relative flex items-center w-full h-9 
            bg-[#E9F4FF] border rounded-full px-3 
            transition-all shadow-inner
            ${isFocused
                            ? 'ring-2'
                            : 'border-[#DDEEFF] hover:border-[#A6C8FF]'
                        }
          `}
                    style={isFocused ? { borderColor: accentColor, '--tw-ring-color': `${accentColor}80` } as React.CSSProperties : {}}
                >
                    {/* Security Indicator */}
                    {!isNewTab && (
                        <span className={`material-symbols-outlined text-[18px] mr-2 ${isSecure ? 'text-[#004AAD]' : 'text-[#8FA9C9]'}`}>
                            {isSecure ? 'lock' : 'info'}
                        </span>
                    )}
                    {isNewTab && (
                        <span className="material-symbols-outlined text-[18px] mr-2 text-[#8FA9C9]">search</span>
                    )}

                    {/* URL Prefix */}
                    {!isFocused && !isNewTab && activeTab?.url?.startsWith('https://') && (
                        <span className="text-[#8FA9C9] text-sm mr-0.5">https://</span>
                    )}

                    {/* Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={isFocused ? inputValue : (isNewTab ? '' : inputValue.replace(/^https?:\/\//, ''))}
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        placeholder="Search or type a URL"
                        className="flex-1 bg-transparent border-none p-0 text-sm text-[#0A1F44] placeholder-slate-500 focus:outline-none focus:ring-0"
                    />

                    {/* Bookmark Star */}
                    <div className="flex items-center gap-1 ml-2">
                        <button
                            type="button"
                            className="p-1 hover:bg-[#DDEEFF] rounded-full text-[#5F7FA6] hover:text-[#004AAD] transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">star</span>
                        </button>
                    </div>
                </div>
            </form>

            {/* Extension Area & Menu */}
            <div className="flex items-center gap-2 pl-2" style={{ borderLeft: '1px solid #DDEEFF' }}>
                {/* AI Copilot Toggle */}
                <button
                    onClick={toggleAI}
                    className={`p-1.5 rounded-lg transition-colors relative ${isAIOpen
                        ? 'bg-[#004AAD]/20 text-[#004AAD]'
                        : 'hover:bg-[#DDEEFF] text-[#5F7FA6] hover:text-[#0A1F44]'
                        }`}
                    title="Toggle AI Copilot"
                >
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                    {isAIOpen && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#004AAD] rounded-full shadow-[0_0_6px_rgba(0, 74, 173,0.6)]" />
                    )}
                </button>



                {/* Page Notes Toggle */}
                <button
                    onClick={toggleNotes}
                    className={`p-1.5 rounded-lg transition-colors relative ${isNotesOpen
                        ? 'bg-violet-500/20 text-violet-400'
                        : 'hover:bg-[#DDEEFF] text-[#5F7FA6] hover:text-[#0A1F44]'
                        }`}
                    title="Toggle Page Notes"
                >
                    <span className="material-symbols-outlined text-[20px]">sticky_note_2</span>
                    {isNotesOpen && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
                    )}
                </button>

                <button className="p-1.5 hover:bg-[#DDEEFF] rounded-lg text-[#5F7FA6] hover:text-[#0A1F44] transition-colors relative">
                    <span className="material-symbols-outlined text-[20px]">extension</span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#004AAD] rounded-full border border-[#F4F8FF]" />
                </button>

                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#004AAD] hover:bg-[#004AAD]/90 text-[#0A1F44] rounded-lg text-xs font-bold tracking-wide transition-colors">
                    <span className="material-symbols-outlined text-[16px]">account_circle</span>
                    <span>Sign In</span>
                </button>

                <div className="relative">
                    <button
                        ref={menuButtonRef}
                        onClick={() => setIsMenuOpen((o) => !o)}
                        className={`p-1.5 rounded-lg transition-colors ${
                            isMenuOpen
                                ? 'bg-[#DDEEFF] text-[#0A1F44]'
                                : 'hover:bg-[#DDEEFF] text-[#5F7FA6] hover:text-[#0A1F44]'
                        }`}
                        title="Browser menu"
                    >
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                    <BrowserMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} triggerRef={menuButtonRef} />
                </div>
            </div>
        </div>
    );
}
