// Memory & Security Zustand Store
// Manages page notes (vector store) and permission system state.

import { create } from 'zustand';

export interface PageNote {
    id: string;
    url: string;
    title: string;
    note: string;
    tags: string[];
    createdAt: number;
    updatedAt: number;
}

export type PermissionScope =
    | 'browsing_history' | 'bookmarks' | 'downloads' | 'cookies'
    | 'geolocation' | 'camera' | 'microphone' | 'notifications'
    | 'clipboard' | 'storage' | 'tabs' | 'active_tab'
    | 'web_navigation' | 'dom_access' | 'form_submit' | 'network_requests';

export type PermissionLevel = 'granted' | 'denied' | 'prompt';

export interface Permission {
    scope: PermissionScope;
    level: PermissionLevel;
    grantedAt?: number;
}

const PERMISSION_LABELS: Record<PermissionScope, { label: string; icon: string; description: string }> = {
    browsing_history: { label: 'Browsing History', icon: 'history', description: 'Access your browsing history' },
    bookmarks: { label: 'Bookmarks', icon: 'bookmark', description: 'Read and modify bookmarks' },
    downloads: { label: 'Downloads', icon: 'download', description: 'Manage downloaded files' },
    cookies: { label: 'Cookies', icon: 'cookie', description: 'Read and write cookies' },
    geolocation: { label: 'Location', icon: 'location_on', description: 'Access your location' },
    camera: { label: 'Camera', icon: 'videocam', description: 'Use your camera' },
    microphone: { label: 'Microphone', icon: 'mic', description: 'Use your microphone' },
    notifications: { label: 'Notifications', icon: 'notifications', description: 'Show notifications' },
    clipboard: { label: 'Clipboard', icon: 'content_paste', description: 'Read and write clipboard' },
    storage: { label: 'Local Storage', icon: 'storage', description: 'Access local storage' },
    tabs: { label: 'Tabs', icon: 'tab', description: 'Access open tabs info' },
    active_tab: { label: 'Active Tab', icon: 'tab_active', description: 'Access active tab content' },
    web_navigation: { label: 'Navigation', icon: 'explore', description: 'Monitor page navigation' },
    dom_access: { label: 'DOM Access', icon: 'code', description: 'Read and modify page DOM' },
    form_submit: { label: 'Form Submit', icon: 'send', description: 'Submit forms on pages' },
    network_requests: { label: 'Network', icon: 'wifi', description: 'Monitor network requests' },
};

export { PERMISSION_LABELS };

interface MemorySecurityStore {
    // Notes state
    notes: PageNote[];
    isNotePanelOpen: boolean;

    // Permissions state
    permissions: Permission[];

    // Notes actions
    addNote: (url: string, title: string, note: string, tags?: string[]) => void;
    updateNote: (id: string, note: string, tags?: string[]) => void;
    deleteNote: (id: string) => void;
    getNotesForUrl: (url: string) => PageNote[];
    toggleNotePanel: () => void;

    // Permissions actions
    setPermission: (scope: PermissionScope, level: PermissionLevel) => void;
    resetPermissions: () => void;
    getPermission: (scope: PermissionScope) => PermissionLevel;
}

let noteCounter = 0;

// Default permissions — most start as 'prompt'
const DEFAULT_PERMISSIONS: Permission[] = [
    { scope: 'browsing_history', level: 'granted' },
    { scope: 'bookmarks', level: 'granted' },
    { scope: 'downloads', level: 'granted' },
    { scope: 'tabs', level: 'granted' },
    { scope: 'active_tab', level: 'granted' },
    { scope: 'storage', level: 'granted' },
    { scope: 'cookies', level: 'prompt' },
    { scope: 'geolocation', level: 'prompt' },
    { scope: 'camera', level: 'prompt' },
    { scope: 'microphone', level: 'prompt' },
    { scope: 'notifications', level: 'prompt' },
    { scope: 'clipboard', level: 'prompt' },
    { scope: 'web_navigation', level: 'granted' },
    { scope: 'dom_access', level: 'prompt' },
    { scope: 'form_submit', level: 'denied' },
    { scope: 'network_requests', level: 'prompt' },
];

export const useMemorySecurityStore = create<MemorySecurityStore>((set, get) => ({
    notes: [],
    isNotePanelOpen: false,
    permissions: DEFAULT_PERMISSIONS,

    addNote: (url, title, note, tags = []) => {
        const newNote: PageNote = {
            id: `note-${++noteCounter}-${Date.now()}`,
            url,
            title,
            note,
            tags,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        set((s) => ({ notes: [newNote, ...s.notes] }));
    },

    updateNote: (id, note, tags) => {
        set((s) => ({
            notes: s.notes.map((n) =>
                n.id === id ? { ...n, note, tags: tags || n.tags, updatedAt: Date.now() } : n
            ),
        }));
    },

    deleteNote: (id) => {
        set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));
    },

    getNotesForUrl: (url) => {
        return get().notes.filter((n) => n.url === url);
    },

    toggleNotePanel: () => {
        set((s) => ({ isNotePanelOpen: !s.isNotePanelOpen }));
    },

    setPermission: (scope, level) => {
        set((s) => ({
            permissions: s.permissions.map((p) =>
                p.scope === scope ? { ...p, level, grantedAt: Date.now() } : p
            ),
        }));
    },

    resetPermissions: () => {
        set({ permissions: DEFAULT_PERMISSIONS });
    },

    getPermission: (scope) => {
        const perm = get().permissions.find((p) => p.scope === scope);
        return perm?.level || 'prompt';
    },
}));
