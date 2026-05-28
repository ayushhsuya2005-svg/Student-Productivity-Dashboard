import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle, 
  Clock, 
  Flame, 
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import AttendanceTracker from '../components/AttendanceTracker';
import PomodoroTimer from '../components/PomodoroTimer';

const activityData = [
  { name: 'Mon', hours: 2 },
  { name: 'Tue', hours: 4 },
  { name: 'Wed', hours: 3 },
  { name: 'Thu', hours: 5 },
  { name: 'Fri', hours: 2.5 },
  { name: 'Sat', hours: 6 },
  { name: 'Sun', hours: 4.5 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
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
          
          // Filter for today's events
          const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const todayName = daysOfWeek[new Date().getDay()];
          const todayEvents = mapped.filter(e => e.day.toLowerCase() === todayName.toLowerCase());
          
          // Sort by start time (HH:MM)
          todayEvents.sort((a, b) => a.start.localeCompare(b.start));
          
          setEvents(todayEvents);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard schedule:', err);
      } finally {
        setLoadingSchedule(false);
      }
    };
    
    fetchSchedule();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user ? user.name : 'Student'}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here's an overview of your productivity today.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/pomodoro')}
            className="btn-secondary flex items-center gap-2"
          >
            <Clock size={16} />
            Quick Timer
          </button>
          <button 
            onClick={() => navigate('/notes', { state: { createNew: true } })}
            className="btn-primary flex items-center gap-2"
          >
            <BookOpen size={16} />
            New Note
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Flame className="text-orange-500" />}
          label="Current Streak"
          value="12 Days"
          trend="+2 this week"
          trendPositive={true}
        />
        <StatCard 
          icon={<CheckCircle className="text-green-500" />}
          label="Tasks Completed"
          value="24"
          trend="80% completion"
          trendPositive={true}
        />
        <StatCard 
          icon={<TrendingUp className="text-blue-500" />}
          label="Overall CGPA"
          value="8.75"
          trend="Top 15% in class"
          trendPositive={true}
        />
        <StatCard 
          icon={<Clock className="text-purple-500" />}
          label="Study Hours"
          value="27h"
          trend="-2h from last week"
          trendPositive={false}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Charts & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Weekly Productivity</h2>
              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-md px-2 py-1 outline-none">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#c4b5fd' }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <AttendanceTracker />

          {/* AI Insights */}
          <div className="glass-panel p-5 bg-gradient-to-r from-primary-900/10 to-transparent dark:from-primary-900/20">
            <h3 className="font-medium text-primary-700 dark:text-primary-300 flex items-center gap-2 mb-2">
              ✨ AI Study Insight
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Based on your recent performance, allocating 45 extra minutes to <strong>Data Structures</strong> this weekend could boost your placement readiness score by 12%. You have a strong streak going—keep it up!
            </p>
          </div>
        </div>

        {/* Right Column - Schedule & Pomodoro */}
        <div className="space-y-6">
          <PomodoroTimer />

          <div className="glass-card p-5">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Today's Schedule</h2>
            <div className="space-y-4">
              {loadingSchedule ? (
                <div className="flex items-center justify-center py-6 text-sm text-slate-400">
                  Loading schedule...
                </div>
              ) : events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center text-slate-500 dark:text-slate-400">
                  <p className="text-sm font-medium">No events scheduled for today! 🎉</p>
                  <p className="text-xs opacity-75 mt-1">Enjoy your free time or add a task!</p>
                </div>
              ) : (
                events.map(event => (
                  <ScheduleItem 
                    key={event.id}
                    time={`${formatTime12h(event.start)} - ${formatTime12h(event.end)}`}
                    title={event.title}
                    type={event.type}
                    color={event.color}
                  />
                ))
              )}
            </div>
            <button 
              onClick={() => navigate('/schedule')}
              className="w-full mt-4 text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              View Full Calendar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, trendPositive }) {
  return (
    <div className="glass-card p-5 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {icon}
        </div>
      </div>
      <div className={`text-xs mt-3 font-medium ${trendPositive ? 'text-green-500' : 'text-orange-500'}`}>
        {trend}
      </div>
    </div>
  );
}

function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const [hoursStr, minutesStr] = timeStr.split(':');
  const hours = parseInt(hoursStr, 10);
  if (isNaN(hours)) return timeStr;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutesStr} ${ampm}`;
}

function ScheduleItem({ time, title, type, color }) {
  const typeColors = {
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    // Fallback based on type
    Lecture: 'bg-blue-500',
    Lab: 'bg-rose-500',
    Study: 'bg-emerald-500',
    Break: 'bg-amber-500',
    Other: 'bg-indigo-500',
    class: 'bg-blue-500',
    study: 'bg-purple-500',
    meeting: 'bg-green-500'
  };

  return (
    <div className="flex items-start gap-3">
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium w-28 pt-0.5 whitespace-nowrap">
        {time}
      </div>
      <div className="flex-1 pb-4 border-l-2 border-slate-200 dark:border-slate-700 pl-3 relative">
        <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${typeColors[color] || typeColors[type] || 'bg-primary-500'}`}></div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{title}</p>
      </div>
    </div>
  );
}
