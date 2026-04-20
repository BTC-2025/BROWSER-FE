// AI Copilot Zustand Store
// Manages AI side panel state, chat messages, and summaries.
// Uses Google Gemini API via Next.js API route (/api/ai)

import { create } from 'zustand';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}

export interface AISummary {
    title: string;
    keyPoints: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    readingTime: string;
}

interface AICopilotStore {
    // Panel state
    isOpen: boolean;
    activeMode: 'chat' | 'summary' | null;

    // Chat state
    messages: ChatMessage[];
    isLoading: boolean;
    currentPageUrl: string | null;

    // Summary state
    summary: AISummary | null;
    isSummarizing: boolean;

    // Actions
    openPanel: (mode: 'chat' | 'summary') => void;
    closePanel: () => void;
    togglePanel: () => void;
    setMode: (mode: 'chat' | 'summary') => void;

    sendMessage: (content: string) => Promise<void>;
    summarizePage: () => Promise<void>;
    clearChat: () => void;
    setCurrentPageUrl: (url: string | null) => void;
}

// Call the Gemini API route for chat
async function callGeminiChat(userQuery: string): Promise<string> {
    try {
        const res = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'chat', message: userQuery }),
        });

        const data = await res.json();

        if (!res.ok) {
            // Fallback to mock if API key not configured
            return fallbackChat(userQuery, data.error);
        }

        return data.response;
    } catch {
        return fallbackChat(userQuery, 'Network error');
    }
}

// Call the Gemini API route for summarization
async function callGeminiSummarize(): Promise<AISummary> {
    try {
        // Get the page content from the document body
        const pageContent = document.body?.innerText?.slice(0, 8000) || 'No content available';

        const res = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'summarize', content: pageContent }),
        });

        const data = await res.json();

        if (!res.ok) {
            return fallbackSummarize();
        }

        // Parse the Gemini response into our AISummary format
        const responseText = data.response as string;
        const lines = responseText.split('\n').filter((l: string) => l.trim());
        const bullets = lines
            .filter((l: string) => l.trim().startsWith('•') || l.trim().startsWith('-') || l.trim().startsWith('*'))
            .map((l: string) => l.replace(/^[•\-*]\s*/, '').trim())
            .slice(0, 6);

        return {
            title: 'AI Summary',
            keyPoints: bullets.length > 0 ? bullets : [responseText.slice(0, 200)],
            sentiment: 'neutral',
            readingTime: `${Math.ceil(pageContent.length / 1500)} min`,
        };
    } catch {
        return fallbackSummarize();
    }
}

// Fallback mock responses when API key isn't configured
function fallbackChat(userQuery: string, error?: string): string {
    if (error?.includes('not configured')) {
        return `⚠️ **API Key Not Configured**\n\nTo enable AI-powered responses, add your Google API key to the \`.env\` file:\n\n\`\`\`\nGOOGLE_API_KEY=your_key_here\n\`\`\`\n\nGet a free key at [Google AI Studio](https://aistudio.google.com/apikey).\n\nOnce configured, I'll be powered by **Gemini 2.0 Flash** for intelligent chat and page summarization!`;
    }

    if (userQuery.toLowerCase().includes('hello') || userQuery.toLowerCase().includes('hi')) {
        return "Hello! 👋 I'm **Dive AI**, your intelligent browsing companion. I can:\n\n• 📝 **Summarize** any web page\n• 💬 **Chat** about content you're viewing\n• 🔍 **Enhance** your search queries\n• 🧠 **Explain** complex topics\n\nHow can I help you today?";
    }

    return `I'd love to help with "${userQuery}"! To get full AI-powered responses, add your Google API key to the \`.env\` file. Once configured, I'll use **Gemini 2.0 Flash** to provide intelligent answers.\n\nGet a free key: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)`;
}

function fallbackSummarize(): AISummary {
    return {
        title: 'Page Summary',
        keyPoints: [
            'Configure your Google API key in .env to enable AI-powered summaries.',
            'Get a free key at aistudio.google.com/apikey',
            'Once configured, Dive AI will analyze page content using Gemini 2.0 Flash.',
            'Summaries include key points, reading time, and sentiment analysis.',
        ],
        sentiment: 'neutral',
        readingTime: '—',
    };
}

let messageCounter = 0;

export const useAICopilotStore = create<AICopilotStore>((set, get) => ({
    isOpen: false,
    activeMode: null,
    messages: [],
    isLoading: false,
    currentPageUrl: null,
    summary: null,
    isSummarizing: false,

    openPanel: (mode) => set({ isOpen: true, activeMode: mode }),
    closePanel: () => set({ isOpen: false }),
    togglePanel: () => {
        const { isOpen } = get();
        if (isOpen) {
            set({ isOpen: false });
        } else {
            set({ isOpen: true, activeMode: 'chat' });
        }
    },
    setMode: (mode) => set({ activeMode: mode }),

    sendMessage: async (content: string) => {
        const userMsg: ChatMessage = {
            id: `msg-${++messageCounter}`,
            role: 'user',
            content,
            timestamp: Date.now(),
        };

        set((s) => ({
            messages: [...s.messages, userMsg],
            isLoading: true,
        }));

        try {
            const response = await callGeminiChat(content);
            const assistantMsg: ChatMessage = {
                id: `msg-${++messageCounter}`,
                role: 'assistant',
                content: response,
                timestamp: Date.now(),
            };

            set((s) => ({
                messages: [...s.messages, assistantMsg],
                isLoading: false,
            }));
        } catch {
            set({ isLoading: false });
        }
    },

    summarizePage: async () => {
        set({ isSummarizing: true, summary: null });
        try {
            const summary = await callGeminiSummarize();
            set({ summary, isSummarizing: false });
        } catch {
            set({ isSummarizing: false });
        }
    },

    clearChat: () => set({ messages: [], summary: null }),
    setCurrentPageUrl: (url) => set({ currentPageUrl: url }),
}));
