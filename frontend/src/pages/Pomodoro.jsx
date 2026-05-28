import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain, Volume2, VolumeX, Music } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const Pomodoro = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
  const [isMuted, setIsMuted] = useState(false);
  
  const timerRef = useRef(null);

  const modes = {
    work: { label: 'Focus', time: 25, color: 'rose' },
    shortBreak: { label: 'Short Break', time: 5, color: 'emerald' },
    longBreak: { label: 'Long Break', time: 15, color: 'blue' },
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          clearInterval(timerRef.current);
          setIsActive(false);
          // Play notification sound here
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(modes[mode].time);
    setSeconds(0);
  };

  const switchMode = (m) => {
    setMode(m);
    setIsActive(false);
    setMinutes(modes[m].time);
    setSeconds(0);
  };

  const progress = ((modes[mode].time * 60 - (minutes * 60 + seconds)) / (modes[mode].time * 60)) * 100;

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white mb-2">
          Focus Flow
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Master your time with the Pomodoro technique</p>
      </div>

      <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
        {/* Progress Ring Background */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="stroke-slate-100 dark:stroke-slate-800 fill-none"
            strokeWidth="8"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 100 }}
            className={twMerge(
              "fill-none transition-all duration-1000 ease-linear",
              mode === 'work' ? "stroke-rose-500" : mode === 'shortBreak' ? "stroke-emerald-500" : "stroke-blue-500"
            )}
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>

        {/* Timer Display */}
        <div className="relative text-center z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={twMerge(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4",
                mode === 'work' ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" :
                mode === 'shortBreak' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              )}
            >
              {mode === 'work' ? <Brain size={14} /> : <Coffee size={14} />}
              {modes[mode].label}
            </motion.div>
          </AnimatePresence>

          <div className="text-8xl font-black tracking-tighter text-slate-800 dark:text-white tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <button 
              onClick={resetTimer}
              className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <RotateCcw size={24} />
            </button>
            
            <button 
              onClick={toggleTimer}
              className={twMerge(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95",
                mode === 'work' ? "bg-rose-500 shadow-rose-500/20 hover:bg-rose-600" :
                mode === 'shortBreak' ? "bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600" :
                "bg-blue-500 shadow-blue-500/20 hover:bg-blue-600",
                "text-white"
              )}
            >
              {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>

            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-12 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        {Object.entries(modes).map(([key, value]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={twMerge(
              "px-6 py-2 rounded-xl text-sm font-semibold transition-all",
              mode === key 
                ? (key === 'work' ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400" :
                   key === 'shortBreak' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" :
                   "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400")
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            )}
          >
            {value.label}
          </button>
        ))}
      </div>

      <div className="mt-12 flex items-center gap-4 text-slate-400 text-sm">
        <Music size={16} />
        <span>Playing: Lofi Study Beats</span>
      </div>
    </div>
  );
};

export default Pomodoro;
