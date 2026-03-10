// In-Memory Vector Store
// Simulates a vector database (like LanceDB) for page-level notes and semantic search.
// In production, this would be backed by LanceDB or ChromaDB for persistent storage.

export interface VectorEntry {
    id: string;
    url: string;
    title: string;
    content: string;
    note: string;
    tags: string[];
    embedding: number[]; // Simplified: we'll use keyword-based similarity
    createdAt: number;
    updatedAt: number;
}

export interface SearchResult {
    entry: VectorEntry;
    score: number;
}

export interface IVectorStore {
    addNote(url: string, title: string, content: string, note: string, tags?: string[]): string;
    updateNote(id: string, note: string, tags?: string[]): void;
    deleteNote(id: string): void;
    getNotesForUrl(url: string): VectorEntry[];
    getAllNotes(): VectorEntry[];
    search(query: string, limit?: number): SearchResult[];
}

// Simple text similarity — counts matching words
function textSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 2));
    const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 2));
    let matches = 0;
    for (const w of words1) {
        if (words2.has(w)) matches++;
    }
    return words1.size > 0 ? matches / words1.size : 0;
}

export class InMemoryVectorStore implements IVectorStore {
    private entries: Map<string, VectorEntry> = new Map();
    private counter = 0;

    addNote(url: string, title: string, content: string, note: string, tags: string[] = []): string {
        const id = `note-${++this.counter}-${Date.now()}`;
        const entry: VectorEntry = {
            id,
            url,
            title,
            content: content.slice(0, 500), // Limit stored content
            note,
            tags,
            embedding: [], // Would be a real embedding vector in production
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        this.entries.set(id, entry);
        return id;
    }

    updateNote(id: string, note: string, tags?: string[]): void {
        const entry = this.entries.get(id);
        if (entry) {
            entry.note = note;
            if (tags) entry.tags = tags;
            entry.updatedAt = Date.now();
        }
    }

    deleteNote(id: string): void {
        this.entries.delete(id);
    }

    getNotesForUrl(url: string): VectorEntry[] {
        return Array.from(this.entries.values())
            .filter((e) => e.url === url)
            .sort((a, b) => b.updatedAt - a.updatedAt);
    }

    getAllNotes(): VectorEntry[] {
        return Array.from(this.entries.values())
            .sort((a, b) => b.updatedAt - a.updatedAt);
    }

    search(query: string, limit = 10): SearchResult[] {
        const results: SearchResult[] = [];
        for (const entry of this.entries.values()) {
            const textScore = textSimilarity(query, `${entry.note} ${entry.title} ${entry.tags.join(' ')}`);
            if (textScore > 0) {
                results.push({ entry, score: textScore });
            }
        }
        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
}
