'use client';

import React, { useState, useEffect } from 'react';
import { useBrowserStore } from '@/stores/browserStore';
import { useSettingsStore, searchEngineUrls } from '@/stores/settingsStore';
import DiveLogo from '@/components/brand/DiveLogo';

// Quick link data
// const quickLinks = [
//     { name: 'GitHub', icon: <span className="material-symbols-outlined text-[24px]">code</span> },
//     { name: 'YouTube', icon: <span className="material-symbols-outlined text-[24px]">smart_display</span> },
//     { name: 'Figma', icon: <span className="material-symbols-outlined text-[24px]">draw</span> },
//     { name: 'Notion', icon: <span className="material-symbols-outlined text-[24px]">receipt_long</span> },
//     { name: 'Linear', icon: <span className="material-symbols-outlined text-[24px]">timeline</span> },
//     { name: 'Reddit', icon: <span className="material-symbols-outlined text-[24px]">forum</span> },
//     { name: 'X', icon: <span className="material-symbols-outlined text-[24px]">alternate_email</span> },
//     { name: 'Maps', icon: <span className="material-symbols-outlined text-[24px]">map</span> },
// ];
const quickLinks = [
    { 
        name: 'GitHub', 
        url: 'https://github.com', 
        icon: <span className="material-symbols-outlined text-[24px]">code</span> 
    },
    { 
        name: 'YouTube', 
        url: 'https://youtube.com', 
        icon: <span className="material-symbols-outlined text-[24px]">smart_display</span> 
    },
    { 
        name: 'Figma', 
        url: 'https://figma.com', 
        icon: <span className="material-symbols-outlined text-[24px]">draw</span> 
    },
    { 
        name: 'Notion', 
        url: 'https://notion.so', 
        icon: <span className="material-symbols-outlined text-[24px]">receipt_long</span> 
    },
    { 
        name: 'Linear', 
        url: 'https://linear.app', 
        icon: <span className="material-symbols-outlined text-[24px]">timeline</span> 
    },
    { 
        name: 'Reddit', 
        url: 'https://reddit.com', 
        icon: <span className="material-symbols-outlined text-[24px]">forum</span> 
    },
    { 
        name: 'X', 
        url: 'https://x.com', 
        icon: <span className="material-symbols-outlined text-[24px]">alternate_email</span> 
    },
    { 
        name: 'Maps', 
        url: 'https://maps.google.com', 
        icon: <span className="material-symbols-outlined text-[24px]">map</span> 
    },
];

