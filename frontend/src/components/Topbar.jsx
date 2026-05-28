import { Sun, Moon, Bell, Search, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="h-16 flex-shrink-0 bg-white/80 dark:bg-surface/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 z-10 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
          <Menu size={20} />
        </button>
        
        <div className="hidden md:flex items-center relative group">
          <Search size={18} className="absolute left-3 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900/50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary-500/50 outline-none w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        <div className="flex items-center gap-3 cursor-pointer pl-1">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
              {user ? user.name : 'Guest'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Student</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user ? user.name.charAt(0) : 'G'}
          </div>
        </div>
      </div>
    </header>
  );
}
