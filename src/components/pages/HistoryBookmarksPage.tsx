'use client';

import React, { useState } from 'react';
import DiveLogo from '@/components/brand/DiveLogo';

// Sample history data grouped by date
const historyData = {
    Today: [
        { id: '1', title: 'Merge pull request #42', url: 'github.com/design-system', time: '10:42 AM', icon: 'code' },
        { id: '2', title: 'Mobile UI Inspiration', url: 'dribbble.com/shots', time: '10:15 AM', icon: 'palette' },
        { id: '3', title: 'Project Alpha - Design File', url: 'figma.com/file/...', time: '09:30 AM', icon: 'design_services' },
    ],
    Yesterday: [
        { id: '4', title: 'Understanding CSS Grid', url: 'css-tricks.com', time: '4:20 PM', icon: 'article' },
        { id: '5', title: 'Lo-Fi Hip Hop Radio', url: 'youtube.com', time: '2:00 PM', icon: 'play_circle' },
        { id: '6', title: 'React 19 Release Notes', url: 'react.dev/blog', time: '11:30 AM', icon: 'article' },
    ],
    'Last Week': [
        { id: '7', title: 'Tailwind CSS Documentation', url: 'tailwindcss.com/docs', time: 'Mon', icon: 'terminal' },
        { id: '8', title: 'VS Code Shortcuts Cheatsheet', url: 'code.visualstudio.com', time: 'Sun', icon: 'keyboard' },
    ],
};

// Sample bookmark data
const bookmarkFolders = ['All Bookmarks', 'Design Resources', 'Development', 'Reading List', 'Entertainment'];
const bookmarks = [
    { id: '1', title: 'Dribbble - Popular', url: 'dribbble.com', gradient: 'from-purple-900 to-indigo-900', icon: 'palette' },
    { id: '2', title: 'GitHub Dashboard', url: 'github.com', gradient: 'from-gray-900 to-slate-800', icon: 'code' },
    { id: '3', title: 'Watch Later', url: 'youtube.com/playlist', gradient: 'from-orange-900 to-red-900', icon: 'play_arrow' },
    { id: '4', title: 'Awwwards - Winners', url: 'awwwards.com', gradient: 'from-blue-900 to-cyan-900', icon: 'emoji_events' },
    { id: '5', title: 'Tailwind CSS Docs', url: 'tailwindcss.com', gradient: 'from-green-900 to-emerald-900', icon: 'terminal' },
];

