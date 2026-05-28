import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' or 'break'

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Switch modes
          setIsActive(false);
          if (mode === 'work') {
            setMode('break');
            setMinutes(5);
          } else {
            setMode('work');
            setMinutes(25);
          }
          // Notification could be played here
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') {
      setMinutes(25);
    } else {
      setMinutes(5);
    }
    setSeconds(0);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setMinutes(newMode === 'work' ? 25 : 5);
    setSeconds(0);
  };

  return (
    <div className="glass-card p-8 text-center flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -mr-16 -mt-16 rounded-full ${mode === 'work' ? 'bg-primary-500' : 'bg-green-500'}`}></div>
      
      <div className="flex gap-4 mb-8 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl z-10">
        <button 
          onClick={() => switchMode('work')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'work' ? 'bg-white dark:bg-surface shadow-sm text-primary-600' : 'text-slate-500'}`}
        >
          <Brain size={16} /> Work
        </button>
        <button 
          onClick={() => switchMode('break')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'break' ? 'bg-white dark:bg-surface shadow-sm text-green-600' : 'text-slate-500'}`}
        >
          <Coffee size={16} /> Break
        </button>
      </div>

      <div className="relative mb-8">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-200 dark:text-slate-800"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={552.92}
            strokeDashoffset={552.92 - (552.92 * (minutes * 60 + seconds)) / (mode === 'work' ? 1500 : 300)}
            strokeLinecap="round"
            className={`transition-all duration-1000 ${mode === 'work' ? 'text-primary-500' : 'text-green-500'}`}
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="text-5xl font-mono font-bold tracking-tighter">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="flex gap-4 z-10">
        <button 
          onClick={toggleTimer}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${isActive ? 'bg-slate-700 hover:bg-slate-600' : 'bg-primary-600 hover:bg-primary-500 shadow-primary-500/20'}`}
        >
          {isActive ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        <button 
          onClick={resetTimer}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <RotateCcw size={24} />
        </button>
      </div>
      
      <p className="mt-8 text-sm text-slate-500 dark:text-slate-400 font-medium">
        {mode === 'work' ? "Time to focus!" : "Take a deep breath."}
      </p>
    </div>
  );
}
