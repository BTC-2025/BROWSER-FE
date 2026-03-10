// Agent Runtime Types & Interfaces
// Defines the agent execution model, tool capabilities, and permission system.

export type ToolCategory = 'navigation' | 'extraction' | 'interaction' | 'mutation';

export interface AgentTool {
    name: string;
    description: string;
    category: ToolCategory;
    requiresApproval: boolean;
    parameters: ToolParameter[];
    execute: (params: Record<string, unknown>) => Promise<ToolResult>;
}

export interface ToolParameter {
    name: string;
    type: 'string' | 'number' | 'boolean';
    description: string;
    required: boolean;
}

export interface ToolResult {
    success: boolean;
    data?: unknown;
    error?: string;
    screenshot?: string; // base64 screenshot after action
}

export interface AgentStep {
    id: string;
    toolName: string;
    params: Record<string, unknown>;
    reasoning: string;
    status: 'pending' | 'approved' | 'rejected' | 'executing' | 'completed' | 'failed';
    result?: ToolResult;
    timestamp: number;
}

export interface AgentTask {
    id: string;
    objective: string;
    steps: AgentStep[];
    status: 'planning' | 'awaiting_approval' | 'executing' | 'completed' | 'failed' | 'cancelled';
    createdAt: number;
    completedAt?: number;
}

export interface IAgentRuntime {
    // Plan a sequence of steps to achieve the objective
    plan(objective: string): Promise<AgentStep[]>;

    // Execute a single approved step
    executeStep(step: AgentStep): Promise<ToolResult>;

    // Get available tools
    getTools(): AgentTool[];
}
