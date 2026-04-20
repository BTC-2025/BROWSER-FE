'use client';

import React, { useState, useEffect } from 'react';

function formatTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${ampm}`;
}

export default function PrivateBrowsingPage() {
    const [time, setTime] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setTime(formatTime());
        const interval = setInterval(() => setTime(formatTime()), 60_000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const query = searchQuery.trim();
            const isUrl = query.includes('.') && !query.includes(' ');
            const _url = isUrl
                ? (query.startsWith('http') ? query : `https://${query}`)
                : `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            // In a real implementation, navigate in private mode
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden relative" style={{ background: '#0a0c12' }}>
            {/* Background: Purple-tinted glows for private mode */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-purple-600/15 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-3xl flex flex-col items-center gap-10 animate-fadeIn relative z-10 px-8">
                {/* Private Mode Indicator */}
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-purple-600/10 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                    <span className="material-symbols-outlined text-purple-400 text-2xl">visibility_off</span>
                    <span className="text-purple-300 font-semibold text-sm tracking-wide">PRIVATE BROWSING</span>
                </div>

                {/* Shield Icon */}
                <div className="relative">
                    <div className="size-24 rounded-full bg-gradient-to-br from-purple-600/30 to-indigo-600/20 flex items-center justify-center border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                        <span className="material-symbols-outlined text-purple-400 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                    </div>
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-ping" style={{ animationDuration: '3s' }} />
                </div>

                {/* Time */}
                <h2 className="font-future text-2xl text-purple-400" style={{ filter: 'drop-shadow(0 0 10px rgba(168,85,247,0.6))' }}>
                    {time || '\u00A0'}
                </h2>

                {/* Private Search Bar */}
                <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
                    <div className="absolute -inset-0.5 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" style={{ background: 'linear-gradient(to right, #7c3aed, #6366f1)' }} />
                    <div className="relative flex items-center w-full h-14 rounded-2xl px-5 shadow-2xl" style={{ background: 'rgba(20, 17, 35, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                        <span className="material-symbols-outlined text-purple-400 text-[24px]">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search privately..."
                            className="w-full h-full bg-transparent border-none text-lg text-[#0A1F44] placeholder-slate-500 focus:outline-none focus:ring-0 ml-3"
                        />
                        <span className="material-symbols-outlined text-purple-400/40 text-[20px]">visibility_off</span>
                    </div>
                </form>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                    <div className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="p-3 rounded-full bg-purple-600/10">
                            <span className="material-symbols-outlined text-purple-400 text-2xl">delete_sweep</span>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-200">Auto-Clear History</p>
                            <p className="text-xs text-[#8FA9C9] mt-1">Browsing data is erased when you close this window</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="p-3 rounded-full bg-purple-600/10">
                            <span className="material-symbols-outlined text-purple-400 text-2xl">cookie_off</span>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-200">No Cookies Saved</p>
                            <p className="text-xs text-[#8FA9C9] mt-1">Cookies and site data are not persisted</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="p-3 rounded-full bg-purple-600/10">
                            <span className="material-symbols-outlined text-purple-400 text-2xl">vpn_lock</span>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-200">Enhanced Privacy</p>
                            <p className="text-xs text-[#8FA9C9] mt-1">Third-party trackers are blocked by default</p>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-slate-600 text-center max-w-lg leading-relaxed">
                    Private browsing doesn&#39;t make you anonymous on the internet. Your employer, school, or ISP may still be able to see your activity.
                </p>
            </div>
        </div>
    );
}
