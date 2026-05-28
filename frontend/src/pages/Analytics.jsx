import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, CheckCircle, Clock, Calendar, Zap } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const Analytics = () => {
  const taskData = [
    { name: 'Mon', completed: 8, total: 10 },
    { name: 'Tue', completed: 6, total: 8 },
    { name: 'Wed', completed: 9, total: 12 },
    { name: 'Thu', completed: 11, total: 11 },
    { name: 'Fri', completed: 4, total: 7 },
    { name: 'Sat', completed: 12, total: 15 },
    { name: 'Sun', completed: 10, total: 10 },
  ];

  const focusData = [
    { name: 'Mon', hours: 4.5 },
    { name: 'Tue', hours: 3.2 },
    { name: 'Wed', hours: 5.1 },
    { name: 'Thu', hours: 6.3 },
    { name: 'Fri', hours: 2.8 },
    { name: 'Sat', hours: 4.0 },
    { name: 'Sun', hours: 3.5 },
  ];

  const distributionData = [
    { name: 'Lectures', value: 40, color: '#3b82f6' },
    { name: 'Self Study', value: 35, color: '#8b5cf6' },
    { name: 'Projects', value: 15, color: '#f59e0b' },
    { name: 'Extracurricular', value: 10, color: '#10b981' },
  ];

  const stats = [
    { label: 'Weekly Tasks', value: '50/63', sub: '+12% from last week', icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
    { label: 'Avg Focus Time', value: '4.2 hrs', sub: 'Daily average', icon: Clock, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/10' },
    { label: 'Study Streak', value: '12 Days', sub: 'Personal best: 21', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10' },
    { label: 'Classes Attended', value: '94%', sub: 'Target: 90%', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
          Performance Analytics
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive into your productivity patterns and growth</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className={twMerge("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</h3>
            <div className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">{stat.value}</div>
            <p className="text-xs text-slate-400 mt-2">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Completion Bar Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Task Completion Trend</h3>
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Focus Hours Area Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-8">Focus Intensity</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={focusData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Time Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {distributionData.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                </div>
                <span className="text-xs font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">AI Insight</h3>
            <p className="text-indigo-100 leading-relaxed mb-6">
              "Based on your performance this week, your focus peaks between **10 AM and 1 PM**. You tend to complete **High Priority** tasks faster on Tuesdays. Recommendation: Schedule your most challenging Project work for Tuesday mornings."
            </p>
            <button className="px-6 py-2 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors">
              Generate Detailed Report
            </button>
          </div>
          {/* Decorative element */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-blue-400/20 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
