'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useBrowserStore } from '@/stores/browserStore';

interface BrowserMenuProps {
    isOpen: boolean;
    onClose: () => void;
    triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function BrowserMenu({ isOpen, onClose, triggerRef }: BrowserMenuProps) {
    const { openTab, navigateToUrl, activeTabId, tabs } = useBrowserStore();
    const [zoom, setZoom] = useState(100);
    const [findText, setFindText] = useState('');
    const [showFind, setShowFind] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const findRef = useRef<HTMLInputElement>(null);
    const api = typeof window !== 'undefined' ? (window as any).browserAPI : null;

    // Close on outside click — but NOT when clicking the trigger button itself
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            const clickedMenu = menuRef.current && menuRef.current.contains(target);
            const clickedTrigger = triggerRef?.current && triggerRef.current.contains(target);
            if (!clickedMenu && !clickedTrigger) onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onClose, triggerRef]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    // Elevate the UI on top of TabViews when the menu opens
    useEffect(() => {
        api?.setUIOnTop?.(isOpen);
    }, [isOpen, api]);

    // Focus find input when shown
    useEffect(() => {
        if (showFind) setTimeout(() => findRef.current?.focus(), 50);
    }, [showFind]);

    // ---- All derived values and handlers (must be above any early return) ----
    const activeTab = tabs.find((t) => t.id === activeTabId);

    const go = (url: string) => {
        if (activeTabId) navigateToUrl(activeTabId, url);
        else openTab(url);
        onClose();
    };

    const applyZoom = useCallback((newZoom: number) => {
        setZoom(newZoom);
        api?.setZoom?.(newZoom);
    }, [api]);

    const handleZoomIn = () => applyZoom(Math.min(zoom + 10, 300));
    const handleZoomOut = () => applyZoom(Math.max(zoom - 10, 25));
    const handleZoomReset = () => applyZoom(100);

    const handleFind = () => {
        setShowFind((v) => !v);
        if (!showFind) {
            api?.findInPage?.(findText || ' ');
        } else {
            api?.stopFindInPage?.();
            setFindText('');
        }
    };

    const handleFindInput = (val: string) => {
        setFindText(val);
        if (val.length > 0) api?.findInPage?.(val);
        else api?.stopFindInPage?.();
    };

    const handlePrint = () => { api?.print?.(); onClose(); };

    const handleFullscreen = () => {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
        onClose();
    };

    if (!isOpen) return null;

    const Divider = () => <div className="my-1 border-t border-white/[0.06]" />;

    type MenuItemProps = {
        icon: string;
        label: string;
        shortcut?: string;
        onClick?: () => void;
        danger?: boolean;
        chevron?: boolean;
        badge?: string;
    };

