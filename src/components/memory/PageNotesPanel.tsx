'use client';

import React, { useState } from 'react';
import { useMemorySecurityStore, PageNote } from '@/stores/memorySecurityStore';
import { useBrowserStore } from '@/stores/browserStore';

function NoteCard({ note, onDelete }: { note: PageNote; onDelete: () => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(note.note);
    const updateNote = useMemorySecurityStore((s) => s.updateNote);

    const handleSave = () => {
        updateNote(note.id, editText);
        setIsEditing(false);
    };

    const timeAgo = (ts: number) => {
        const diff = Date.now() - ts;
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    return (
        <div className="rounded-xl border border-[#A6C8FF]/30 bg-[#F4F8FF] hover:bg-[#E9F4FF] transition-all group">
            <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="size-6 rounded bg-[#004AAD]/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[#004AAD] text-[14px]">description</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#0A1F44] truncate">{note.title}</p>
                            <p className="text-[10px] text-[#8FA9C9] truncate">{note.url}</p>
                        </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="p-1 rounded text-[#8FA9C9] hover:text-[#0A1F44] hover:bg-[#DDEEFF]/50"
                        >
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-1 rounded text-[#8FA9C9] hover:text-red-400 hover:bg-red-500/10"
                        >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                    </div>
                </div>

                {/* Note Content */}
                {isEditing ? (
                    <div className="mt-3 space-y-2">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-[#F4F8FF] border border-[#A6C8FF]/50 rounded-lg p-2 text-xs text-[#0A1F44] resize-none focus:outline-none focus:border-[#004AAD]/30"
                            rows={3}
                        />
                        <div className="flex gap-2">
                            <button onClick={handleSave} className="px-2 py-1 bg-[#004AAD] text-[#0A1F44] text-[10px] rounded-md">Save</button>
                            <button onClick={() => setIsEditing(false)} className="px-2 py-1 text-[#5F7FA6] text-[10px] rounded-md hover:bg-[#DDEEFF]/50">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <p className="mt-2 text-xs text-[#0A1F44] leading-relaxed">{note.note}</p>
                )}

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-1.5 flex-wrap">
                        {note.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-[#004AAD]/10 text-[#004AAD] text-[9px] font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <span className="text-[9px] text-slate-600">{timeAgo(note.updatedAt)}</span>
                </div>
            </div>
        </div>
    );
}

export default function PageNotesPanel() {
    const { notes, isNotePanelOpen, toggleNotePanel, addNote, deleteNote } = useMemorySecurityStore();
    const [newNote, setNewNote] = useState('');
    const [newTags, setNewTags] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    
    // Get active tab details from browser store
    const { tabs, activeTabId } = useBrowserStore();
    const activeTab = tabs.find((t) => t.id === activeTabId);
    const pageUrl = activeTab?.url || '';
    const pageTitle = activeTab?.title || 'Page Note';

    const filteredNotes = searchQuery
        ? notes.filter((n) =>
            n.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : notes;

    const handleAdd = () => {
        if (!newNote.trim()) return;
        const tags = newTags.split(',').map((t) => t.trim()).filter(Boolean);
        addNote(pageUrl, pageTitle, newNote.trim(), tags);
        setNewNote('');
        setNewTags('');
        setShowAddForm(false);
    };

    return (
        <div
            className="flex flex-col h-full border-l border-[#A6C8FF]/30 shadow-2xl shadow-[#A6C8FF]/20 animate-fadeIn"
            style={{ width: 'clamp(260px, 28vw, 380px)', background: 'rgba(255, 255, 255, 0.97)', backdropFilter: 'blur(20px)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#A6C8FF]/30">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                        <span className="material-symbols-outlined text-[#0A1F44] text-[18px]">sticky_note_2</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[#0A1F44]">Page Notes</h3>
                        <p className="text-[10px] text-[#8FA9C9]">{notes.length} notes saved</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="p-1.5 rounded-lg text-[#5F7FA6] hover:text-[#0A1F44] hover:bg-[#DDEEFF]/50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                    <button
                        onClick={toggleNotePanel}
                        className="p-1.5 rounded-lg text-[#5F7FA6] hover:text-[#0A1F44] hover:bg-[#DDEEFF]/50 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-[#A6C8FF]/30">
                <div className="flex items-center gap-2 bg-[#DDEEFF]/50 border border-[#A6C8FF]/30 rounded-lg px-3 py-2">
                    <span className="material-symbols-outlined text-[#8FA9C9] text-[16px]">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search notes..."
                        className="flex-1 bg-transparent border-none text-xs text-[#0A1F44] placeholder-slate-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Add Note Form */}
            {showAddForm && (
                <div className="p-3 border-b border-[#A6C8FF]/30 space-y-2 animate-fadeIn">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write a note about the current page..."
                        className="w-full bg-[#DDEEFF]/50 border border-[#A6C8FF]/30 rounded-lg p-3 text-xs text-[#0A1F44] placeholder-slate-500 resize-none focus:outline-none focus:border-violet-500/30"
                        rows={3}
                    />
                    <input
                        type="text"
                        value={newTags}
                        onChange={(e) => setNewTags(e.target.value)}
                        placeholder="Tags (comma separated)"
                        className="w-full bg-[#DDEEFF]/50 border border-[#A6C8FF]/30 rounded-lg px-3 py-2 text-xs text-[#0A1F44] placeholder-slate-500 focus:outline-none focus:border-violet-500/30"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={!newNote.trim()}
                        className="w-full py-2 bg-violet-500 hover:bg-violet-600 text-[#0A1F44] text-xs font-semibold rounded-lg transition-colors disabled:opacity-30"
                    >
                        Save Note
                    </button>
                </div>
            )}

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredNotes.length === 0 && (
                    <div className="flex flex-col items-center gap-3 py-12 text-center">
                        <span className="material-symbols-outlined text-slate-600 text-[32px]">note_stack</span>
                        <p className="text-xs text-[#8FA9C9]">
                            {searchQuery ? 'No matching notes' : 'No notes yet. Click + to add one.'}
                        </p>
                    </div>
                )}
                {filteredNotes.map((note) => (
                    <NoteCard key={note.id} note={note} onDelete={() => deleteNote(note.id)} />
                ))}
            </div>
        </div>
    );
}

