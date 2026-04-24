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

    return (
        <div
            className="flex flex-col h-full border-l border-[#A6C8FF]/30 shadow-2xl shadow-[#A6C8FF]/20 animate-fadeIn"
            style={{
                width: 'clamp(280px, 30vw, 400px)',
                background: 'rgba(255, 255, 255, 0.97)',
                backdropFilter: 'blur(20px)',
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#A6C8FF]/30">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-[#004AAD] to-purple-600 flex items-center justify-center shadow-[0_0_12px_rgba(0, 74, 173,0.4)]">
                        <span className="material-symbols-outlined text-[#0A1F44] text-[18px]">auto_awesome</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[#0A1F44]">Dive AI</h3>
                        {/* <p className="text-[10px] text-[#8FA9C9]">Copilot</p> */}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={clearChat}
                        className="p-1.5 rounded-lg text-[#5F7FA6] hover:text-[#0A1F44] hover:bg-[#DDEEFF]/50 transition-colors"
                        title="Clear chat"
                    >
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                    </button>
                    <button
                        onClick={closePanel}
                        className="p-1.5 rounded-lg text-[#5F7FA6] hover:text-[#0A1F44] hover:bg-[#DDEEFF]/50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>
            </div>

            {/* Mode Tabs */}
            <div className="flex border-b border-[#A6C8FF]/30">
                <button
                    onClick={() => setMode('chat')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${activeMode === 'chat'
                        ? 'text-[#004AAD] border-b-2 border-[#004AAD]'
                        : 'text-[#5F7FA6] hover:text-[#0A1F44]'
                        }`}
                >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    Chat
                </button>
                <button
                    onClick={() => { setMode('summary'); summarizePage(); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${activeMode === 'summary'
                        ? 'text-[#004AAD] border-b-2 border-[#004AAD]'
                        : 'text-[#5F7FA6] hover:text-[#0A1F44]'
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
                                <div className="size-16 rounded-2xl bg-gradient-to-br from-[#004AAD]/20 to-purple-600/10 flex items-center justify-center border border-[#004AAD]/20">
                                    <span className="material-symbols-outlined text-[#004AAD] text-3xl">auto_awesome</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-[#0A1F44]">How can I help?</p>
                                    <p className="text-xs text-[#8FA9C9] mt-1">Ask me anything about the page you&apos;re viewing</p>
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
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F4F8FF] border border-[#A6C8FF]/30 hover:bg-[#DDEEFF]/50 hover:border-[#004AAD]/20 text-[#0A1F44] hover:text-[#0A1F44] text-xs transition-all text-left"
                                        >
                                            <span className="material-symbols-outlined text-[#004AAD] text-[16px]">{action.icon}</span>
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
                                    <div className="size-7 rounded-lg bg-gradient-to-br from-[#004AAD] to-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="material-symbols-outlined text-[#0A1F44] text-[14px]">auto_awesome</span>
                                    </div>
                                )}
                                <div
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-[#004AAD] text-[#0A1F44] rounded-br-md'
                                        : 'bg-[#DDEEFF]/50 text-[#0A1F44] border border-[#A6C8FF]/30 rounded-bl-md'
                                        }`}
                                    style={{ whiteSpace: 'pre-wrap' }}
                                    dangerouslySetInnerHTML={{
                                        __html: msg.content
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/• /g, '<span class="text-[#004AAD]">• </span>')
                                            .replace(/\n/g, '<br/>')
                                    }}
                                />
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="size-7 rounded-lg bg-gradient-to-br from-[#004AAD] to-purple-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[#0A1F44] text-[14px] animate-spin">progress_activity</span>
                                </div>
                                <div className="bg-[#DDEEFF]/50 border border-[#A6C8FF]/30 rounded-2xl rounded-bl-md px-4 py-3">
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
                                <span className="material-symbols-outlined text-[32px] text-[#004AAD] animate-spin">progress_activity</span>
                                <p className="text-sm text-[#5F7FA6]">Analyzing page content...</p>
                            </div>
                        )}
                        {summary && !isSummarizing && (
                            <div className="space-y-4 animate-fadeIn">
                                {/* Summary Header */}
                                <div className="p-4 rounded-xl bg-[#004AAD]/5 border border-[#004AAD]/20">
                                    <h4 className="text-sm font-semibold text-[#0A1F44] mb-1">{summary.title}</h4>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="flex items-center gap-1 text-xs text-[#5F7FA6]">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            {summary.readingTime} read
                                        </span>
                                        <span className={`flex items-center gap-1 text-xs ${summary.sentiment === 'positive' ? 'text-green-400' :
                                            summary.sentiment === 'negative' ? 'text-red-400' : 'text-[#5F7FA6]'
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
                                    <h5 className="text-xs font-bold text-[#5F7FA6] uppercase tracking-wider mb-3">Key Points</h5>
                                    <div className="space-y-2">
                                        {summary.keyPoints.map((point, i) => (
                                            <div key={i} className="flex gap-3 p-3 rounded-xl bg-[#F4F8FF] border border-[#A6C8FF]/30">
                                                <div className="size-6 rounded-full bg-[#004AAD]/10 text-[#004AAD] flex items-center justify-center shrink-0 text-xs font-bold">
                                                    {i + 1}
                                                </div>
                                                <p className="text-sm text-[#0A1F44] leading-relaxed">{point}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#004AAD] hover:bg-[#195BAC] text-[#0A1F44] text-xs font-medium transition-colors">
                                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                        Copy Summary
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#DDEEFF]/50 hover:bg-white/10 text-[#0A1F44] text-xs font-medium transition-colors border border-[#A6C8FF]/30">
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
                <form onSubmit={handleSend} className="p-3 border-t border-[#A6C8FF]/30">
                    <div className="flex items-center gap-2 bg-[#DDEEFF]/50 border border-[#A6C8FF]/30 rounded-xl px-3 py-2 focus-within:border-[#004AAD]/30 transition-colors">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Dive AI..."
                            disabled={isLoading}
                            className="flex-1 bg-transparent border-none text-sm text-[#0A1F44] placeholder-slate-500 focus:outline-none focus:ring-0 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="p-1.5 rounded-lg bg-[#004AAD] hover:bg-[#195BAC] text-[#0A1F44] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[18px]">send</span>
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-600 text-center mt-2">Dive AI may produce inaccurate results</p>
                </form>
            )}
        </div>
    );
}
