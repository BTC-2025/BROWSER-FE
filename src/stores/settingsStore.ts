import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type SearchEngine = 'google' | 'bing' | 'duckduckgo' | 'perplexity' | 'brave';
export type NewTabBackground = 'aurora' | 'glass' | 'space' | 'nature' | 'minimal';

interface SettingsState {
    themeMode: 'light' | 'dark' | 'system';
    accentColor: string;
    density: number;
    glassmorphism: boolean;
    animations: boolean;
    searchEngine: SearchEngine;
    newTabBackground: NewTabBackground;

    // Actions
    setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
    setAccentColor: (color: string) => void;
    setDensity: (density: number) => void;
    setGlassmorphism: (enabled: boolean) => void;
    setAnimations: (enabled: boolean) => void;
    setSearchEngine: (engine: SearchEngine) => void;
    setNewTabBackground: (bg: NewTabBackground) => void;
    resetToDefaults: () => void;
}

const initialState = {
    themeMode: 'dark' as const,
    accentColor: '#135bec', // Neon Blue
    density: 2,
    glassmorphism: true,
    animations: true,
    searchEngine: 'google' as const,
    newTabBackground: 'aurora' as const,
};

export const searchEngineUrls: Record<SearchEngine, string> = {
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    perplexity: 'https://www.perplexity.ai/search?q=',
    brave: 'https://search.brave.com/search?q=',
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            ...initialState,
            setThemeMode: (themeMode) => set({ themeMode }),
            setAccentColor: (accentColor) => set({ accentColor }),
            setDensity: (density) => set({ density }),
            setGlassmorphism: (glassmorphism) => set({ glassmorphism }),
            setAnimations: (animations) => set({ animations }),
            setSearchEngine: (searchEngine) => set({ searchEngine }),
            setNewTabBackground: (newTabBackground) => set({ newTabBackground }),
            resetToDefaults: () => set(initialState),
        }),
        {
            name: 'nexus-settings-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
