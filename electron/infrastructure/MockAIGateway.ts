// Mock AI Gateway — provides simulated AI responses for development.
// In production, this would be replaced with a real LLM provider adapter.

import { IAIGateway, ChatMessage, AISummary } from '../domain/interfaces/IAIGateway';

export class MockAIGateway implements IAIGateway {
    async summarizePage(pageContent: string, url: string): Promise<AISummary> {
        // Simulate processing delay
        await new Promise((r) => setTimeout(r, 1500));

        const wordCount = pageContent.split(/\s+/).length;
        const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

        return {
            title: `Summary of ${new URL(url).hostname}`,
            keyPoints: [
                'This page contains information about the requested topic.',
                'Key sections cover the main concepts and their applications.',
                `The page has approximately ${wordCount} words of content.`,
                'Related links and resources are provided for further reading.',
            ],
            sentiment: 'neutral',
            readingTime,
        };
    }

    async chatAboutPage(
        _pageContent: string,
        url: string,
        messages: ChatMessage[],
        userQuery: string
    ): Promise<string> {
        await new Promise((r) => setTimeout(r, 1000));

        const responses = [
            `Based on the content from ${new URL(url).hostname}, ${userQuery.toLowerCase().includes('what') ? 'the page discusses several key topics related to your question.' : 'I can help you understand the content better.'}`,
            `Looking at the page, I can see relevant information about "${userQuery}". The content provides detailed insights on this topic.`,
            `The page from ${new URL(url).hostname} contains useful context for your question. Let me break down the key points...`,
        ];

        return responses[messages.length % responses.length];
    }

    async chat(_messages: ChatMessage[], userQuery: string): Promise<string> {
        await new Promise((r) => setTimeout(r, 800));

        if (userQuery.toLowerCase().includes('hello') || userQuery.toLowerCase().includes('hi')) {
            return "Hello! I'm Dive AI, your browsing assistant. I can help you summarize pages, answer questions about content you're viewing, and enhance your searches. What would you like to do?";
        }

        if (userQuery.toLowerCase().includes('help')) {
            return "Here's what I can do:\n\n• **Summarize** — Get a quick overview of any page\n• **Chat** — Ask questions about the current page\n• **Search** — I'll help refine your search queries\n• **Explain** — Break down complex content\n\nJust ask away!";
        }

        return `That's an interesting question about "${userQuery}". In a full implementation, I'd connect to an LLM provider (like OpenAI, Anthropic, or a local model) to give you a detailed answer. For now, this is a simulated response from the Dive AI mock gateway.`;
    }

    async enhanceSearchQuery(query: string): Promise<string> {
        await new Promise((r) => setTimeout(r, 300));
        return query; // Pass through in mock mode
    }
}