    const MenuItem = ({ icon, label, shortcut, onClick, danger, chevron, badge }: MenuItemProps) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] transition-colors group
                ${danger ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-300 hover:bg-white/[0.07] hover:text-[#0A1F44]'}`}
        >
            <span className={`material-symbols-outlined text-[17px] shrink-0 ${danger ? 'text-red-400' : 'text-[#8FA9C9] group-hover:text-slate-300'}`}>
                {icon}
            </span>
            <span className="flex-1 text-left">{label}</span>
            {badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#004AAD]/20 text-[#004AAD] font-bold tracking-wide mr-1">
                    {badge}
                </span>
            )}
            {shortcut && <span className="text-[11px] text-slate-600 shrink-0 font-mono">{shortcut}</span>}
            {chevron && <span className="material-symbols-outlined text-[14px] text-slate-600 shrink-0">chevron_right</span>}
        </button>
    );

    return (
        <div
            ref={menuRef}
            className="absolute right-0 top-full mt-1 z-[200] rounded-xl border border-white/[0.08] shadow-2xl shadow-black/70 flex flex-col animate-fadeIn no-drag"
            style={{
                width: '290px',
                maxHeight: 'calc(100vh - 100px)',
                background: 'rgba(16, 18, 24, 0.98)',
                backdropFilter: 'blur(24px)',
            }}
        >
            {/* Scrollable inner */}
            <div className="overflow-y-auto flex-1 py-2 px-1.5" style={{ overscrollBehavior: 'contain' }}>

                {/* Quick action cards */}
                <div className="grid grid-cols-3 gap-1.5 px-1 pb-2">
                    {[
                        { icon: 'add', label: 'New Tab', action: () => { openTab(); onClose(); } },
                        { icon: 'open_in_new', label: 'New Window', action: () => { api?.openWindow?.(); onClose(); } },
                        { icon: 'security', label: 'Private', action: () => { openTab('dive://private'); onClose(); } },
                    ].map((it) => (
                        <button
                            key={it.label}
                            onClick={it.action}
                            className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.06] text-[#5F7FA6] hover:text-[#0A1F44] transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">{it.icon}</span>
                            <span className="text-[10px] font-medium">{it.label}</span>
                        </button>
                    ))}
                </div>

                <Divider />

                {/* Zoom row */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 mx-1 rounded-lg bg-white/[0.03] border border-white/[0.05] mb-1">
                    <span className="material-symbols-outlined text-[16px] text-[#8FA9C9]">zoom_in</span>
                    <span className="text-[12px] text-[#5F7FA6] flex-1">Zoom</span>
                    <button onClick={handleZoomOut} className="w-7 h-6 flex items-center justify-center rounded hover:bg-white/10 text-slate-300 hover:text-[#0A1F44] text-base leading-none">−</button>
                    <button onClick={handleZoomReset} className="w-12 h-6 flex items-center justify-center rounded hover:bg-white/10 text-xs font-bold text-[#0A1F44]">{zoom}%</button>
                    <button onClick={handleZoomIn} className="w-7 h-6 flex items-center justify-center rounded hover:bg-white/10 text-slate-300 hover:text-[#0A1F44] text-base leading-none">+</button>
                    <div className="w-px h-4 bg-white/10" />
                    <button onClick={handleFullscreen} className="w-7 h-6 flex items-center justify-center rounded hover:bg-white/10 text-[#5F7FA6] hover:text-[#0A1F44]">
                        <span className="material-symbols-outlined text-[15px]">fullscreen</span>
                    </button>
                </div>

                {/* Find row (inline) */}
                {showFind && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 mx-1 rounded-lg bg-white/[0.03] border border-[#004AAD]/30 mb-1">
                        <span className="material-symbols-outlined text-[15px] text-[#004AAD]">search</span>
                        <input
                            ref={findRef}
                            type="text"
                            value={findText}
                            onChange={(e) => handleFindInput(e.target.value)}
                            placeholder="Find in page..."
                            className="flex-1 bg-transparent text-xs text-[#0A1F44] placeholder-slate-600 outline-none border-none"
                        />
                        {findText && (
                            <button onClick={() => { handleFindInput(''); }} className="text-[#8FA9C9] hover:text-[#0A1F44]">
                                <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                        )}
                    </div>
                )}

                <Divider />

                {/* Nav items */}
                <MenuItem icon="history" label="History" shortcut="⌘Y" onClick={() => go('dive://history')} />
                <MenuItem icon="download" label="Downloads" shortcut="⌥⌘L" onClick={() => go('dive://downloads')} />
                <MenuItem icon="bookmarks" label="Bookmarks" onClick={() => go('dive://bookmarks')} chevron />
                <MenuItem icon="find_in_page" label="Find in page" shortcut="⌘F" onClick={handleFind} />
                <MenuItem icon="print" label="Print…" shortcut="⌘P" onClick={handlePrint} />

                <Divider />

                {/* Page tools */}
                <MenuItem
                    icon="share"
                    label="Share page"
                    onClick={() => {
                        navigator.share?.({ url: activeTab?.url, title: activeTab?.title }).catch(() => {});
                        onClose();
                    }}
                />
                <MenuItem
                    icon="code"
                    label="View page source"
                    onClick={() => { if (activeTab?.url) go(`view-source:${activeTab.url}`); }}
                />
                <MenuItem icon="translate" label="Translate page" onClick={onClose} />

                <Divider />

                {/* System */}
                <MenuItem icon="extension" label="Extensions" chevron onClick={onClose} />
                <MenuItem icon="lock" label="Security & Privacy" onClick={() => go('dive://security')} badge="New" />
                <MenuItem icon="settings" label="Settings" onClick={() => go('dive://settings')} />

                <Divider />

                <MenuItem icon="developer_mode" label="Developer Tools" shortcut="⌥⌘I" onClick={() => { api?.openDevTools?.(); onClose(); }} />
                <MenuItem icon="terminal" label="Browser UI DevTools" onClick={() => { api?.openBrowserDevTools?.(); onClose(); }} />

                <Divider />

                <MenuItem icon="help" label="Help & Feedback" chevron onClick={onClose} />
                <MenuItem
                    icon="logout"
                    label="Quit Dive"
                    danger
                    onClick={() => { api?.closeWindow?.(); }}
                />
            </div>
        </div>
    );
}