const discoverFeed = [
    { id: 1, title: 'The Future of AI: What to Expect in 2026', source: 'Tech Daily', time: '2 hours ago', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400&h=250', category: 'Technology' },
    { id: 2, title: 'Global Markets Rally as Inflation Cools', source: 'Financial Times', time: '4 hours ago', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400&h=250', category: 'Finance' },
    { id: 3, title: '10 Minimalist Desk Setups to Boost Productivity', source: 'Workspace Weekly', time: '5 hours ago', image: 'https://images.unsplash.com/photo-1524749292158-7540c2494485?auto=format&fit=crop&q=80&w=400&h=250', category: 'Lifestyle' },
    { id: 4, title: 'New Electric Vehicle Breaks Range Records', source: 'Auto Vision', time: '8 hours ago', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938cb?auto=format&fit=crop&q=80&w=400&h=250', category: 'Automotive' },
    { id: 5, title: 'NASA reveals stunning new images from deep space', source: 'Science Focus', time: '12 hours ago', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=400&h=250', category: 'Science' },
    { id: 6, title: 'Top 5 Coffee Roasts for the Perfect Morning Brew', source: 'Culinary Arts', time: '1 day ago', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=400&h=250', category: 'Food' },
];

const weatherMock = {
    temp: '72°',
    condition: 'Partly Cloudy',
    location: 'Chennai',
    icon: 'partly_cloudy_day'
};

export default function NewTabPage() {
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { activeTabId, navigateToUrl } = useBrowserStore();
    const { newTabBackground, searchEngine, accentColor, glassmorphism, animations } = useSettingsStore();

    useEffect(() => {
        setMounted(true);
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
                        <div className="absolute inset-0 bg-white/20" />
                    </div>
                );
            case 'nature':
                return (
                    <div
                        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none transition-opacity duration-1000"
                        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2500&auto=format&fit=crop)', opacity: mounted ? 1 : 0 }}
                    >
                        <div className="absolute inset-0 bg-white/20" />
                    </div>
                );
            case 'glass':
                return (
                    <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#E9F4FF] to-[#FFFFFF] pointer-events-none">
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
                    </div>
                );
            case 'minimal':
                return <div className="fixed inset-0 z-0 bg-[#FFFFFF] pointer-events-none" />;
            case 'aurora':
            default:
                return (
                    <div className="fixed inset-0 z-0 pointer-events-none bg-[#F4F8FF]">
                        <div
                            className={`absolute ${animations ? 'animate-pulse' : ''}`}
                            style={{
                                top: '-20%', left: '-10%', width: '60%', height: '60%',
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
                                filter: 'blur(100px)',
                                animationDuration: '8s'
                            }}
                        />
                        <div
                            className={`absolute ${animations ? 'animate-pulse' : ''}`}
                            style={{
                                bottom: '-20%', right: '-10%', width: '60%', height: '60%',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(166, 200, 255, 0.4) 0%, transparent 70%)',
                                filter: 'blur(100px)',
                                animationDuration: '12s'
                            }}
                        />
                    </div>
                );
        }
    };

    return (
        <main className="relative z-10 w-full h-full overflow-y-auto flex flex-col justify-start items-center">
            {renderBackground()}

            {/* Top Bar Area (Weather & Settings) */}
            <div className="w-full flex justify-between items-start p-6 relative z-10">
                <div 
                    className="flex items-center gap-3 px-4 py-2 rounded-2xl cursor-pointer hover:bg-white/50 transition-colors shadow-sm"
                    style={{
                        background: glassmorphism ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: glassmorphism ? 'blur(20px)' : 'none',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <span className="material-symbols-outlined text-yellow-500 text-[24px]">{weatherMock.icon}</span>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#0A1F44]">{weatherMock.temp}</span>
                        <span className="text-[10px] font-medium text-[#5F7FA6]">{weatherMock.location}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center justify-center p-2 rounded-full hover:bg-black/5 text-[#5F7FA6] transition-colors">
                        <span className="material-symbols-outlined text-[24px]">apps</span>
                    </button>
                    <div className="size-8 rounded-full bg-[#004AAD] flex items-center justify-center text-white text-sm font-bold shadow-md cursor-pointer hover:bg-[#195BAC]">
                        M
                    </div>
                </div>
            </div>

            {/* Core Search Area - Centered in viewport */}
            <div className={`w-full max-w-3xl flex flex-col items-center flex-1 min-h-[40vh] justify-center mt-4 gap-8 relative z-10 ${animations ? 'animate-in fade-in zoom-in-95 duration-1000' : ''}`}>
                
                {/* Logo */}
<h1 
  className="select-none"
  style={{
    fontFamily: "orbitron",
    fontSize: '3.8rem',
    fontWeight: 800,
    letterSpacing: '-1px',
    lineHeight: '1.2',
    background: `linear-gradient(to right, ${accentColor}, #4D88FF)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0px 6px 20px rgba(0, 74, 173, 0.25))'
  }}
>
  KinsWord
</h1>

                {/* <DiveLogo
                    className="select-none"
                    markClassName="h-24 w-auto md:h-28 drop-shadow-[0_10px_24px_rgba(0,74,173,0.18)]"
                /> */}

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="w-full relative group">
                    <div
                        className="relative flex items-center w-full h-14 rounded-full px-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-shadow duration-300"
                        style={{
                            background: 'white',
                            border: '1px solid rgba(0, 0, 0, 0.08)',
                        }}
                    >
                        <span className="material-symbols-outlined text-[#5F7FA6] text-[22px] mr-3">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search the web...`}
                            className="w-full h-full bg-transparent border-none text-[15px] text-[#0A1F44] placeholder-[#5F7FA6] focus:outline-none focus:ring-0"
                        />
                        <button
                            type="button"
                            className="p-2 hover:bg-black/5 rounded-full text-[#004AAD] transition-colors ml-1"
                            title="Voice search"
                        >
                            <span className="material-symbols-outlined text-[20px]">mic</span>
                        </button>
                        <button
                            type="button"
                            className="p-2 hover:bg-black/5 rounded-full text-[#4D88FF] transition-colors ml-1"
                            title="Image search"
                        >
                            <span className="material-symbols-outlined text-[20px]">center_focus_strong</span>
                        </button>
                    </div>
                </form>

                {/* Quick Links */}
                <div className="flex flex-wrap justify-center gap-6 w-full max-w-2xl px-4 mt-2">
                    {quickLinks.map((link) => (
                        <div
                            key={link.name}
                            onClick={() => navigateToUrl(activeTabId!, link.url)}
                            className="flex flex-col items-center justify-center gap-3 p-3 rounded-2xl group/card cursor-pointer hover:bg-white/60 transition-colors"
                        >
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-[#0A1F44] shadow-sm border border-black/5 group-hover/card:shadow-md transition-all duration-300"
                            >
                                {link.icon}
                            </div>
                            <span className="text-xs font-medium text-[#5F7FA6] group-hover/card:text-[#0A1F44] transition-colors">
                                {link.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Discover Feed */}
            <div className="w-full max-w-5xl px-6 pb-20 relative z-10 flex flex-col items-center mt-8">
                <div className="w-full border-t border-black/5 pt-8 mb-6 flex justify-between items-end">
                    <h2 className="text-lg font-bold text-[#0A1F44] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#004AAD]">feed</span>
                        Discover
                    </h2>
                    <button className="text-xs text-[#004AAD] hover:underline font-semibold">Settings</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {discoverFeed.map((post) => (
                        <div 
                            key={post.id} 
                            className="flex flex-col rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-black/5 group/news"
                        >
                            <div className="h-40 w-full overflow-hidden relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={post.image} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/news:scale-105"
                                />
                                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[10px] font-bold text-[#004AAD] uppercase tracking-wider shadow-sm">
                                    {post.category}
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1 justify-between">
                                <h3 className="text-[#0A1F44] font-bold text-sm leading-snug mb-3 group-hover/news:text-[#004AAD] transition-colors">
                                    {post.title}
                                </h3>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="size-5 rounded-full bg-[#E9F4FF] flex items-center justify-center text-[10px] font-bold text-[#0A1F44]">
                                            {post.source.charAt(0)}
                                        </div>
                                        <span className="text-[11px] text-[#5F7FA6] font-medium">{post.source}</span>
                                    </div>
                                    <span className="text-[11px] text-[#8FA9C9]">{post.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Customize Button (Floating) */}
            <div className="fixed bottom-6 right-6 z-20">
                <button
                    onClick={() => navigateToUrl(activeTabId!, 'dive://settings')}
                    className="flex items-center justify-center p-3 text-[#5F7FA6] hover:text-[#0A1F44] bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all hover:scale-105"
                    title="Customize Page"
                >
                    <span className="material-symbols-outlined text-[22px]">edit</span>
                </button>
            </div>
        </main>
    );
}
