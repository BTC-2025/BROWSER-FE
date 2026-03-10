// Agent Runtime Zustand Store
// Manages agent tasks, step approval workflow, and execution state.

import { create } from 'zustand';

export type StepStatus = 'pending' | 'approved' | 'rejected' | 'executing' | 'completed' | 'failed';
export type TaskStatus = 'idle' | 'planning' | 'awaiting_approval' | 'executing' | 'completed' | 'failed' | 'cancelled';

export interface AgentStep {
    id: string;
    toolName: string;
    toolCategory: 'navigation' | 'extraction' | 'interaction' | 'mutation';
    params: Record<string, unknown>;
    reasoning: string;
    requiresApproval: boolean;
    status: StepStatus;
    result?: { success: boolean; data?: unknown; error?: string };
    timestamp: number;
}

export interface AgentTask {
    id: string;
    objective: string;
    steps: AgentStep[];
    status: TaskStatus;
    createdAt: number;
    completedAt?: number;
}

interface AgentRuntimeStore {
    // State
    isOpen: boolean;
    currentTask: AgentTask | null;
    taskHistory: AgentTask[];

    // Panel actions
    openPanel: () => void;
    closePanel: () => void;
    togglePanel: () => void;

    // Task actions
    startTask: (objective: string) => Promise<void>;
    approveStep: (stepId: string) => Promise<void>;
    rejectStep: (stepId: string) => void;
    approveAll: () => Promise<void>;
    cancelTask: () => void;
}

let stepCounter = 0;

// Mock planner — generates a sequence of steps for an objective
function mockPlan(objective: string): AgentStep[] {
    const lowerObj = objective.toLowerCase();
    const steps: AgentStep[] = [];
    const id = () => `step-${++stepCounter}`;
    const ts = () => Date.now();

    if (lowerObj.includes('search') || lowerObj.includes('find')) {
        const query = objective.replace(/search\s*(for)?\s*/i, '').replace(/find\s*/i, '').trim() || objective;
        steps.push({
            id: id(), toolName: 'navigate_to_url', toolCategory: 'navigation',
            params: { url: `https://www.google.com/search?q=${encodeURIComponent(query)}` },
            reasoning: `Navigate to Google to search for "${query}"`,
            requiresApproval: false, status: 'pending', timestamp: ts(),
        });
        steps.push({
            id: id(), toolName: 'get_page_content', toolCategory: 'extraction',
            params: {},
            reasoning: 'Extract search results from the page',
            requiresApproval: false, status: 'pending', timestamp: ts(),
        });
        steps.push({
            id: id(), toolName: 'click_element', toolCategory: 'interaction',
            params: { selector: 'h3:first-of-type' },
            reasoning: 'Click the first search result to get more details',
            requiresApproval: true, status: 'pending', timestamp: ts(),
        });
        steps.push({
            id: id(), toolName: 'get_page_content', toolCategory: 'extraction',
            params: {},
            reasoning: 'Extract content from the selected result page',
            requiresApproval: false, status: 'pending', timestamp: ts(),
        });
    } else if (lowerObj.includes('fill') || lowerObj.includes('form')) {
        steps.push({
            id: id(), toolName: 'get_page_content', toolCategory: 'extraction',
            params: {},
            reasoning: 'Analyze the current page to find form fields',
            requiresApproval: false, status: 'pending', timestamp: ts(),
        });
        steps.push({
            id: id(), toolName: 'query_selector_all', toolCategory: 'extraction',
            params: { selector: 'input, select, textarea' },
            reasoning: 'Identify all form input fields',
            requiresApproval: false, status: 'pending', timestamp: ts(),
        });
        steps.push({
            id: id(), toolName: 'fill_form', toolCategory: 'mutation',
            params: { formSelector: 'form', fields: '{}' },
            reasoning: 'Fill the form with the requested data',
            requiresApproval: true, status: 'pending', timestamp: ts(),
        });
        steps.push({
            id: id(), toolName: 'submit_form', toolCategory: 'mutation',
            params: { formSelector: 'form' },
            reasoning: 'Submit the completed form',
            requiresApproval: true, status: 'pending', timestamp: ts(),
        });
    } else if (lowerObj.includes('screenshot') || lowerObj.includes('capture')) {
        steps.push({
            id: id(), toolName: 'take_screenshot', toolCategory: 'extraction',
            params: {},
            reasoning: 'Capture a screenshot of the current page',
            requiresApproval: false, status: 'pending', timestamp: ts(),
        });
    } else {
        // Generic: navigate + extract
        steps.push({
            id: id(), toolName: 'get_page_url', toolCategory: 'extraction',
            params: {},
            reasoning: 'Check the current page URL to understand context',
            requiresApproval: false, status: 'pending', timestamp: ts(),
        });
        steps.push({
            id: id(), toolName: 'get_page_content', toolCategory: 'extraction',
            params: {},
            reasoning: 'Extract the page content to analyze',
            requiresApproval: false, status: 'pending', timestamp: ts(),
        });
        steps.push({
            id: id(), toolName: 'navigate_to_url', toolCategory: 'navigation',
            params: { url: `https://www.google.com/search?q=${encodeURIComponent(objective)}` },
            reasoning: `Search for "${objective}" to gather more information`,
            requiresApproval: false, status: 'pending', timestamp: ts(),
        });
        steps.push({
            id: id(), toolName: 'get_page_content', toolCategory: 'extraction',
            params: {},
            reasoning: 'Extract search results to provide an answer',
            requiresApproval: false, status: 'pending', timestamp: ts(),
        });
    }

    return steps;
}

