import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X, MessageSquare, Bot, User, Loader2 } from 'lucide-react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 'welcome', 
      sender: 'ai', 
      text: "Hi there! 👋 I am your study companion. Ask me any question about your dashboard, tasks, study scheduling, or ask for general academic advice!" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Listen to the custom event from the Sidebar or other components
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener('toggle-ai-chat', handleToggle);
    return () => window.removeEventListener('toggle-ai-chat', handleToggle);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchLocalContext = async () => {
    let taskSummary = '';
    let attendanceSummary = '';
    
    try {
      // Fetch tasks
      const res = await fetch('/api/tasks', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const tasks = await res.json();
      if (Array.isArray(tasks)) {
        const pending = tasks.filter(t => t.status !== 'Completed');
        const completed = tasks.filter(t => t.status === 'Completed');
        
        // Sort pending by priority and date
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        const sortedPending = [...pending].sort((a, b) => {
          const priorityA = priorityOrder[a.priority] || 4;
          const priorityB = priorityOrder[b.priority] || 4;
          return priorityA - priorityB;
        });

        taskSummary = `Tasks Overview:
• Total Pending Tasks: ${pending.length}
• Total Completed Tasks: ${completed.length}
${sortedPending.length > 0 ? `• Immediate Priority: "${sortedPending[0].title}" (Priority: ${sortedPending[0].priority})` : '• You have no pending tasks! Excellent work!'}`;
      }
    } catch (e) {
      taskSummary = "• Task tracker data: Unavailable currently.";
    }

    try {
      // Fetch attendance
      const saved = localStorage.getItem('dashboard_attendance');
      if (saved) {
        const subjects = JSON.parse(saved);
        if (subjects.length > 0) {
          const list = subjects.map(s => {
            const pct = s.total === 0 ? 0 : Math.round((s.present / s.total) * 100);
            const status = pct >= 75 ? '✅ Good' : '⚠️ Critical (Under 75%)';
            return `  - ${s.name}: ${pct}% (${s.present}/${s.total} classes) [${status}]`;
          }).join('\n');
          attendanceSummary = `Attendance Status:\n${list}`;
        } else {
          attendanceSummary = "• Attendance tracker data: No subjects added yet.";
        }
      } else {
        attendanceSummary = "• Attendance tracker data: Start tracking courses in the dashboard to see statistics here.";
      }
    } catch (e) {
      attendanceSummary = "• Attendance tracker data: Error parsing local data.";
    }

    return { taskSummary, attendanceSummary };
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Add user message
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text }]);
    if (!textToSend) setInputValue('');
    
    setIsTyping(true);

    // Context analysis helper
    let replyText = "";
    const cleanText = text.toLowerCase();

    if (cleanText.includes("analyze") || cleanText.includes("dashboard") || cleanText.includes("my status")) {
      const context = await fetchLocalContext();
      replyText = `📊 **Here is my deep analysis of your current dashboard & schedule status:**

${context.taskSummary}

${context.attendanceSummary}

💡 **Actionable Insights:**
1. ${context.attendanceSummary.includes('Critical') 
    ? '⚠️ **Attendance Alert:** Prioritize attending classes for courses labeled Critical to make sure you cross the 75% barrier before examinations!' 
    : '✨ **Excellent attendance record!** Keep maintaining this baseline so you stay eligible for finals.'}
2. ${context.taskSummary.includes('Immediate Priority') 
    ? '🎯 **Task Strategy:** Try setting a **25-minute Pomodoro timer** right now to tackle your highest priority task!' 
    : '🚀 **Proactive Mode:** Since you have no pending tasks, this is the perfect time to review study notes or prep for coding interviews!'}

*Keep up the momentum, you are doing great!*`;
    } else if (cleanText.includes("focus") || cleanText.includes("strateg")) {
      replyText = `💡 **Science-Backed Focus Strategies:**

1. ⏱️ **The Pomodoro Technique**
   - Study for 25 minutes, then take a 5-minute break.
   - Repeat 4 times, then take a longer 15-30 minute break.
   - *Best for: Overcoming procrastination.*

2. 🧠 **Active Recall & Spaced Repetition**
   - Instead of re-reading notes, close the book and write down everything you remember.
   - Review material at expanding intervals (1 day, 3 days, 7 days).
   - *Best for: Long-term retention.*

3. 📵 **Distraction Isolation**
   - Keep your phone in another room or turn on "Do Not Disturb".
   - Use browser extensions to block time-wasting sites during study blocks.

Would you like me to analyze your dashboard tasks to suggest a focus block?`;
    } else if (cleanText.includes("placement") || cleanText.includes("prep") || cleanText.includes("interview")) {
      replyText = `🎯 **Your Tech Placement Prep Roadmap:**

1. 💻 **Data Structures & Algorithms (DSA)**
   - Prioritize Arrays, String Manipulation, HashMaps, Trees, and Dynamic Programming.
   - Aim for 1-2 coding problems daily on platforms like LeetCode.

2. 🗄️ **Core Computer Science Fundamentals**
   - Keep your **Database Management Systems (DBMS)** and **Operating Systems (OS)** knowledge sharp.
   - Practice SQL queries and concurrency questions.

3. 📁 **Personal Projects**
   - Make sure your resume highlights 2 solid projects (e.g. this Productivity Dashboard!).
   - Be ready to explain your tech stack and how you resolved engineering bottlenecks.

*Let me know if you want me to suggest specific concepts to study today!*`;
    } else {
      // General response
      replyText = `🤖 **Study Assistant Response:**

Thank you for reaching out! I've captured your query: *"${text}"*

Here is a general recommendation:
- **Prioritize schedule blocks:** Look at your timetable and block out dedicated slots for self-study.
- **Deconstruct goals:** Break your larger assignments into micro-tasks using your **Tasks** tab.
- **Tutor Advice:** Consistency beats intensity. 30 minutes of focused effort daily is infinitely better than an all-nighter.

*Let me know if you want me to do a dashboard analysis, provide interview tips, or share focus strategies!*`;
    }

    // Simulate typing delay for realistic interaction
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: replyText 
      }]);
    }, 1200);
  };

  return (
    <>
      {/* Floating Sparkles Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 z-40 group cursor-pointer"
        title="Ask Study AI"
      >
        <div className="absolute inset-0 rounded-full bg-violet-500/20 group-hover:animate-ping z-0" />
        <Sparkles size={24} className="relative z-10 animate-pulse" />
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950 z-40 backdrop-blur-sm"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col transition-colors duration-200"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
                    <Sparkles size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">Study Tutor AI</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Online Context Buddy</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {messages.map((msg) => {
                  const isAI = msg.sender === 'ai';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[85%] ${isAI ? 'self-start' : 'self-end ml-auto flex-row-reverse'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                        isAI ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {isAI ? <Bot size={16} /> : <User size={16} />}
                      </div>

                      {/* Message bubble */}
                      <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                        isAI 
                          ? 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800/80 rounded-tl-none' 
                          : 'bg-violet-600 text-white rounded-tr-none font-medium'
                      }`}>
                        {/* Render simple custom formatting for AI replies (markdown-like lists and bolding) */}
                        <div className="whitespace-pre-line">
                          {msg.text.split('\n').map((line, idx) => {
                            let content = line;
                            // Check for bold notation
                            const boldRegex = /\*\*(.*?)\*\*/g;
                            const matches = [...content.matchAll(boldRegex)];
                            
                            if (matches.length > 0) {
                              const parts = [];
                              let lastIdx = 0;
                              matches.forEach((match) => {
                                // Add prior plain text
                                if (match.index > lastIdx) {
                                  parts.push(content.substring(lastIdx, match.index));
                                }
                                // Add bold content
                                parts.push(<strong key={match.index} className="font-bold">{match[1]}</strong>);
                                lastIdx = match.index + match[0].length;
                              });
                              if (lastIdx < content.length) {
                                parts.push(content.substring(lastIdx));
                              }
                              return <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>{parts}</p>;
                            }
                            return <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>{content}</p>;
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 max-w-[85%] self-start">
                    <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot size={16} />
                    </div>
                    <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/80 text-slate-400 border border-slate-100 dark:border-slate-800/80 rounded-tl-none flex items-center gap-1.5">
                      <Loader2 size={16} className="animate-spin text-violet-500" />
                      <span className="text-xs font-medium">Tutor is compiling thoughts...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Preset Suggestion Bubbles */}
              <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-2 bg-slate-50/30 dark:bg-slate-900/10">
                <button
                  onClick={() => handleSend("📊 Analyze My Dashboard")}
                  className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-violet-50 dark:bg-slate-800 dark:hover:bg-violet-950/30 text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 rounded-full border border-slate-200/50 dark:border-slate-700/60 transition-colors cursor-pointer"
                >
                  📊 Analyze Dashboard
                </button>
                <button
                  onClick={() => handleSend("💡 Focus Strategies")}
                  className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-violet-50 dark:bg-slate-800 dark:hover:bg-violet-950/30 text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 rounded-full border border-slate-200/50 dark:border-slate-700/60 transition-colors cursor-pointer"
                >
                  💡 Focus Strategies
                </button>
                <button
                  onClick={() => handleSend("🎯 Placement Prep Plan")}
                  className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-violet-50 dark:bg-slate-800 dark:hover:bg-violet-950/30 text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 rounded-full border border-slate-200/50 dark:border-slate-700/60 transition-colors cursor-pointer"
                >
                  🎯 Placement Prep
                </button>
              </div>

              {/* Chat Input form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask me a study or planning question..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all text-slate-800 dark:text-slate-100"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-3 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer shadow-md shadow-violet-500/10"
                >
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
