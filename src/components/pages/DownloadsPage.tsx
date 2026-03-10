'use client';

import React, { useState } from 'react';

const sampleDownloads = [
    { id: '1', name: 'design-system-v2.fig', size: '42.5 MB', status: 'complete', progress: 100, icon: 'design_services', date: 'Today, 10:42 AM' },
    { id: '2', name: 'architecture-diagram.pdf', size: '8.2 MB', status: 'complete', progress: 100, icon: 'picture_as_pdf', date: 'Today, 09:15 AM' },
    { id: '3', name: 'nexus-browser-v128.dmg', size: '195 MB', status: 'downloading', progress: 67, icon: 'desktop_windows', date: 'Now' },
    { id: '4', name: 'react-patterns.epub', size: '12.1 MB', status: 'paused', progress: 34, icon: 'book', date: 'Yesterday' },
    { id: '5', name: 'lofi-beats-mix.mp3', size: '6.8 MB', status: 'complete', progress: 100, icon: 'music_note', date: 'Yesterday' },
    { id: '6', name: 'project-alpha.zip', size: '256 MB', status: 'complete', progress: 100, icon: 'folder_zip', date: '2 days ago' },
];

export default function DownloadsPage() {
    const [filter, setFilter] = useState<'all' | 'complete' | 'active'>('all');

    const filteredDownloads = sampleDownloads.filter((d) => {
        if (filter === 'complete') return d.status === 'complete';
        if (filter === 'active') return d.status !== 'complete';
        return true;
    });

    return (
        <div className="flex-1 flex flex-col overflow-hidden relative" style={{ background: '#101622' }}>
            {/* Background Glows */}
            <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-[#135bec]/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative z-10">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-[#135bec]/10">
                                    <span className="material-symbols-outlined text-[#135bec] text-2xl">download</span>
                                </div>
                                <h1 className="font-future text-3xl md:text-4xl text-white tracking-tight">Downloads</h1>
                            </div>
                            <p className="text-slate-400 text-sm">Manage and track your downloaded files.</p>
                        </div>
                        <button className="text-sm font-medium text-slate-400 hover:text-red-400 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
                            Clear All
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        {(['all', 'active', 'complete'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors capitalize ${filter === f
                                        ? 'bg-[#135bec]/20 text-[#135bec] border border-[#135bec]/30'
                                        : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Download List */}
                    <div className="space-y-3">
                        {filteredDownloads.map((dl) => (
                            <div key={dl.id} className="glass-card rounded-xl p-4 flex items-center gap-4 group">
                                {/* Icon */}
                                <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${dl.status === 'downloading' ? 'bg-[#135bec]/20 text-[#135bec]' :
                                        dl.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                                            'bg-slate-800 text-slate-400'
                                    }`}>
                                    <span className="material-symbols-outlined text-2xl">{dl.icon}</span>
                                </div>
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-[#135bec] transition-colors">{dl.name}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-slate-500">{dl.size}</span>
                                        <span className="text-xs text-slate-600">•</span>
                                        <span className="text-xs text-slate-500">{dl.date}</span>
                                    </div>
                                    {/* Progress Bar */}
                                    {dl.status !== 'complete' && (
                                        <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${dl.status === 'downloading' ? 'bg-[#135bec]' : 'bg-amber-500'}`}
                                                style={{ width: `${dl.progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                                {/* Actions */}
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {dl.status === 'downloading' && (
                                        <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">pause</span>
                                        </button>
                                    )}
                                    {dl.status === 'paused' && (
                                        <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                                        </button>
                                    )}
                                    {dl.status === 'complete' && (
                                        <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">folder_open</span>
                                        </button>
                                    )}
                                    <button className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                                {/* Status Badge */}
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${dl.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                                        dl.status === 'downloading' ? 'bg-[#135bec]/20 text-[#135bec]' :
                                            'bg-amber-500/20 text-amber-400'
                                    }`}>
                                    {dl.status === 'downloading' ? `${dl.progress}%` : dl.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
