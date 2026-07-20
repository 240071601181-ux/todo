import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Sparkles, Terminal, ShieldAlert } from 'lucide-react';
import { AppSettings } from '../types';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
  settings: AppSettings;
}

export default function LoginScreen({ onLogin, onRegister, settings }: LoginScreenProps) {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isRegister && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      if (isRegister) {
        await onRegister(name, email, password);
      } else {
        await onLogin(email, password);
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? ((err as { response: { data: { message: string } } }).response?.data?.message ?? 'Authentication failed')
          : err instanceof Error
            ? err.message
            : 'Authentication failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = async (provider: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    setError(`${provider} SSO is not yet configured.`);
  };

  const accentColors: Record<string, string> = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/30 focus:border-blue-500 focus:ring-blue-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/30 focus:border-purple-500 focus:ring-purple-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/30 focus:border-amber-500 focus:ring-amber-500/20',
    rose: 'text-rose-500 bg-rose-500/10 border-rose-500/30 focus:border-rose-500 focus:ring-rose-500/20',
  };

  const activeAccent = settings.accentColor;
  const accentClass = accentColors[activeAccent] || accentColors.blue;

  return (
    <div id="login-container" className="min-h-screen flex items-center justify-center bg-[#07090e] text-slate-100 p-4 relative overflow-hidden font-sans">
      {/* Immersive background glow elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/15 rounded-full blur-3xl animate-pulse-subtle"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/15 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>

      {/* Decorative cyber grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.03]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md ${
          settings.glassmorphism
            ? 'bg-[#0f131a]/85 backdrop-blur-xl border border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'bg-[#10141d] border border-slate-800 shadow-2xl'
        } rounded-2xl p-8 relative z-10`}
      >
        {/* Top Header Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl mb-3 shadow-inner"
          >
            <div className="flex space-x-1">
              <span className={`h-3 w-3 rounded-full bg-blue-500 animate-pulse`}></span>
              <span className={`h-3 w-3 rounded-full bg-purple-500`}></span>
              <span className={`h-3 w-3 rounded-full bg-emerald-500`}></span>
            </div>
          </motion.div>
          
          <h1 className="font-display text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            FAST<span className={`text-${activeAccent}-500 font-extrabold uppercase`}>ODO</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-mono tracking-widest uppercase">
            Velocity Dark Suite // v2.4.0
          </p>
        </div>

        {/* Dynamic Title based on tab */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-100">
            {isRegister ? 'Create secure terminal account' : 'Access your workspace'}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {isRegister ? 'Join the hyper-focused team of engineers and designers.' : 'Enter credentials or authenticate with OAuth keys.'}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg flex items-start gap-2"
          >
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-[11px] font-mono tracking-wider uppercase text-slate-400 mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Alex Carter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#090b10] border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-sans"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono tracking-wider uppercase text-slate-400 mb-1.5">Workspace Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="developer@nexus.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#090b10] border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-mono tracking-wider uppercase text-slate-400">Security Key / Password</label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors"
                >
                  FORGOT?
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#090b10] border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-2 inline-flex items-center justify-center gap-2 bg-${activeAccent}-500 hover:bg-${activeAccent}-600 text-white font-medium text-sm py-3 px-4 rounded-xl transition-all cursor-pointer shadow-[0_4px_20px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.25)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none`}
            style={{
              backgroundColor: activeAccent === 'blue' ? '#3b82f6' : activeAccent === 'purple' ? '#a855f7' : activeAccent === 'emerald' ? '#10b981' : activeAccent === 'amber' ? '#f59e0b' : '#f43f5e'
            }}
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{isRegister ? 'Register & Establish Session' : 'Authenticate & Enter'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800/80"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-mono tracking-widest uppercase">
            <span className="bg-[#0f131a] px-3 text-slate-500">OR SECURE SSO</span>
          </div>
        </div>

        {/* SSO OAuth Quick Connect */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleSSOLogin('Google')}
            className="flex items-center justify-center p-2.5 bg-[#090b10] border border-slate-800 hover:border-slate-700/80 rounded-xl hover:bg-slate-900/40 transition-all group"
            title="Authenticate with Google"
          >
            <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
          </button>
          <button
            onClick={() => handleSSOLogin('Microsoft')}
            className="flex items-center justify-center p-2.5 bg-[#090b10] border border-slate-800 hover:border-slate-700/80 rounded-xl hover:bg-slate-900/40 transition-all group"
            title="Authenticate with Microsoft"
          >
            <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 23 23" fill="currentColor">
              <path d="M0 0h11v11H0z" fill="#F25022" />
              <path d="M12 0h11v11H12z" fill="#7FBA00" />
              <path d="M0 12h11v11H0z" fill="#00A4EF" />
              <path d="M12 12h11v11H12z" fill="#FFB900" />
            </svg>
          </button>
          <button
            onClick={() => handleSSOLogin('GitHub')}
            className="flex items-center justify-center p-2.5 bg-[#090b10] border border-slate-800 hover:border-slate-700/80 rounded-xl hover:bg-slate-900/40 transition-all group"
            title="Authenticate with GitHub"
          >
            <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </button>
        </div>

        {/* Footer switch */}
        <div className="mt-8 text-center text-xs">
          <span className="text-slate-500">
            {isRegister ? 'Already have an account? ' : "New to the Velocity Suite? "}
          </span>
          <button
            onClick={() => {
              setError('');
              setIsRegister(!isRegister);
            }}
            className={`text-${activeAccent}-500 hover:underline font-medium transition-all`}
            style={{
              color: activeAccent === 'blue' ? '#3b82f6' : activeAccent === 'purple' ? '#a855f7' : activeAccent === 'emerald' ? '#10b981' : activeAccent === 'amber' ? '#f59e0b' : '#f43f5e'
            }}
          >
            {isRegister ? 'Sign In' : 'Create an Account'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
