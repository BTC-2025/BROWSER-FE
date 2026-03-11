'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import TabStrip from './TabStrip';
import NavigationBar from './NavigationBar';
import { useBrowserStore } from '@/stores/browserStore';
import { useAICopilotStore } from '@/stores/aiCopilotStore';
import { useAgentRuntimeStore } from '@/stores/agentRuntimeStore';
import { useMemorySecurityStore } from '@/stores/memorySecurityStore';

export default function HeaderBar() {
    const activeTab = useBrowserStore((s) => {
        const tab = s.tabs.find((t) => t.id === s.activeTabId);
        return tab;
    });

    const isAIOpen = useAICopilotStore((s) => s.isOpen);
    const isAgentOpen = useAgentRuntimeStore((s) => s.isOpen);
    const isNotesOpen = useMemorySecurityStore((s) => s.isNotePanelOpen);

    const headerRef = useRef<HTMLElement>(null);

    // Compute how many pixels of panel are visible on the right side.
    // Must match the clamp() values used in each panel component.
    const getPanelWidth = useCallback(() => {
        const vw = window.innerWidth;
        let total = 0;
        if (isAIOpen) total += Math.min(400, Math.max(280, vw * 0.30));
        if (isAgentOpen) total += Math.min(440, Math.max(280, vw * 0.32));
        if (isNotesOpen) total += Math.min(380, Math.max(260, vw * 0.28));
        return Math.round(total);
    }, [isAIOpen, isAgentOpen, isNotesOpen]);

    const reportBounds = useCallback(() => {
        const header = headerRef.current;
        if (!header || typeof window === 'undefined' || !(window as any).browserAPI) return;

        const h = header.getBoundingClientRect().height;
        const w = window.innerWidth;
        const winH = window.innerHeight;
        const panelW = getPanelWidth();

        (window as any).browserAPI.updateBounds({
            x: 0,
            y: Math.round(h),
            width: Math.max(0, w - panelW),
            height: Math.round(winH - h),
        });
    }, [getPanelWidth]);

    useEffect(() => {
        const header = headerRef.current;
        if (!header || typeof window === 'undefined' || !(window as any).browserAPI) return;

        const observer = new ResizeObserver(reportBounds);
        observer.observe(header);
        window.addEventListener('resize', reportBounds);
        reportBounds();

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', reportBounds);
        };
    }, [reportBounds]);

    // Re-run whenever any panel toggles
    useEffect(() => {
        reportBounds();
    }, [isAIOpen, isAgentOpen, isNotesOpen, reportBounds]);

    return (
        <header
            ref={headerRef}
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
