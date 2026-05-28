import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Briefcase, BookOpen, Terminal, CheckCircle, ExternalLink, Award } from 'lucide-react';

const Placement = () => {
  const categories = [
    {
      title: 'Coding Practice',
      icon: Code2,
      color: 'blue',
      resources: [
        { name: 'LeetCode - Top 100 Liked', link: 'https://leetcode.com/problemset/top-100-liked-questions/', status: 'In Progress' },
        { name: 'Striver SDE Sheet', link: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/', status: 'Not Started' },
        { name: 'HackerRank Problem Solving', link: 'https://www.hackerrank.com/domains/algorithms', status: 'Completed' },
      ]
    },
    {
      title: 'CS Fundamentals',
      icon: BookOpen,
      color: 'emerald',
      resources: [
        { name: 'OS Interview Questions', link: '#', status: 'In Progress' },
        { name: 'DBMS SQL Queries', link: '#', status: 'Completed' },
        { name: 'Computer Networks Notes', link: '#', status: 'Not Started' },
      ]
    },
    {
      title: 'Aptitude & Logical',
      icon: Award,
      color: 'amber',
      resources: [
        { name: 'Quantitative Aptitude', link: '#', status: 'In Progress' },
        { name: 'Logical Reasoning', link: '#', status: 'In Progress' },
        { name: 'Verbal Ability', link: '#', status: 'Not Started' },
      ]
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Placement Prep Hub
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Accelerate your career with curated resources and trackers</p>
        </div>
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
              {String.fromCharCode(64 + i)}
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
            +24
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex items-center justify-center text-blue-600">
            <Terminal size={28} />
          </div>
          <div>
            <div className="text-2xl font-bold">452</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">LeetCode Solved</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl flex items-center justify-center text-emerald-600">
            <Briefcase size={28} />
          </div>
          <div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Companies Applied</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/10 rounded-2xl flex items-center justify-center text-amber-600">
            <CheckCircle size={28} />
          </div>
          <div>
            <div className="text-2xl font-bold">85%</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Topic Readiness</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`p-6 border-b border-slate-50 dark:border-slate-700 flex items-center gap-3`}>
              <div className={`p-2 rounded-xl bg-${cat.color}-50 dark:bg-${cat.color}-900/20 text-${cat.color}-600`}>
                <cat.icon size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white">{cat.title}</h3>
            </div>
            <div className="p-4 space-y-3">
              {cat.resources.map((res, idx) => (
                <div key={idx} className="group p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-600">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      {res.name}
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase ${
                      res.status === 'Completed' ? 'text-emerald-500' : 
                      res.status === 'In Progress' ? 'text-blue-500' : 'text-slate-400'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    res.status === 'Completed' ? 'bg-emerald-500' : 
                    res.status === 'In Progress' ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`} />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Resume Review AI</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md">Get instant feedback on your resume tailored for SDE, Data Science, or Product roles.</p>
          <button className="px-6 py-3 bg-white text-slate-900 rounded-2xl text-sm font-black hover:bg-slate-100 transition-colors">
            Upload Resume (PDF)
          </button>
        </div>
        <div className="w-full max-w-xs bg-slate-800/50 border border-slate-700 rounded-2xl p-4 relative z-10">
          <div className="text-xs font-bold text-slate-500 mb-4 uppercase">Latest Tip</div>
          <p className="text-xs text-slate-300 italic">"Focus on quantification! Instead of saying 'Built a website', say 'Developed a responsive React web app that reduced page load by 40% using code splitting'."</p>
        </div>
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
};

export default Placement;