async function mockExecuteStep(step: AgentStep): Promise<{ success: boolean; data?: unknown; error?: string }> {
    // Simulate execution delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));

    return {
        success: true,
        data: {
            tool: step.toolName,
            message: `Successfully executed ${step.toolName}`,
            params: step.params,
        },
    };
}

export const useAgentRuntimeStore = create<AgentRuntimeStore>((set, get) => ({
    isOpen: false,
    currentTask: null,
    taskHistory: [],

    openPanel: () => set({ isOpen: true }),
    closePanel: () => set({ isOpen: false }),
    togglePanel: () => {
        const { isOpen } = get();
        set({ isOpen: !isOpen });
    },

    startTask: async (objective: string) => {
        set({ currentTask: { id: `task-${Date.now()}`, objective, steps: [], status: 'planning', createdAt: Date.now() } });

        // Simulate planning delay
        await new Promise((r) => setTimeout(r, 1500));

        const steps = mockPlan(objective);
        const hasApprovalSteps = steps.some((s) => s.requiresApproval);

        set({
            currentTask: {
                id: `task-${Date.now()}`,
                objective,
                steps,
                status: hasApprovalSteps ? 'awaiting_approval' : 'executing',
                createdAt: Date.now(),
            },
        });

        // If no steps require approval, auto-execute all
        if (!hasApprovalSteps) {
            const { currentTask } = get();
            if (!currentTask) return;

            for (let i = 0; i < currentTask.steps.length; i++) {
                const step = currentTask.steps[i];
                set((s) => ({
                    currentTask: s.currentTask ? {
                        ...s.currentTask,
                        steps: s.currentTask.steps.map((st, idx) => idx === i ? { ...st, status: 'executing' as const } : st),
                    } : null,
                }));

                const result = await mockExecuteStep(step);

                set((s) => ({
                    currentTask: s.currentTask ? {
                        ...s.currentTask,
                        steps: s.currentTask.steps.map((st, idx) => idx === i ? { ...st, status: 'completed' as const, result } : st),
                    } : null,
                }));
            }

            set((s) => ({
                currentTask: s.currentTask ? { ...s.currentTask, status: 'completed', completedAt: Date.now() } : null,
            }));
        }
    },

    approveStep: async (stepId: string) => {
        const { currentTask } = get();
        if (!currentTask) return;

        // Mark step as approved, then execute
        set((s) => ({
            currentTask: s.currentTask ? {
                ...s.currentTask,
                steps: s.currentTask.steps.map((st) => st.id === stepId ? { ...st, status: 'executing' as const } : st),
            } : null,
        }));

        const step = currentTask.steps.find((s) => s.id === stepId);
        if (!step) return;

        const result = await mockExecuteStep(step);

        set((s) => {
            if (!s.currentTask) return s;
            const updatedSteps = s.currentTask.steps.map((st) =>
                st.id === stepId ? { ...st, status: 'completed' as const, result } : st
            );
            const allDone = updatedSteps.every((st) => st.status === 'completed' || st.status === 'rejected');
            const hasMorePending = updatedSteps.some((st) => st.status === 'pending');

            return {
                currentTask: {
                    ...s.currentTask,
                    steps: updatedSteps,
                    status: allDone ? 'completed' : hasMorePending ? 'awaiting_approval' : 'executing',
                    completedAt: allDone ? Date.now() : undefined,
                },
            };
        });

        // Auto-execute the next non-approval steps
        const updatedTask = get().currentTask;
        if (!updatedTask || updatedTask.status === 'completed') return;

        for (const nextStep of updatedTask.steps) {
            if (nextStep.status === 'pending' && !nextStep.requiresApproval) {
                set((s) => ({
                    currentTask: s.currentTask ? {
                        ...s.currentTask,
                        steps: s.currentTask.steps.map((st) => st.id === nextStep.id ? { ...st, status: 'executing' as const } : st),
                    } : null,
                }));

                const nextResult = await mockExecuteStep(nextStep);

                set((s) => ({
                    currentTask: s.currentTask ? {
                        ...s.currentTask,
                        steps: s.currentTask.steps.map((st) => st.id === nextStep.id ? { ...st, status: 'completed' as const, result: nextResult } : st),
                    } : null,
                }));
            } else if (nextStep.status === 'pending' && nextStep.requiresApproval) {
                // Stop and wait for next approval
                break;
            }
        }

        // Check if all done after auto-executing
        const finalTask = get().currentTask;
        if (finalTask && finalTask.steps.every((st) => st.status === 'completed' || st.status === 'rejected')) {
            set((s) => ({
                currentTask: s.currentTask ? { ...s.currentTask, status: 'completed', completedAt: Date.now() } : null,
            }));
        }
    },

    rejectStep: (stepId: string) => {
        set((s) => ({
            currentTask: s.currentTask ? {
                ...s.currentTask,
                steps: s.currentTask.steps.map((st) => st.id === stepId ? { ...st, status: 'rejected' as const } : st),
            } : null,
        }));
    },

    approveAll: async () => {
        const { currentTask, approveStep } = get();
        if (!currentTask) return;

        const pendingSteps = currentTask.steps.filter((s) => s.status === 'pending' && s.requiresApproval);
        for (const step of pendingSteps) {
            await approveStep(step.id);
        }
    },

    cancelTask: () => {
        set((s) => ({
            currentTask: s.currentTask ? { ...s.currentTask, status: 'cancelled' } : null,
            taskHistory: s.currentTask ? [...s.taskHistory, { ...s.currentTask, status: 'cancelled' as const }] : s.taskHistory,
        }));
    },
}));
