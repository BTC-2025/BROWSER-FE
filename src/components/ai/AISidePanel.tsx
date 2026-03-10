'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAICopilotStore } from '@/stores/aiCopilotStore';

export default function AISidePanel() {
    const {
        isOpen,
        activeMode,
        messages,
        isLoading,
        summary,
        isSummarizing,
        closePanel,
        setMode,
        sendMessage,
        summarizePage,
        clearChat,
    } = useAICopilotStore();

    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen && activeMode === 'chat') {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen, activeMode]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        const msg = input.trim();
        setInput('');
        await sendMessage(msg);
    };

    if (!isOpen) return null;

    return (
        <div
            className="flex flex-col h-full border-l border-white/5 shadow-2xl shadow-black/40 z-40 animate-fadeIn"
            style={{
                width: '380px',
                background: 'rgba(15, 17, 21, 0.95)',
                backdropFilter: 'blur(20px)',
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-[#135bec] to-purple-600 flex items-center justify-center shadow-[0_0_12px_rgba(19,91,236,0.4)]">
                        <span className="material-symbols-outlined text-white text-[18px]">auto_awesome</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Nexus AI</h3>
                        <p className="text-[10px] text-slate-500">Copilot</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={clearChat}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="Clear chat"
                    >
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                    </button>
                    <button
                        onClick={closePanel}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>
            </div>

            {/* Mode Tabs */}
            <div className="flex border-b border-white/5">
                <button
                    onClick={() => setMode('chat')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${activeMode === 'chat'
                            ? 'text-[#135bec] border-b-2 border-[#135bec]'
                            : 'text-slate-400 hover:text-white'
                        }`}
                >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    Chat
                </button>
                <button
                    onClick={() => { setMode('summary'); summarizePage(); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${activeMode === 'summary'
                            ? 'text-[#135bec] border-b-2 border-[#135bec]'
                            : 'text-slate-400 hover:text-white'
                        }`}
                >
                    <span className="material-symbols-outlined text-[16px]">summarize</span>
                    Summarize
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {activeMode === 'chat' && (
                    <div className="flex flex-col p-4 space-y-4 min-h-full">
                        {/* Welcome message if no messages */}
                        {messages.length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
                                <div className="size-16 rounded-2xl bg-gradient-to-br from-[#135bec]/20 to-purple-600/10 flex items-center justify-center border border-[#135bec]/20">
                                    <span className="material-symbols-outlined text-[#135bec] text-3xl">auto_awesome</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-white">How can I help?</p>
                                    <p className="text-xs text-slate-500 mt-1">Ask me anything about the page you&apos;re viewing</p>
                                </div>
                                {/* Quick Actions */}
                                <div className="flex flex-col gap-2 w-full mt-2">
                                    {[
                                        { icon: 'summarize', text: 'Summarize this page', query: 'Summarize this page for me' },
                                        { icon: 'help', text: 'What can you do?', query: 'help' },
                                        { icon: 'lightbulb', text: 'Explain the key points', query: 'Explain the key points of this page' },
                                    ].map((action) => (
                                        <button
                                            key={action.text}
                                            onClick={() => sendMessage(action.query)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-[#135bec]/20 text-slate-300 hover:text-white text-xs transition-all text-left"
                                        >
                                            <span className="material-symbols-outlined text-[#135bec] text-[16px]">{action.icon}</span>
                                            {action.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="size-7 rounded-lg bg-gradient-to-br from-[#135bec] to-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-white text-[14px]">auto_awesome</span>
                                    </div>
                                )}
                                <div
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-[#135bec] text-white rounded-br-md'
                                            : 'bg-white/5 text-slate-200 border border-white/5 rounded-bl-md'
                                        }`}
                                    style={{ whiteSpace: 'pre-wrap' }}
                                    dangerouslySetInnerHTML={{
                                        __html: msg.content
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/• /g, '<span class="text-[#135bec]">• </span>')
                                            .replace(/\n/g, '<br/>')
                                    }}
                                />
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="size-7 rounded-lg bg-gradient-to-br from-[#135bec] to-purple-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-white text-[14px] animate-spin">progress_activity</span>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                )}

                {activeMode === 'summary' && (
                    <div className="p-4 space-y-4">
                        {isSummarizing && (
                            <div className="flex flex-col items-center gap-4 py-12">
                                <span className="material-symbols-outlined text-[32px] text-[#135bec] animate-spin">progress_activity</span>
                                <p className="text-sm text-slate-400">Analyzing page content...</p>
                            </div>
                        )}
                        {summary && !isSummarizing && (
                            <div className="space-y-4 animate-fadeIn">
                                {/* Summary Header */}
                                <div className="p-4 rounded-xl bg-[#135bec]/5 border border-[#135bec]/20">
                                    <h4 className="text-sm font-semibold text-white mb-1">{summary.title}</h4>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="flex items-center gap-1 text-xs text-slate-400">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            {summary.readingTime} read
                                        </span>
                                        <span className={`flex items-center gap-1 text-xs ${summary.sentiment === 'positive' ? 'text-green-400' :
                                                summary.sentiment === 'negative' ? 'text-red-400' : 'text-slate-400'
                                            }`}>
                                            <span className="material-symbols-outlined text-[14px]">
                                                {summary.sentiment === 'positive' ? 'sentiment_satisfied' :
                                                    summary.sentiment === 'negative' ? 'sentiment_dissatisfied' : 'sentiment_neutral'}
                                            </span>
                                            {summary.sentiment}
                                        </span>
                                    </div>
                                </div>
                                {/* Key Points */}
                                <div>
                                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Points</h5>
                                    <div className="space-y-2">
                                        {summary.keyPoints.map((point, i) => (
                                            <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                                <div className="size-6 rounded-full bg-[#135bec]/10 text-[#135bec] flex items-center justify-center shrink-0 text-xs font-bold">
                                                    {i + 1}
                                                </div>
                                                <p className="text-sm text-slate-300 leading-relaxed">{point}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#135bec] hover:bg-[#1a6fff] text-white text-xs font-medium transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                        Copy Summary
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors border border-white/5">
                                        <span className="material-symbols-outlined text-[16px]">share</span>
                                        Share
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Chat Input (only in chat mode) */}
            {activeMode === 'chat' && (
                <form onSubmit={handleSend} className="p-3 border-t border-white/5">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-2 focus-within:border-[#135bec]/30 transition-colors">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Nexus AI..."
                            disabled={isLoading}
                            className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="p-1.5 rounded-lg bg-[#135bec] hover:bg-[#1a6fff] text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[18px]">send</span>
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-600 text-center mt-2">Nexus AI may produce inaccurate results</p>
                </form>
            )}
        </div>
    );
}
