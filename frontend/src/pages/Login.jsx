import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token, { name: data.name, email: data.email, id: data._id });
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-md w-full animate-fade-in">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-3xl tracking-tight mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg">
              <TrendingUp size={28} />
            </div>
            StudyDash
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back!</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Please enter your details to sign in.</p>
        </div>

        <div className="glass-card p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10" 
                  placeholder="name@university.edu"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-xs text-primary-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