export default function HistoryBookmarksPage() {
    const [historySearch, setHistorySearch] = useState('');
    const [activeFolder, setActiveFolder] = useState('All Bookmarks');

    return (
        <div className="flex-1 flex flex-col overflow-hidden relative" style={{ background: '#FFFFFF' }}>
            {/* Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#004AAD]/20 rounded-full blur-[120px] pointer-events-none opacity-40" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none opacity-30" />

            {/* Top Bar */}
            <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-[#FFFFFF]/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-4">
                    <DiveLogo
                        className="h-8 w-14 shrink-0 rounded-lg bg-white shadow-sm ring-1 ring-[#DDEEFF]"
                        markClassName="h-5 w-auto"
                    />
                    <h2 className="text-lg font-bold leading-tight tracking-tight text-[#0A1F44]">Dive Browser</h2>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <a className="text-[#5F7FA6] hover:text-[#004AAD] transition-colors text-sm font-medium cursor-pointer">Dashboard</a>
                    <a className="text-[#004AAD] font-bold text-sm cursor-pointer">Library</a>
                    <a className="text-[#5F7FA6] hover:text-[#004AAD] transition-colors text-sm font-medium cursor-pointer">Extensions</a>
                </nav>
            </header>

            {/* Main Split Layout */}
            <main className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-hidden z-10">
                {/* Left Panel: History Timeline */}
                <aside className="flex flex-col w-full md:w-[400px] lg:w-[450px] shrink-0 glass-panel rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                    {/* History Header */}
                    <div className="p-5 border-b border-white/5 bg-white/5 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#004AAD]">history</span>
                                <h3 className="text-xl font-bold text-[#0A1F44]">History</h3>
                            </div>
                            <button className="text-xs font-medium text-[#8FA9C9] hover:text-red-400 transition-colors px-3 py-1.5 rounded-full hover:bg-white/5">
                                Clear Data
                            </button>
                        </div>
                        {/* Search */}
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA9C9] group-focus-within:text-[#004AAD] transition-colors text-xl">search</span>
                            <input
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#004AAD] focus:ring-1 focus:ring-[#004AAD] transition-all"
                                placeholder="Search visited pages..."
                                type="text"
                                value={historySearch}
                                onChange={(e) => setHistorySearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Timeline List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-6">
                        {Object.entries(historyData).map(([group, items]) => (
                            <div key={group} className="px-3">
                                <h4 className="text-xs font-bold text-[#8FA9C9] uppercase tracking-wider mb-3 ml-2">{group}</h4>
                                <div className="space-y-1">
                                    {items
                                        .filter((item) => !historySearch || item.title.toLowerCase().includes(historySearch.toLowerCase()))
                                        .map((item) => (
                                            <a key={item.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 group transition-colors relative cursor-pointer">
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#004AAD] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                                                    <span className="material-symbols-outlined text-[#5F7FA6] text-lg">{item.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-200 truncate group-hover:text-[#004AAD] transition-colors">{item.title}</p>
                                                    <p className="text-xs text-[#8FA9C9] truncate">{item.url}</p>
                                                </div>
                                                <span className="text-xs text-slate-600 font-mono">{item.time}</span>
                                            </a>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Right Panel: Bookmarks Grid */}
                <section className="flex-1 flex flex-col glass-panel rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                    {/* Bookmarks Header */}
                    <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#004AAD]">bookmarks</span>
                                <h3 className="text-xl font-bold text-[#0A1F44]">Bookmarks</h3>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#004AAD] hover:bg-blue-600 text-[#0A1F44] text-sm font-semibold rounded-lg transition-all shadow-lg shadow-[#004AAD]/20">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Add New
                            </button>
                        </div>
                        {/* Folder Tags */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                            {bookmarkFolders.map((folder) => (
                                <button
                                    key={folder}
                                    onClick={() => setActiveFolder(folder)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFolder === folder
                                            ? 'bg-[#004AAD]/20 text-[#004AAD] border border-[#004AAD]/30'
                                            : 'bg-slate-800/50 hover:bg-slate-800 text-[#5F7FA6] hover:text-[#0A1F44] border border-slate-700/50'
                                        }`}
                                >
                                    {folder}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-transparent to-black/20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {bookmarks.map((bm) => (
                                <div key={bm.id} className="glass-card group rounded-xl p-4 flex flex-col gap-3 relative cursor-pointer">
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-[#5F7FA6] hover:text-[#0A1F44] p-1 rounded hover:bg-white/10">
                                            <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                                        </button>
                                    </div>
                                    <div className="h-32 rounded-lg bg-slate-800 w-full overflow-hidden border border-slate-700 relative">
                                        <div className={`w-full h-full bg-gradient-to-tr ${bm.gradient} flex items-center justify-center`}>
                                            <span className="material-symbols-outlined text-4xl text-[#0A1F44]/20">{bm.icon}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-200 truncate pr-6 group-hover:text-[#004AAD] transition-colors">{bm.title}</h4>
                                        <p className="text-xs text-[#8FA9C9] truncate">{bm.url}</p>
                                    </div>
                                </div>
                            ))}
                            {/* Add Bookmark Card */}
                            <div className="rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer border border-dashed border-slate-700 hover:border-[#004AAD]/50 hover:bg-[#004AAD]/5 transition-colors group">
                                <div className="size-12 rounded-full bg-slate-800 group-hover:bg-[#004AAD]/20 flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-[#5F7FA6] group-hover:text-[#004AAD]">add</span>
                                </div>
                                <p className="text-sm font-medium text-[#8FA9C9] group-hover:text-[#004AAD] transition-colors">Add Bookmark</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
