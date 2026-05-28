import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Circle, Clock, Tag, Trash2, Filter, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', priority: 'Medium', category: 'Academic' });
  const [filter, setFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);

  const priorities = ['Low', 'Medium', 'High'];
  const categories = ['Academic', 'Personal', 'Projects', 'Other'];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: newTask.title,
          priority: newTask.priority,
          category: newTask.category,
          dueDate: new Date().toISOString().split('T')[0]
        })
      });
      if (response.ok) {
        const data = await response.json();
        setTasks([data, ...tasks]);
        setNewTask({ title: '', priority: 'Medium', category: 'Academic' });
        setIsAdding(false);
      }
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const toggleTask = async (id) => {
    const taskToToggle = tasks.find(t => t._id === id || t.id === id);
    if (!taskToToggle) return;
    const newStatus = taskToToggle.status === 'Completed' ? 'Todo' : 'Completed';
    try {
      const response = await fetch(`/api/tasks/${taskToToggle._id || taskToToggle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(tasks.map(t => (t._id === id || t.id === id) ? data : t));
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setTasks(tasks.filter(t => t._id !== id && t.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter || task.category === filter || task.priority === filter;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Tasks & Objectives
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your daily goals and academic milestones</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filter: {filter}
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-2">
              {['All', 'Todo', 'In Progress', 'Completed', ...categories].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Overall Progress</span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
            {Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100) || 0}%
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
          />
        </div>
      </div>

      {/* Task Creation Modal Overlay */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <form onSubmit={addTask} className="p-6">
                <h3 className="text-xl font-bold mb-4">Create New Task</h3>
                <input
                  autoFocus
                  type="text"
                  placeholder="What needs to be done?"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Priority</label>
                    <div className="flex flex-wrap gap-2">
                      {priorities.map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewTask({...newTask, priority: p})}
                          className={twMerge(
                            "px-3 py-1.5 text-xs rounded-lg border transition-all",
                            newTask.priority === p 
                              ? "bg-blue-600 border-blue-600 text-white" 
                              : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                    <select 
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none"
                      value={newTask.category}
                      onChange={e => setNewTask({...newTask, category: e.target.value})}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => (
            <motion.div
              layout
              key={task._id || task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="group bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all hover:border-blue-200 dark:hover:border-blue-900/30"
            >
              <button 
                onClick={() => toggleTask(task._id || task.id)}
                className="text-slate-400 hover:text-blue-500 transition-colors"
              >
                {task.status === 'Completed' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>

              <div className="flex-1">
                <h3 className={clsx(
                  "font-semibold text-slate-800 dark:text-slate-100 transition-all",
                  task.status === 'Completed' && "line-through text-slate-400 dark:text-slate-500"
                )}>
                  {task.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className={twMerge(
                    "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                    task.priority === 'High' ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" :
                    task.priority === 'Medium' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" :
                    "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                  )}>
                    {task.priority}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Tag className="w-3 h-3" />
                    {task.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => deleteTask(task._id || task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">All caught up!</h3>
            <p className="text-slate-500 dark:text-slate-400">No tasks found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
