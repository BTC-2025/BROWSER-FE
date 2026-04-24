'use client';

import React, { useState } from 'react';
import { useSettingsStore, SearchEngine, NewTabBackground } from '@/stores/settingsStore';
import DiveLogo from '@/components/brand/DiveLogo';

const settingsNav = [
    {
        section: 'Settings', items: [
            { id: 'appearance', icon: 'palette', label: 'Appearance' },
            { id: 'search', icon: 'search', label: 'Search Engine' },
            { id: 'privacy', icon: 'shield', label: 'Privacy' },
            { id: 'general', icon: 'settings', label: 'General' },
        ]
    },
    {
        section: 'Account', items: [
            { id: 'profile', icon: 'person', label: 'Profile' },
            { id: 'sync', icon: 'sync', label: 'Sync' },
        ]
    },
];

const accentColors = [
    { name: 'Neon Blue', value: '#004AAD' },
    { name: 'Cyber Pink', value: '#ec4899' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Amber', value: '#f59e0b' },
];

const backgrounds: { id: NewTabBackground; name: string; preview: string }[] = [
    { id: 'aurora', name: 'Aurora Edge', preview: 'linear-gradient(45deg, #004AAD, #a855f7)' },
    { id: 'glass', name: 'Frosted Glass', preview: 'linear-gradient(to right bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' },
    { id: 'space', name: 'Deep Space', preview: 'url(https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=200&auto=format&fit=crop)' },
    { id: 'nature', name: 'Nordic Forest', preview: 'url(https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=200&auto=format&fit=crop)' },
    { id: 'minimal', name: 'Minimal Dark', preview: '#FFFFFF' },
];

const searchEngines: { id: SearchEngine; name: string; domain: string; icon: string }[] = [
    { id: 'google', name: 'Google', domain: 'google.com', icon: 'travel_explore' },
    { id: 'duckduckgo', name: 'DuckDuckGo', domain: 'duckduckgo.com', icon: 'privacy_tip' },
    { id: 'bing', name: 'Bing', domain: 'bing.com', icon: 'search' },
    { id: 'perplexity', name: 'Perplexity', domain: 'perplexity.ai', icon: 'smart_toy' },
    { id: 'brave', name: 'Brave Search', domain: 'search.brave.com', icon: 'shield' },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('appearance');

    const {
        themeMode, accentColor, density, glassmorphism, animations, searchEngine, newTabBackground,
        setThemeMode, setAccentColor, setDensity, setGlassmorphism, setAnimations, setSearchEngine, setNewTabBackground, resetToDefaults
    } = useSettingsStore();

    return (
        <div className="flex-1 flex overflow-hidden relative" style={{ background: '#0f1115', backgroundImage: 'radial-gradient(at 0% 0%, rgba(0, 74, 173, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.1) 0px, transparent 50%)' }}>
            {/* Sidebar Navigation */}
            <aside className="glass-panel w-72 flex-shrink-0 flex flex-col h-full border-r border-white/5 relative z-20" style={{ background: 'rgba(15, 17, 21, 0.7)', backdropFilter: 'blur(20px)' }}>
                {/* Header Logo */}
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <DiveLogo
                            className="h-10 w-16 shrink-0 rounded-xl bg-white/80 shadow-sm ring-1 ring-white/50"
                            markClassName="h-7 w-auto"
                        />
                        <div>
                            <h1 className="font-future text-xl tracking-wide text-[#0A1F44]">Dive</h1>
                            <p className="text-xs text-[#5F7FA6]">Settings</p>
                        </div>
                    </div>
                </div>
                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-1">
                    {settingsNav.map((group) => (
                        <React.Fragment key={group.section}>
                            <p className="px-3 text-xs font-semibold text-[#8FA9C9] uppercase tracking-wider mb-2">{group.section}</p>
                            {group.items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left ${activeSection === item.id
                                        ? 'text-[#0A1F44] border'
                                        : 'text-[#5F7FA6] hover:text-[#0A1F44] hover:bg-white/5 border border-transparent'
                                        }`}
                                    style={activeSection === item.id ? {
                                        background: `${accentColor}1A`,
                                        borderColor: `${accentColor}33`,
                                        boxShadow: `0 0 10px ${accentColor}33`,
                                        color: accentColor
                                    } : {}}
                                >
                                    <span className="material-symbols-outlined" style={activeSection === item.id ? { fontVariationSettings: "'FILL' 1", color: accentColor } : {}}>{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                            {group.section === 'Settings' && <div className="my-4 border-t border-white/5" />}
                        </React.Fragment>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700" style={{ background: `${accentColor}33` }} />
                <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative z-10">
                    <div className="max-w-4xl mx-auto space-y-10">

                        {/* APPEARANCE SECTION */}
                        {activeSection === 'appearance' && (
                            <div className="animate-fadeIn space-y-10">
                                <div className="flex flex-col gap-2">
                                    <h1 className="font-future text-4xl md:text-5xl text-[#0A1F44] tracking-tight drop-shadow-lg">Appearance</h1>
                                    <p className="text-lg text-[#5F7FA6] font-light">Customize the look and feel of your browsing experience.</p>
                                </div>

                                {/* New Tab Background */}
                                <section className="glass-card rounded-2xl p-6 backdrop-blur-sm border border-white/5 bg-black/20 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-[#0A1F44]">New Tab Background</h2>
                                            <p className="text-[#5F7FA6] text-sm mt-1">Select a stunning backdrop for your new tab pages.</p>
                                        </div>
                                        <span className="material-symbols-outlined text-[#8FA9C9] text-3xl">wallpaper</span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {backgrounds.map((bg) => (
                                            <label key={bg.id} className="cursor-pointer group relative">
                                                <input className="peer sr-only" name="bg" type="radio" value={bg.id} checked={newTabBackground === bg.id} onChange={() => setNewTabBackground(bg.id)} />
                                                <div
                                                    className={`h-28 rounded-xl border transition-all duration-300 overflow-hidden relative ${newTabBackground === bg.id ? 'border-transparent shadow-lg' : 'border-white/10 opacity-70 group-hover:opacity-100 group-hover:border-white/30'}`}
                                                    style={newTabBackground === bg.id ? { boxShadow: `0 0 0 2px ${accentColor}, 0 0 15px ${accentColor}66` } : {}}
                                                >
                                                    <div className="absolute inset-0 bg-cover bg-center" style={{ background: bg.preview, backgroundSize: 'cover' }} />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2 border-t border-white/10">
                                                        <span className="text-xs font-medium text-[#0A1F44] shadow-black drop-shadow-md">{bg.name}</span>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </section>

                                {/* Accent Color Section */}
                                <section className="glass-card rounded-2xl p-6 backdrop-blur-sm border border-white/5 bg-black/20 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-[#0A1F44]">Accent Color</h2>
                                            <p className="text-[#5F7FA6] text-sm mt-1">Choose the primary color for buttons and highlights.</p>
                                        </div>
                                        <span className="material-symbols-outlined text-[#8FA9C9] text-3xl">colors</span>
                                    </div>
                                    <div className="flex flex-wrap gap-6">
                                        {accentColors.map((color) => (
                                            <label key={color.value} className="cursor-pointer group relative">
                                                <input className="peer sr-only" name="accent" type="radio" value={color.value} checked={accentColor === color.value} onChange={() => setAccentColor(color.value)} />
                                                <div
                                                    className="w-16 h-16 rounded-full transition-transform peer-checked:scale-110 peer-checked:ring-4 ring-offset-4 ring-offset-[#13161f]"
                                                    style={{
                                                        background: color.value,
                                                        boxShadow: `0 0 15px ${color.value}66`,
                                                        '--tw-ring-color': color.value,
                                                    } as React.CSSProperties}
                                                />
                                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-[#5F7FA6] whitespace-nowrap peer-checked:text-[#0A1F44]">{color.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="h-4" />
                                </section>

                                {/* Toggle Grid */}
                                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-white/5 text-[#0A1F44]">
                                                <span className="material-symbols-outlined">blur_on</span>
                                            </div>
                                            <div>
                                                <p className="text-[#0A1F44] font-medium">Glassmorphism</p>
                                                <p className="text-xs text-[#5F7FA6]">Enable transparency effects</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={glassmorphism} onChange={() => setGlassmorphism(!glassmorphism)} />
                                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner" style={glassmorphism ? { background: accentColor } : {}} />
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-white/5 text-[#0A1F44]">
                                                <span className="material-symbols-outlined">animation</span>
                                            </div>
                                            <div>
                                                <p className="text-[#0A1F44] font-medium">Fluid Animations</p>
                                                <p className="text-xs text-[#5F7FA6]">Smooth UI transitions</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={animations} onChange={() => setAnimations(!animations)} />
                                            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner" style={animations ? { background: accentColor } : {}} />
                                        </label>
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* SEARCH ENGINE SECTION */}
                        {activeSection === 'search' && (
                            <div className="animate-fadeIn space-y-10">
                                <div className="flex flex-col gap-2">
                                    <h1 className="font-future text-4xl md:text-5xl text-[#0A1F44] tracking-tight drop-shadow-lg">Search Engine</h1>
                                    <p className="text-lg text-[#5F7FA6] font-light">Choose your preferred default search provider.</p>
                                </div>

                                <section className="glass-card rounded-2xl p-6 backdrop-blur-sm border border-white/5 bg-black/20 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-[#0A1F44]">Default Search Engine</h2>
                                            <p className="text-[#5F7FA6] text-sm mt-1">Used in the address bar and new tab page.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {searchEngines.map((engine) => (
                                            <label key={engine.id} className="cursor-pointer group relative flex items-center justify-between p-4 rounded-xl border bg-[#0a0c10] transition-all" style={searchEngine === engine.id ? { borderColor: `${accentColor}80`, background: `${accentColor}11`, boxShadow: `0 0 10px ${accentColor}33` } : { borderColor: 'rgba(255,255,255,0.05)' }}>
                                                <input className="peer sr-only" name="searchEngine" type="radio" value={engine.id} checked={searchEngine === engine.id} onChange={() => setSearchEngine(engine.id)} />
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-full flex items-center justify-center bg-white/5 text-slate-300 group-hover:text-[#0A1F44] transition-colors" style={searchEngine === engine.id ? { background: `${accentColor}33`, color: accentColor } : {}}>
                                                        <span className="material-symbols-outlined">{engine.icon}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[#0A1F44] font-medium text-lg">{engine.name}</p>
                                                        <p className="text-[#5F7FA6] text-sm">{engine.domain}</p>
                                                    </div>
                                                </div>
                                                <div className="size-5 rounded-full border-2 flex items-center justify-center transition-colors" style={searchEngine === engine.id ? { borderColor: accentColor } : { borderColor: 'rgba(255,255,255,0.2)' }}>
                                                    {searchEngine === engine.id && <div className="size-2.5 rounded-full" style={{ background: accentColor }} />}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* OTHER SECTIONS (Placeholder) */}
                        {(activeSection === 'privacy' || activeSection === 'general' || activeSection === 'profile' || activeSection === 'sync') && (
                            <div className="animate-fadeIn space-y-10 flex flex-col items-center justify-center py-20 opacity-50">
                                <span className="material-symbols-outlined text-6xl text-[#8FA9C9]">construction</span>
                                <p className="text-xl text-[#5F7FA6]">Section under Construction</p>
                            </div>
                        )}

                        {/* Save Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-8 border-dashed">
                            <button onClick={resetToDefaults} className="px-6 py-2.5 rounded-lg text-sm font-medium text-[#0A1F44] hover:bg-white/10 transition-colors">Reset Defaults</button>
                            <button className="px-8 py-2.5 rounded-lg text-sm font-medium text-[#0A1F44] shadow-lg transition-all" style={{ background: accentColor, boxShadow: `0 4px 14px ${accentColor}66` }}>Settings Saved Automatically</button>
                        </div>
                        <div className="h-10" />
                    </div>
                </div>
            </main>
        </div>
    );
}
