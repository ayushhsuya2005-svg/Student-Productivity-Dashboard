import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Eye, Moon, Sun, Monitor, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const sections = [
    {
      title: 'Account',
      icon: User,
      items: [
        { name: 'Profile Information', desc: 'Name, email, and avatar', color: 'text-blue-500' },
        { name: 'Change Password', desc: 'Security credentials', color: 'text-emerald-500' },
      ]
    },
    {
      title: 'Preferences',
      icon: Monitor,
      items: [
        { 
          name: 'Appearance', 
          desc: isDarkMode ? 'Dark Mode Active' : 'Light Mode Active', 
          action: toggleTheme,
          component: (
            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
              <button className={`p-1.5 rounded-md ${!isDarkMode ? 'bg-white shadow-sm' : ''}`}>
                <Sun size={14} className={!isDarkMode ? 'text-amber-500' : 'text-slate-400'} />
              </button>
              <button className={`p-1.5 rounded-md ${isDarkMode ? 'bg-slate-600 shadow-sm' : ''}`}>
                <Moon size={14} className={isDarkMode ? 'text-blue-400' : 'text-slate-400'} />
              </button>
            </div>
          )
        },
        { name: 'Notifications', desc: 'Alerts and sounds', color: 'text-rose-500' },
      ]
    },
    {
      title: 'Support',
      icon: HelpCircle,
      items: [
        { name: 'Help Center', desc: 'FAQs and tutorials', color: 'text-violet-500' },
        { name: 'Privacy Policy', desc: 'Data handling rules', color: 'text-slate-500' },
      ]
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account and app preferences</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm text-slate-800 dark:text-slate-100">
        <div className="p-8 flex items-center gap-6 border-b border-slate-50 dark:border-slate-700">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user?.name || 'Student'}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email || 'student@university.edu'}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
              Free Academic Plan
            </div>
          </div>
          <button className="px-5 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Edit Profile
          </button>
        </div>

        <div className="p-4 space-y-8">
          {sections.map(section => (
            <div key={section.title}>
              <div className="flex items-center gap-2 px-4 mb-2">
                <section.icon size={16} className="text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{section.title}</h3>
              </div>
              <div className="space-y-1">
                {section.items.map(item => (
                  <div
                    key={item.name}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-left cursor-pointer"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-white">{item.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      {item.component}
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 transition-all text-left"
          >
            <LogOut size={20} />
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
        StudyDash v1.0.0 • Made with ❤️ for Students
      </div>
    </div>
  );
};

export default Settings;
