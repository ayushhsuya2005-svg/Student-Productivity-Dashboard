import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  CheckSquare, 
  BookOpen, 
  Timer, 
  TrendingUp, 
  Code,
  Settings
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: CalendarDays, label: 'Schedule', path: '/schedule' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: BookOpen, label: 'Notes', path: '/notes' },
  { icon: Timer, label: 'Pomodoro', path: '/pomodoro' },
  { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
  { icon: Code, label: 'Placement Prep', path: '/placement' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-surface hidden md:flex flex-col transition-colors duration-200">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white">
            <TrendingUp size={20} />
          </div>
          StudyDash
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            <item.icon size={18} className="flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="glass-panel p-4 bg-gradient-to-br from-primary-500/10 to-transparent">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">AI Assistant</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Ask me anything about your studies!</p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-ai-chat'))}
            className="w-full text-xs py-1.5 px-3 bg-primary-600 hover:bg-primary-500 text-white rounded-md transition-colors shadow-sm shadow-primary-500/20"
          >
            Open Chat
          </button>
        </div>
      </div>
    </aside>
  );
}
