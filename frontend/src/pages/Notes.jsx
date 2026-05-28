import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus, FileText, Trash2, Edit3, MoreVertical, Save, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch notes from backend
  useEffect(() => {
    const initNotes = async () => {
      let currentNotes = [];
      try {
        const response = await fetch('/api/notes', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          currentNotes = data;
          setNotes(data);
          if (data.length > 0) setActiveNote(data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      }

      // Check if redirected from dashboard with createNew note request
      if (location.state?.createNew) {
        // Clear history state to avoid duplication
        navigate(location.pathname, { replace: true, state: {} });
        await createNote(currentNotes);
      }
    };

    initNotes();
  }, []);

  const createNote = async (existingNotes) => {
    const newNote = {
      title: 'New Note',
      content: 'Start typing...',
      tags: ['General']
    };

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newNote)
      });
      const data = await response.json();
      setNotes(prevNotes => [data, ...(existingNotes || prevNotes)]);
      setActiveNote(data);
      setIsEditing(true);
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  const updateNote = async () => {
    try {
      const response = await fetch(`/api/notes/${activeNote._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(activeNote)
      });
      const data = await response.json();
      setNotes(notes.map(n => n._id === data._id ? data : n));
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update note:', err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const filteredNotes = notes.filter(n => n._id !== id);
      setNotes(filteredNotes);
      if (activeNote?._id === id) {
        setActiveNote(filteredNotes.length > 0 ? filteredNotes[0] : null);
      }
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const filteredNotes = notes.filter(note => 
    note?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note?.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6 p-6 animate-fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            Study Repository
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Organize your thoughts and academic research</p>
        </div>
        <button 
          onClick={createNote}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <Plus size={18} /> New Note
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden min-h-[600px]">
        {/* Sidebar - Note List */}
        <div className="lg:col-span-1 flex flex-col gap-6 bg-white dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search your notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map(note => (
                <motion.div 
                  layout
                  key={note._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => { setActiveNote(note); setIsEditing(false); }}
                  className={`group p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                    activeNote?._id === note._id 
                      ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-500/50 shadow-md shadow-amber-500/5' 
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-900/30 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-bold text-sm truncate pr-2 ${activeNote?._id === note._id ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'}`}>
                      {note.title}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {note.content}
                  </p>
                  {activeNote?._id === note._id && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" 
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden shadow-xl">
          {activeNote ? (
            <>
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/20 text-amber-600 rounded-2xl shadow-inner">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <input 
                        className="w-full bg-transparent border-none outline-none text-xl font-bold text-slate-800 dark:text-white"
                        value={activeNote.title}
                        autoFocus
                        onChange={(e) => setActiveNote({...activeNote, title: e.target.value})}
                      />
                    ) : (
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white truncate">{activeNote.title}</h2>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <Tag size={12} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeNote.tags?.join(', ') || 'General'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {isEditing ? (
                    <button 
                      onClick={updateNote}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <Save size={16} /> Save Changes
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-500 dark:text-slate-400 transition-colors"
                    >
                      <Edit3 size={20} />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNote(activeNote._id)}
                    className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button className="p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-400 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-8 overflow-y-auto">
                <textarea 
                  readOnly={!isEditing}
                  className={`w-full h-full bg-transparent border-none outline-none resize-none text-slate-700 dark:text-slate-300 leading-loose font-serif text-lg ${!isEditing ? 'cursor-default' : 'cursor-text'}`}
                  value={activeNote.content}
                  onChange={(e) => setActiveNote({...activeNote, content: e.target.value})}
                  placeholder="The knowledge starts here..."
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-6">
                <FileText size={48} className="opacity-20" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Note Selected</h3>
              <p className="max-w-xs text-sm leading-relaxed">Select a note from the sidebar or create a new one to begin your study session.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
