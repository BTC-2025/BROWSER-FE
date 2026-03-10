// AI Gateway Service Types
// Abstractions for the AI Copilot — wraps LLM providers behind a unified interface.

export interface ChatMessage {
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

export interface AIProvider {
    name: string;
    model: string;
    apiKey?: string;
}

export interface IAIGateway {
    // Summarize a web page from its extracted text
    summarizePage(pageContent: string, url: string): Promise<AISummary>;

    // Chat about a web page with context
    chatAboutPage(
        pageContent: string,
        url: string,
        messages: ChatMessage[],
        userQuery: string
    ): Promise<string>;

    // General assistant chat (not page-specific)
    chat(messages: ChatMessage[], userQuery: string): Promise<string>;

    // Smart search enhancement — rewrite query for better results
    enhanceSearchQuery(query: string): Promise<string>;
}
