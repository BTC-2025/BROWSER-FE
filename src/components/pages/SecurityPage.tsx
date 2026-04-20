'use client';

import React from 'react';
import { useMemorySecurityStore, PERMISSION_LABELS, PermissionScope, PermissionLevel } from '@/stores/memorySecurityStore';

const LEVEL_CONFIG: Record<PermissionLevel, { color: string; bg: string; icon: string; label: string }> = {
    granted: { color: 'text-emerald-400', bg: 'bg-emerald-500', icon: 'check_circle', label: 'Allowed' },
    denied: { color: 'text-red-400', bg: 'bg-red-500', icon: 'block', label: 'Blocked' },
    prompt: { color: 'text-amber-400', bg: 'bg-amber-500', icon: 'help', label: 'Ask' },
};

const SCOPE_GROUPS: { title: string; scopes: PermissionScope[] }[] = [
    {
        title: 'Browser Data',
        scopes: ['browsing_history', 'bookmarks', 'downloads', 'cookies', 'storage'],
    },
    {
        title: 'Hardware Access',
        scopes: ['geolocation', 'camera', 'microphone'],
    },
    {
        title: 'Page Interaction',
        scopes: ['tabs', 'active_tab', 'dom_access', 'form_submit', 'web_navigation'],
    },
    {
        title: 'Communication',
        scopes: ['notifications', 'clipboard', 'network_requests'],
    },
];

export default function SecurityPage() {
    const { permissions, setPermission, resetPermissions } = useMemorySecurityStore();

    const getLevel = (scope: PermissionScope): PermissionLevel => {
        return permissions.find((p) => p.scope === scope)?.level || 'prompt';
    };

    const cycleLevel = (scope: PermissionScope) => {
        const current = getLevel(scope);
        const next: PermissionLevel = current === 'granted' ? 'prompt' : current === 'prompt' ? 'denied' : 'granted';
        setPermission(scope, next);
    };

    const grantedCount = permissions.filter((p) => p.level === 'granted').length;
    const deniedCount = permissions.filter((p) => p.level === 'denied').length;
    const promptCount = permissions.filter((p) => p.level === 'prompt').length;

    return (
        <main className="flex-1 overflow-y-auto" style={{ background: '#FFFFFF' }}>
            <div className="max-w-4xl mx-auto px-8 py-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            <span className="material-symbols-outlined text-[#0A1F44] text-3xl">shield</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A1F44]" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                                Security & Permissions
                            </h1>
                            <p className="text-sm text-[#5F7FA6] mt-1">
                                Control what Dive Browser and extensions can access
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={resetPermissions}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
                    >
                        <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                        Reset All
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Allowed', count: grantedCount, color: 'emerald', icon: 'check_circle' },
                        { label: 'Ask First', count: promptCount, color: 'amber', icon: 'help' },
                        { label: 'Blocked', count: deniedCount, color: 'red', icon: 'block' },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className={`p-4 rounded-xl border border-${stat.color}-500/20 bg-${stat.color}-500/5`}
                            style={{
                                borderColor: stat.color === 'emerald' ? 'rgba(16,185,129,0.2)' : stat.color === 'amber' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                                background: stat.color === 'emerald' ? 'rgba(16,185,129,0.05)' : stat.color === 'amber' ? 'rgba(245,158,11,0.05)' : 'rgba(239,68,68,0.05)',
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <span className={`material-symbols-outlined text-[20px] ${stat.color === 'emerald' ? 'text-emerald-400' : stat.color === 'amber' ? 'text-amber-400' : 'text-red-400'
                                    }`}>{stat.icon}</span>
                                <span className="text-2xl font-bold text-[#0A1F44]">{stat.count}</span>
                            </div>
                            <p className="text-xs text-[#5F7FA6] mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Permission Groups */}
                <div className="space-y-6">
                    {SCOPE_GROUPS.map((group) => (
                        <div key={group.title}>
                            <h3 className="text-xs font-bold text-[#5F7FA6] uppercase tracking-wider mb-3">{group.title}</h3>
                            <div className="rounded-xl border border-white/5 overflow-hidden">
                                {group.scopes.map((scope, i) => {
                                    const level = getLevel(scope);
                                    const config = LEVEL_CONFIG[level];
                                    const info = PERMISSION_LABELS[scope];
                                    return (
                                        <div
                                            key={scope}
                                            className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors ${i < group.scopes.length - 1 ? 'border-b border-white/5' : ''
                                                }`}
                                        >
                                            <div className="size-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-slate-300 text-[20px]">{info.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-[#0A1F44]">{info.label}</p>
                                                <p className="text-[11px] text-[#8FA9C9]">{info.description}</p>
                                            </div>
                                            <button
                                                onClick={() => cycleLevel(scope)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${config.color}`}
                                                style={{
                                                    background: level === 'granted' ? 'rgba(16,185,129,0.1)' : level === 'denied' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                                                }}
                                            >
                                                <span className="material-symbols-outlined text-[14px]">{config.icon}</span>
                                                {config.label}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Security Info */}
                <div className="mt-8 p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex gap-3">
                        <span className="material-symbols-outlined text-emerald-400 text-[20px] shrink-0 mt-0.5">info</span>
                        <div>
                            <p className="text-sm font-semibold text-[#0A1F44]">How permissions work</p>
                            <p className="text-xs text-[#5F7FA6] mt-1 leading-relaxed">
                                Click any permission to cycle through <strong className="text-emerald-400">Allowed</strong>,{' '}
                                <strong className="text-amber-400">Ask First</strong>, and{' '}
                                <strong className="text-red-400">Blocked</strong>. Extensions and agents inherit these settings.
                                Blocked permissions are enforced at the IPC layer and cannot be bypassed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
