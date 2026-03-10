'use client';

import React, { useState } from 'react';
import { useMemorySecurityStore, PageNote } from '@/stores/memorySecurityStore';

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
        <div className="rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
            <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="size-6 rounded bg-[#135bec]/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[#135bec] text-[14px]">description</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{note.title}</p>
                            <p className="text-[10px] text-slate-500 truncate">{note.url}</p>
                        </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="p-1 rounded text-slate-500 hover:text-white hover:bg-white/5"
                        >
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10"
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
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-white resize-none focus:outline-none focus:border-[#135bec]/30"
                            rows={3}
                        />
                        <div className="flex gap-2">
                            <button onClick={handleSave} className="px-2 py-1 bg-[#135bec] text-white text-[10px] rounded-md">Save</button>
                            <button onClick={() => setIsEditing(false)} className="px-2 py-1 text-slate-400 text-[10px] rounded-md hover:bg-white/5">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">{note.note}</p>
                )}

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-1.5 flex-wrap">
                        {note.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-[#135bec]/10 text-[#135bec] text-[9px] font-medium">
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

    if (!isNotePanelOpen) return null;

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
        addNote(window.location.href, document.title || 'Page Note', newNote.trim(), tags);
        setNewNote('');
        setNewTags('');
        setShowAddForm(false);
    };

    return (
        <div
            className="flex flex-col h-full border-l border-white/5 shadow-2xl shadow-black/40 z-40 animate-fadeIn"
            style={{ width: '360px', background: 'rgba(15, 17, 21, 0.95)', backdropFilter: 'blur(20px)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                        <span className="material-symbols-outlined text-white text-[18px]">sticky_note_2</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Page Notes</h3>
                        <p className="text-[10px] text-slate-500">{notes.length} notes saved</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                    <button
                        onClick={toggleNotePanel}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-white/5">
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-lg px-3 py-2">
                    <span className="material-symbols-outlined text-slate-500 text-[16px]">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search notes..."
                        className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Add Note Form */}
            {showAddForm && (
                <div className="p-3 border-b border-white/5 space-y-2 animate-fadeIn">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write a note about the current page..."
                        className="w-full bg-white/5 border border-white/5 rounded-lg p-3 text-xs text-white placeholder-slate-500 resize-none focus:outline-none focus:border-violet-500/30"
                        rows={3}
                    />
                    <input
                        type="text"
                        value={newTags}
                        onChange={(e) => setNewTags(e.target.value)}
                        placeholder="Tags (comma separated)"
                        className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/30"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={!newNote.trim()}
                        className="w-full py-2 bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-30"
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
                        <p className="text-xs text-slate-500">
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
