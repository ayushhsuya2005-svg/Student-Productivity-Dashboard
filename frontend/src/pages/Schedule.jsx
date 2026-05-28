import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const Schedule = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times = Array.from({ length: 13 }, (_, i) => `${i + 8}:00`); // 8 AM to 8 PM

  const [events, setEvents] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'Lecture',
    day: 'Monday',
    start: '09:00',
    end: '10:30',
    location: '',
    color: 'blue'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/schedule', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        // Map database schema fields to frontend fields
        const mapped = data.map(item => ({
          id: item._id,
          title: item.title,
          day: item.dayOfWeek,
          start: item.startTime,
          end: item.endTime,
          type: item.type,
          location: item.location || '',
          color: item.color || 'blue'
        }));
        setEvents(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch schedule events:', err);
    }
  };

  const addEvent = async (newEventData) => {
    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: newEventData.title,
          type: newEventData.type,
          dayOfWeek: newEventData.day,
          startTime: newEventData.start,
          endTime: newEventData.end,
          location: newEventData.location,
          color: newEventData.color
        })
      });
      if (response.ok) {
        fetchEvents(); // Reload all events
        setIsAdding(false);
        setNewEvent({
          title: '',
          type: 'Lecture',
          day: 'Monday',
          start: '09:00',
          end: '10:30',
          location: '',
          color: 'blue'
        });
      }
    } catch (err) {
      console.error('Failed to add schedule event:', err);
    }
  };

  const deleteEvent = async (id) => {
    try {
      const response = await fetch(`/api/schedule/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setEvents(events.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete schedule event:', err);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50',
      emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50',
      amber: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50',
      rose: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/50',
    };
    return colors[color] || colors.blue;
  };

  const getEventStyle = (event) => {
    if (!event || !event.start || !event.end) {
      return { top: '40px', height: '0px' };
    }
    try {
      const startParts = event.start.split(':');
      const endParts = event.end.split(':');
      if (startParts.length < 2 || endParts.length < 2) {
        return { top: '40px', height: '0px' };
      }
      const startHour = parseInt(startParts[0]);
      const startMin = parseInt(startParts[1]);
      const endHour = parseInt(endParts[0]);
      const endMin = parseInt(endParts[1]);
      
      if (isNaN(startHour) || isNaN(startMin) || isNaN(endHour) || isNaN(endMin)) {
        return { top: '40px', height: '0px' };
      }
      
      const startOffset = (startHour - 8) * 80 + (startMin / 60) * 80;
      const duration = ((endHour - startHour) * 60 + (endMin - startMin)) / 60 * 80;
      
      return {
        top: `${startOffset + 40}px`, // 40px for header
        height: `${duration - 4}px`,
      };
    } catch (err) {
      console.error('Failed to parse event time style:', err);
      return { top: '40px', height: '0px' };
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">
            Weekly Timetable
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Visualize your academic schedule and study blocks</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-sm">
            <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-4 flex items-center gap-2 text-sm font-semibold">
              <CalendarIcon className="w-4 h-4 text-violet-500" />
              May 1 - May 7
            </div>
            <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            New Event
          </button>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px] relative">
            {/* Header */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="h-10 border-r border-slate-100 dark:border-slate-800" />
              {days.map(day => (
                <div key={day} className="h-10 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800 last:border-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="relative">
              {times.map((time, i) => (
                <div key={time} className="grid grid-cols-[80px_repeat(7,1fr)] h-20 border-b border-slate-50 dark:border-slate-800/50">
                  <div className="flex justify-center pt-2 text-[10px] font-medium text-slate-400 dark:text-slate-500 border-r border-slate-100 dark:border-slate-800">
                    {time}
                  </div>
                  {days.map((_, j) => (
                    <div key={j} className="border-r border-slate-50 dark:border-slate-800/50 last:border-0" />
                  ))}
                </div>
              ))}

              {/* Events Overlay */}
              {events.map(event => {
                const dayIndex = days.indexOf(event.day);
                if (dayIndex === -1) return null;
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      ...getEventStyle(event),
                      left: `calc(80px + (${dayIndex} * (100% - 80px) / 7) + 4px)`,
                      width: `calc((100% - 80px) / 7 - 8px)`,
                    }}
                    className={twMerge(
                      "absolute rounded-xl p-3 border-l-4 shadow-sm z-10 overflow-hidden cursor-pointer hover:shadow-md transition-shadow group",
                      getColorClasses(event.color)
                    )}
                  >
                    <h4 className="text-xs font-bold truncate mb-1 pr-4">{event.title}</h4>
                    <div className="flex items-center gap-1 text-[10px] opacity-80 mb-1">
                      <Clock className="w-2.5 h-2.5" />
                      {event.start} - {event.end}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1 text-[10px] opacity-80">
                        <MapPin className="w-2.5 h-2.5" />
                        {event.location}
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEvent(event.id);
                      }}
                      className="absolute top-2 right-2 p-1 bg-transparent hover:bg-black/10 dark:hover:bg-white/10 rounded text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Event"
                    >
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100"
            >
              <form onSubmit={(e) => {
                e.preventDefault();
                addEvent(newEvent);
              }} className="p-6 space-y-4">
                <h3 className="text-xl font-bold">Create New Event</h3>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Event Title</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Data Structures"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500 outline-none"
                    value={newEvent.title}
                    onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Type</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-sm outline-none"
                      value={newEvent.type}
                      onChange={e => setNewEvent({...newEvent, type: e.target.value})}
                    >
                      {['Lecture', 'Study', 'Break', 'Lab', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Day</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-sm outline-none"
                      value={newEvent.day}
                      onChange={e => setNewEvent({...newEvent, day: e.target.value})}
                    >
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Start Time (HH:MM)</label>
                    <input
                      required
                      type="text"
                      placeholder="09:00"
                      pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
                      title="Enter time in 24h HH:MM format"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                      value={newEvent.start}
                      onChange={e => setNewEvent({...newEvent, start: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">End Time (HH:MM)</label>
                    <input
                      required
                      type="text"
                      placeholder="10:30"
                      pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
                      title="Enter time in 24h HH:MM format"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                      value={newEvent.end}
                      onChange={e => setNewEvent({...newEvent, end: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="Room 302"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-violet-500 outline-none"
                      value={newEvent.location}
                      onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Color theme</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-sm outline-none"
                      value={newEvent.color}
                      onChange={e => setNewEvent({...newEvent, color: e.target.value})}
                    >
                      {['blue', 'indigo', 'emerald', 'amber', 'rose'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
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
                    Create Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats/Legend */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/10 dark:to-blue-900/10 p-5 rounded-2xl border border-violet-100 dark:border-violet-800/50">
          <h3 className="text-sm font-bold text-violet-800 dark:text-violet-300 mb-2">Weekly Summary</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            You have <span className="font-bold text-violet-600">{events.filter(e => e.type === 'Lecture' || e.type === 'Lab').length * 1.5} hours</span> of classes and <span className="font-bold text-violet-600">{events.filter(e => e.type === 'Study').length * 1.5} hours</span> of scheduled study time this week.
          </p>
        </div>
        <div className="col-span-2 bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3">Schedule Legend</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { label: 'Lecture', color: 'bg-blue-500' },
              { label: 'Lab', color: 'bg-rose-500' },
              { label: 'Study', color: 'bg-emerald-500' },
              { label: 'Meeting', color: 'bg-amber-500' },
              { label: 'Personal', color: 'bg-indigo-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={twMerge("w-2 h-2 rounded-full", item.color)} />
                <span className="text-xs text-slate-500 dark:text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
