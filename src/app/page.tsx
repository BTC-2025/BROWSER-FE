'use client';

import React, { useEffect } from 'react';
import HeaderBar from '@/components/browser/HeaderBar';
import WebViewContainer from '@/components/browser/WebViewContainer';
import AISidePanel from '@/components/ai/AISidePanel';
import AgentPanel from '@/components/agent/AgentPanel';
import PageNotesPanel from '@/components/memory/PageNotesPanel';
import { useBrowserStore } from '@/stores/browserStore';
import { useAICopilotStore } from '@/stores/aiCopilotStore';
import { useAgentRuntimeStore } from '@/stores/agentRuntimeStore';
import { useMemorySecurityStore } from '@/stores/memorySecurityStore';

export default function BrowserPage() {
    const initialize = useBrowserStore((s) => s.initialize);
    const isAIOpen = useAICopilotStore((s) => s.isOpen);
    const isAgentOpen = useAgentRuntimeStore((s) => s.isOpen);
    const isNotesOpen = useMemorySecurityStore((s) => s.isNotePanelOpen);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#101622' }}>
            <HeaderBar />
            <div className="flex-1 flex overflow-hidden relative">
                <div className="flex-1 min-w-0 overflow-hidden">
                    <WebViewContainer />
                </div>
                {/* Side panels — absolutely positioned so they overlay without displacing WebView */}
                <div className="absolute top-0 right-0 bottom-0 flex pointer-events-none" style={{ zIndex: 50 }}>
                    {isAIOpen && (
                        <div className="pointer-events-auto h-full">
                            <AISidePanel />
                        </div>
                    )}
                    {isAgentOpen && (
                        <div className="pointer-events-auto h-full">
                            <AgentPanel />
                        </div>
                    )}
                    {isNotesOpen && (
                        <div className="pointer-events-auto h-full">
                            <PageNotesPanel />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
