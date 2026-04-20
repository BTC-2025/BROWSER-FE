'use client';

import React, { useState } from 'react';
import { useAgentRuntimeStore, AgentStep } from '@/stores/agentRuntimeStore';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
    navigation: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: 'explore' },
    extraction: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: 'search' },
    interaction: { bg: 'bg-amber-500/10', text: 'text-amber-400', icon: 'touch_app' },
    mutation: { bg: 'bg-red-500/10', text: 'text-red-400', icon: 'edit' },
};

const STATUS_CONFIG: Record<string, { color: string; icon: string; label: string }> = {
    pending: { color: 'text-[#8FA9C9]', icon: 'schedule', label: 'Pending' },
    approved: { color: 'text-blue-400', icon: 'check_circle', label: 'Approved' },
    rejected: { color: 'text-red-400', icon: 'cancel', label: 'Rejected' },
    executing: { color: 'text-amber-400', icon: 'progress_activity', label: 'Running' },
    completed: { color: 'text-emerald-400', icon: 'check_circle', label: 'Done' },
    failed: { color: 'text-red-400', icon: 'error', label: 'Failed' },
};

function StepCard({ step, onApprove, onReject }: { step: AgentStep; onApprove: () => void; onReject: () => void }) {
    const cat = CATEGORY_COLORS[step.toolCategory] || CATEGORY_COLORS.extraction;
    const status = STATUS_CONFIG[step.status] || STATUS_CONFIG.pending;
    const isPending = step.status === 'pending' && step.requiresApproval;
    const isExecuting = step.status === 'executing';

    return (
        <div className={`rounded-xl border transition-all ${isPending ? 'border-amber-500/30 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]' :
            isExecuting ? 'border-[#004AAD]/30 bg-[#004AAD]/5' :
                step.status === 'completed' ? 'border-emerald-500/20 bg-emerald-500/5' :
                    step.status === 'rejected' ? 'border-red-500/20 bg-red-500/5 opacity-60' :
                        'border-white/5 bg-white/[0.02]'
            }`}>
            <div className="p-3">
                {/* Header */}
                <div className="flex items-start gap-3">
                    <div className={`size-8 rounded-lg ${cat.bg} flex items-center justify-center shrink-0`}>
                        <span className={`material-symbols-outlined text-[18px] ${cat.text}`}>{cat.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-[#8FA9C9] bg-white/5 px-1.5 py-0.5 rounded">{step.toolName}</span>
                            <span className={`flex items-center gap-1 text-[10px] font-medium ${status.color}`}>
                                <span className={`material-symbols-outlined text-[12px] ${isExecuting ? 'animate-spin' : ''}`}>{status.icon}</span>
                                {status.label}
                            </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{step.reasoning}</p>
                        {/* Params */}
                        {Object.keys(step.params).length > 0 && (
                            <div className="mt-2 p-2 rounded-lg bg-black/20 border border-white/5">
                                {Object.entries(step.params).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2 text-[10px]">
                                        <span className="text-[#8FA9C9] font-mono">{key}:</span>
                                        <span className="text-slate-300 truncate">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Result */}
                        {step.result && (
                            <div className={`mt-2 p-2 rounded-lg border ${step.result.success ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'
                                }`}>
                                <span className={`text-[10px] font-medium ${step.result.success ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {step.result.success ? 'Success' : `Error: ${step.result.error}`}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                {/* Approval Buttons */}
                {isPending && (
                    <div className="flex gap-2 mt-3 pl-11">
                        <button
                            onClick={onApprove}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-[#0A1F44] text-xs font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                        >
                            <span className="material-symbols-outlined text-[14px]">check</span>
                            Approve
                        </button>
                        <button
                            onClick={onReject}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-red-500/20 text-[#5F7FA6] hover:text-red-400 text-xs font-medium rounded-lg transition-colors border border-white/5"
                        >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                            Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AgentPanel() {
    const {
        isOpen,
        currentTask,
        closePanel,
        startTask,
        approveStep,
        rejectStep,
        approveAll,
        cancelTask,
    } = useAgentRuntimeStore();

    const [objective, setObjective] = useState('');

    const handleStart = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!objective.trim()) return;
        const task = objective.trim();
        setObjective('');
        await startTask(task);
    };

    const pendingApprovals = currentTask?.steps.filter((s) => s.status === 'pending' && s.requiresApproval).length || 0;
    const completedSteps = currentTask?.steps.filter((s) => s.status === 'completed').length || 0;
    const totalSteps = currentTask?.steps.length || 0;

    return (
        <div
            className="flex flex-col h-full border-l border-white/5 shadow-2xl shadow-black/40 animate-fadeIn"
            style={{
                width: 'clamp(280px, 32vw, 440px)',
                background: 'rgba(15, 17, 21, 0.97)',
                backdropFilter: 'blur(20px)',
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                        <span className="material-symbols-outlined text-[#0A1F44] text-[18px]">smart_toy</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[#0A1F44]">Agent Runtime</h3>
                        <p className="text-[10px] text-[#8FA9C9]">Guided Mode</p>
                    </div>
                </div>
                <button
                    onClick={closePanel}
                    className="p-1.5 rounded-lg text-[#5F7FA6] hover:text-[#0A1F44] hover:bg-white/5 transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
            </div>

            {/* Task Input or Status */}
            {!currentTask || currentTask.status === 'completed' || currentTask.status === 'cancelled' ? (
                <div className="p-4 border-b border-white/5">
                    {/* Previous task result */}
                    {currentTask?.status === 'completed' && (
                        <div className="mb-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
                                <span className="text-xs font-semibold text-emerald-400">Task completed</span>
                            </div>
                            <p className="text-[10px] text-[#5F7FA6] mt-1 truncate">{currentTask.objective}</p>
                        </div>
                    )}
                    <form onSubmit={handleStart}>
                        <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-2 focus-within:border-amber-500/30 transition-colors">
                            <span className="material-symbols-outlined text-amber-500 text-[18px]">target</span>
                            <input
                                type="text"
                                value={objective}
                                onChange={(e) => setObjective(e.target.value)}
                                placeholder="What should the agent do?"
                                className="flex-1 bg-transparent border-none text-sm text-[#0A1F44] placeholder-slate-500 focus:outline-none focus:ring-0"
                            />
                            <button
                                type="submit"
                                disabled={!objective.trim()}
                                className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-[#0A1F44] transition-colors disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                            </button>
                        </div>
                    </form>
                    {/* Quick Tasks */}
                    <div className="mt-3 flex flex-wrap gap-2">
                        {[
                            { label: 'Search the web', icon: 'search' },
                            { label: 'Take a screenshot', icon: 'screenshot_monitor' },
                            { label: 'Extract page content', icon: 'article' },
                        ].map((qt) => (
                            <button
                                key={qt.label}
                                onClick={() => { setObjective(qt.label); }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-amber-500/20 text-[#5F7FA6] hover:text-[#0A1F44] text-[10px] transition-all"
                            >
                                <span className="material-symbols-outlined text-[12px]">{qt.icon}</span>
                                {qt.label}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="p-4 border-b border-white/5">
                    {/* Current task header */}
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#0A1F44] truncate">{currentTask.objective}</p>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] text-[#8FA9C9]">{completedSteps}/{totalSteps} steps</span>
                                {pendingApprovals > 0 && (
                                    <span className="flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                                        <span className="material-symbols-outlined text-[10px]">warning</span>
                                        {pendingApprovals} awaiting approval
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {pendingApprovals > 0 && (
                                <button
                                    onClick={approveAll}
                                    className="flex items-center gap-1 px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-[#0A1F44] text-[10px] font-semibold rounded-md transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[12px]">done_all</span>
                                    Approve All
                                </button>
                            )}
                            <button
                                onClick={cancelTask}
                                className="px-2 py-1 text-[#5F7FA6] hover:text-red-400 text-[10px] font-medium rounded-md hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-500 to-emerald-500"
                            style={{ width: `${totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Steps Timeline */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentTask?.status === 'planning' && (
                    <div className="flex flex-col items-center gap-4 py-12">
                        <span className="material-symbols-outlined text-[32px] text-amber-500 animate-spin">progress_activity</span>
                        <div className="text-center">
                            <p className="text-sm text-[#0A1F44] font-medium">Planning...</p>
                            <p className="text-xs text-[#8FA9C9] mt-1">Analyzing objective and creating execution plan</p>
                        </div>
                    </div>
                )}

                {currentTask?.steps.map((step) => (
                    <StepCard
                        key={step.id}
                        step={step}
                        onApprove={() => approveStep(step.id)}
                        onReject={() => rejectStep(step.id)}
                    />
                ))}

                {!currentTask && (
                    <div className="flex flex-col items-center gap-4 py-12 text-center">
                        <div className="size-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 flex items-center justify-center border border-amber-500/20">
                            <span className="material-symbols-outlined text-amber-500 text-3xl">memory</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#0A1F44]">Guided Agent Mode</p>
                            <p className="text-xs text-[#8FA9C9] mt-1 max-w-[280px]">
                                Tell the agent what to do. It will plan steps, and pause for your approval on sensitive actions.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full mt-2">
                            {[
                                { icon: 'explore', label: 'Auto-navigate', desc: 'Safe' },
                                { icon: 'search', label: 'Extract data', desc: 'Safe' },
                                { icon: 'touch_app', label: 'Click elements', desc: 'Approval' },
                                { icon: 'edit', label: 'Fill forms', desc: 'Approval' },
                            ].map((cap) => (
                                <div key={cap.label} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                                    <span className="material-symbols-outlined text-[#5F7FA6] text-[16px]">{cap.icon}</span>
                                    <p className="text-[10px] text-slate-300 font-medium mt-1">{cap.label}</p>
                                    <p className={`text-[9px] mt-0.5 ${cap.desc === 'Safe' ? 'text-emerald-500' : 'text-amber-500'}`}>{cap.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
