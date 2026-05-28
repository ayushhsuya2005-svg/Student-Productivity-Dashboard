import { useState, useEffect } from 'react';
import { Plus, AlertCircle, CheckCircle2, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AttendanceTracker() {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('dashboard_attendance');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse attendance:', e);
      }
    }
    return [
      { id: 1, name: 'Data Structures', present: 22, total: 25 },
      { id: 2, name: 'Operating Systems', present: 18, total: 24 },
      { id: 3, name: 'Database Systems', present: 15, total: 21 },
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    present: 0,
    total: 0
  });

  useEffect(() => {
    localStorage.setItem('dashboard_attendance', JSON.stringify(subjects));
  }, [subjects]);

  const updateAttendance = (id, type) => {
    setSubjects(subjects.map(sub => {
      if (sub.id === id) {
        if (type === 'present') return { ...sub, present: sub.present + 1, total: sub.total + 1 };
        if (type === 'absent') return { ...sub, total: sub.total + 1 };
      }
      return sub;
    }));
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(sub => sub.id !== id));
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubject.name.trim()) return;

    const presentCount = parseInt(newSubject.present) || 0;
    const totalCount = parseInt(newSubject.total) || 0;

    const newSub = {
      id: Date.now(),
      name: newSubject.name.trim(),
      present: Math.min(presentCount, totalCount),
      total: totalCount
    };

    setSubjects([...subjects, newSub]);
    setIsAdding(false);
    setNewSubject({ name: '', present: 0, total: 0 });
  };

  const calculatePercentage = (present, total) => {
    return total === 0 ? 0 : Math.round((present / total) * 100);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 75) return 'text-green-500';
    if (percentage >= 65) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Attendance Tracker</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors font-semibold"
        >
          <Plus size={14} /> Add Subject
        </button>
      </div>

      <div className="space-y-6">
        {subjects.map((sub) => {
          const percentage = calculatePercentage(sub.present, sub.total);
          const statusColor = getStatusColor(percentage);

          return (
            <div key={sub.id} className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 transition-all hover:border-primary-500/50 relative group/card">
              <button
                onClick={() => deleteSubject(sub.id)}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all opacity-0 group-hover/card:opacity-100 focus:opacity-100"
                title="Remove Subject"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pr-6">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">{sub.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Present: <span className="font-medium text-slate-700 dark:text-slate-300">{sub.present}</span> / Total: {sub.total}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`text-2xl font-bold ${statusColor}`}>
                    {percentage}%
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateAttendance(sub.id, 'present')}
                      className="p-2 bg-green-500/10 text-green-600 hover:bg-green-500/20 rounded-lg transition-colors"
                      title="Mark Present"
                    >
                      <CheckCircle2 size={20} />
                    </button>
                    <button 
                      onClick={() => updateAttendance(sub.id, 'absent')}
                      className="p-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Mark Absent"
                    >
                      <AlertCircle size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${percentage >= 75 ? 'bg-green-500' : percentage >= 65 ? 'bg-orange-500' : 'bg-red-500'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              {percentage < 75 && (
                <p className="text-[10px] text-orange-500 mt-2 flex items-center gap-1">
                  <AlertCircle size={10} /> You need to attend more classes to reach 75%.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Subject Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold">Add Subject</h3>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleAddSubject} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subject Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Artificial Intelligence"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500 outline-none"
                    value={newSubject.name}
                    onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Present Classes</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                      value={newSubject.present}
                      onChange={e => setNewSubject({...newSubject, present: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Total Classes</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                      value={newSubject.total}
                      onChange={e => setNewSubject({...newSubject, total: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-colors"
                  >
                    Add Subject
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
