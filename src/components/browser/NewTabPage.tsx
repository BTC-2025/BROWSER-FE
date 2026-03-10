'use client';

import React, { useState, useEffect } from 'react';
import { useBrowserStore } from '@/stores/browserStore';
import { useSettingsStore, searchEngineUrls } from '@/stores/settingsStore';

// Quick link data
const quickLinks = [
    { name: 'GitHub', defaultHover: '#000000', icon: <span className="material-symbols-outlined text-[28px]">code</span> },
    { name: 'YouTube', defaultHover: '#FF0000', icon: <span className="material-symbols-outlined text-[28px]">smart_display</span> },
    { name: 'Figma', defaultHover: '#F24E1E', icon: <span className="material-symbols-outlined text-[28px]">draw</span> },
    { name: 'Notion', defaultHover: '#000000', icon: <span className="material-symbols-outlined text-[28px]">receipt_long</span> },
    { name: 'Linear', defaultHover: '#5E6AD2', icon: <span className="material-symbols-outlined text-[28px]">timeline</span> },
    { name: 'Reddit', defaultHover: '#FF4500', icon: <span className="material-symbols-outlined text-[28px]">forum</span> },
];

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 6) return 'Good Night';
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
}

function formatTime(): string {
    const now = new Date();
    const hours = now.getHours() === 0 ? 12 : (now.getHours() > 12 ? now.getHours() - 12 : now.getHours());
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${ampm}`;
}

export default function NewTabPage() {
    const [time, setTime] = useState('');
    const [greeting, setGreeting] = useState('');
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { activeTabId, navigateToUrl } = useBrowserStore();
    const { newTabBackground, searchEngine, accentColor, glassmorphism, animations } = useSettingsStore();

    // Set time/greeting only on client to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
        setTime(formatTime());
        setGreeting(getGreeting());
        const interval = setInterval(() => {
            setTime(formatTime());
            setGreeting(getGreeting());
        }, 10_000); // Check every 10s
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTabId && searchQuery.trim()) {
            const query = searchQuery.trim();
            const isUrl = query.includes('.') && !query.includes(' ');

            let url = query;
            if (isUrl) {
                url = query.startsWith('http') ? query : `https://${query}`;
            } else {
                const searchPrefix = searchEngineUrls[searchEngine] || searchEngineUrls.google;
                url = `${searchPrefix}${encodeURIComponent(query)}`;
            }
            navigateToUrl(activeTabId, url);
        }
    };

    const renderBackground = () => {
        switch (newTabBackground) {
            case 'space':
                return (
                    <div
                        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none transition-opacity duration-1000"
                        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=2500&auto=format&fit=crop)', opacity: mounted ? 1 : 0 }}
                    >
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                );
            case 'nature':
                return (
                    <div
                        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none transition-opacity duration-1000"
                        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2500&auto=format&fit=crop)', opacity: mounted ? 1 : 0 }}
                    >
                        <div className="absolute inset-0 bg-[#0a0f18]/60" />
                    </div>
                );
            case 'glass':
                return (
                    <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#1a2332] to-[#0A0D14] pointer-events-none">
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
                    </div>
                );
            case 'minimal':
                return <div className="fixed inset-0 z-0 bg-[#080b10] pointer-events-none" />;
            case 'aurora':
            default:
                return (
                    <div className="fixed inset-0 z-0 pointer-events-none bg-[#0B0F19]">
                        <div
                            className={`absolute ${animations ? 'animate-pulse' : ''}`}
                            style={{
                                top: '-20%', left: '-10%', width: '60%', height: '60%',
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
                                filter: 'blur(100px)',
                                animationDuration: '8s'
                            }}
                        />
                        <div
                            className={`absolute ${animations ? 'animate-pulse' : ''}`}
                            style={{
                                bottom: '-20%', right: '-10%', width: '60%', height: '60%',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
                                filter: 'blur(100px)',
                                animationDuration: '12s'
                            }}
                        />
                    </div>
                );
        }
    };

    return (
        <main className="relative z-10 flex-1 overflow-y-auto w-full flex flex-col items-center justify-center p-8 min-h-screen">
            {renderBackground()}

            <div className={`w-full max-w-4xl flex flex-col items-center gap-12 relative z-10 ${animations ? 'animate-in fade-in zoom-in-95 duration-1000' : ''}`}>
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <h1
                        className="font-future text-5xl md:text-7xl font-bold tracking-tight"
                        style={{
                            color: 'white',
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        }}
                    >
                        {greeting || '\u00A0'}
                    </h1>
                    <h2
                        className="font-future text-2xl md:text-4xl font-light tracking-widest"
                        style={{
                            color: accentColor,
                            textShadow: `0 0 20px ${accentColor}80`,
                        }}
                    >
                        {time || '\u00A0'}
                    </h2>
                </div>

                {/* Main Search Bar */}
                <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
                    {/* Gradient Glow Halo */}
                    <div
                        className={`absolute -inset-0.5 rounded-2xl blur opacity-30 ${animations ? 'group-hover:opacity-60 transition duration-500' : ''}`}
                        style={{ background: `linear-gradient(to right, ${accentColor}, #a855f7)` }}
                    />
                    <div
                        className="relative flex items-center w-full h-16 rounded-2xl px-6 shadow-2xl"
                        style={{
                            background: glassmorphism ? 'rgba(20, 25, 35, 0.6)' : 'rgba(20, 25, 35, 0.95)',
                            backdropFilter: glassmorphism ? 'blur(20px)' : 'none',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <span className="material-symbols-outlined text-slate-400 text-[28px] mr-4" style={{ color: accentColor }}>search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search with ${searchEngine.charAt(0).toUpperCase() + searchEngine.slice(1)}...`}
                            className="w-full h-full bg-transparent border-none text-xl text-white placeholder-slate-400 focus:outline-none focus:ring-0"
                        />
                        <button
                            type="button"
                            className="p-2.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors ml-2"
                        >
                            <span className="material-symbols-outlined text-[24px]">mic</span>
                        </button>
                    </div>
                </form>

                {/* Quick Links Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 w-full px-4 mt-12">
                    {quickLinks.map((link) => (
                        <a
                            key={link.name}
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl group/card cursor-pointer transition-transform hover:-translate-y-1"
                            style={{
                                background: glassmorphism ? 'rgba(255,255,255,0.03)' : 'rgba(30, 35, 45, 0.8)',
                                backdropFilter: glassmorphism ? 'blur(10px)' : 'none',
                                border: '1px solid rgba(255,255,255,0.05)',
                            }}
                        >
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center text-slate-300 shadow-lg transition-all duration-300 group-hover/card:scale-110"
                                style={{ background: 'rgba(0,0,0,0.3)' }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = accentColor;
                                    (e.currentTarget as HTMLElement).style.color = 'white';
                                    (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 15px ${accentColor}66`;
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.3)';
                                    (e.currentTarget as HTMLElement).style.color = '#cbd5e1';
                                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                                }}
                            >
                                {link.icon}
                            </div>
                            <span className="text-sm font-medium text-slate-400 group-hover/card:text-white transition-colors">
                                {link.name}
                            </span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Settings Widget Button */}
            <div className="fixed bottom-8 right-8 z-20">
                <button
                    onClick={() => navigateToUrl(activeTabId!, 'nexus://settings')}
                    className="flex items-center gap-2 px-5 py-3 text-slate-300 rounded-full shadow-2xl transition-all hover:scale-105"
                    style={{
                        background: glassmorphism ? 'rgba(20, 25, 35, 0.8)' : 'rgba(20, 25, 35, 1)',
                        backdropFilter: glassmorphism ? 'blur(12px)' : 'none',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = accentColor;
                        (e.currentTarget as HTMLElement).style.color = 'white';
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${accentColor}40`;
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                        (e.currentTarget as HTMLElement).style.color = '#cbd5e1';
                        (e.currentTarget as HTMLElement).style.boxShadow = 'shadow-2xl';
                    }}
                >
                    <span className="material-symbols-outlined text-[20px]">tune</span>
                    <span className="text-sm font-medium">Customize</span>
                </button>
            </div>
        </main>
    );
}
