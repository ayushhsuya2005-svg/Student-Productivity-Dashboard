import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Notes from './pages/Notes';
import Tasks from './pages/Tasks';
import Schedule from './pages/Schedule';
import Pomodoro from './pages/Pomodoro';
import Analytics from './pages/Analytics';
import Placement from './pages/Placement';
import Settings from './pages/Settings';

// Mock empty pages for now
const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center h-full animate-fade-in">
    <h1 className="text-2xl font-bold text-slate-400 dark:text-slate-600">{title} Page Coming Soon...</h1>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/pomodoro" element={<Pomodoro />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/placement" element={<Placement />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
