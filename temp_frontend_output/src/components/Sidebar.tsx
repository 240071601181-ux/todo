import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderGit2, 
  Calendar, 
  Timer, 
  Settings, 
  User, 
  LogOut, 
  Zap, 
  TrendingUp,
  Cpu
} from 'lucide-react';
import { AppSettings, UserProfile, Project } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  projects: Project[];
  settings: AppSettings;
  onLogout: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  projects, 
  settings, 
  onLogout 
}: SidebarProps) {
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Today\'s Tasks', icon: CheckSquare },
    { id: 'projects', label: 'Active Projects', icon: FolderGit2 },
    { id: 'calendar', label: 'Calendar Grid', icon: Calendar },
    { id: 'focus', label: 'Focus Terminal', icon: Timer },
  ];

  const secondaryNavItems = [
    { id: 'profile', label: 'Profile XP', icon: User },
    { id: 'settings', label: 'Appearance & System', icon: Settings },
  ];

  const accentColors: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500 font-medium',
    purple: 'bg-purple-500/10 text-purple-400 border-l-2 border-purple-500 font-medium',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 font-medium',
    amber: 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 font-medium',
    rose: 'bg-rose-500/10 text-rose-400 border-l-2 border-rose-500 font-medium',
  };

  const activeAccentClass = accentColors[settings.accentColor] || accentColors.blue;

  const getAccentColorHex = () => {
    switch (settings.accentColor) {
      case 'purple': return '#a855f7';
      case 'emerald': return '#10b981';
      case 'amber': return '#f59e0b';
      case 'rose': return '#f43f5e';
      default: return '#3b82f6';
    }
  };

  return (
    <aside 
      id="app-sidebar"
      className={`w-64 shrink-0 flex flex-col justify-between border-r border-slate-800/80 bg-[#0a0d14] h-screen text-slate-300 font-sans sticky top-0`}
    >
      {/* Top Brand Block */}
      <div>
        <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-900 border border-slate-800/80">
            <Cpu className="w-4 h-4 text-slate-400 animate-pulse" style={{ color: getAccentColorHex() }} />
          </div>
          <div>
            <span className="font-display font-bold tracking-tight text-white block text-sm">
              FAST<span style={{ color: getAccentColorHex() }}>ODO</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block">
              VELOCITY CORE
            </span>
          </div>
        </div>

        {/* Level Progression Indicator */}
        <div className="px-5 pt-4 pb-2">
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/40 relative overflow-hidden">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500/20" /> LEVEL {user.level}
              </span>
              <span className="text-[9px] font-mono text-slate-500">{user.xp}/{user.nextLevelXp} XP</span>
            </div>
            <div className="w-full bg-slate-800/60 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500" 
                style={{ 
                  width: `${(user.xp / user.nextLevelXp) * 100}%`,
                  backgroundColor: getAccentColorHex()
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] text-slate-500 font-mono">STREAK</span>
              <span className="text-[10px] font-bold text-amber-400 font-mono flex items-center gap-0.5">
                🔥 {user.streakDays} DAYS
              </span>
            </div>
          </div>
        </div>

        {/* Main Nav list */}
        <nav className="mt-4 px-3 space-y-1">
          <span className="px-3 text-[10px] font-mono tracking-wider text-slate-500 block mb-2 uppercase">
            Workspace Panels
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all text-left cursor-pointer ${
                  isActive 
                    ? activeAccentClass 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? '' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.id === 'focus' && (
                  <span className="ml-auto flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Project Connections */}
        <div className="mt-6 px-3">
          <span className="px-3 text-[10px] font-mono tracking-wider text-slate-500 block mb-2 uppercase">
            Scope Scaffolds
          </span>
          <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setActiveTab(`project-detail:${proj.id}`)}
                className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 transition-all text-left truncate group cursor-pointer"
              >
                <span 
                  className="h-2 w-2 rounded-full shrink-0" 
                  style={{ backgroundColor: proj.color }} 
                />
                <span className="truncate flex-1">{proj.name}</span>
                <span className="text-[10px] font-mono text-slate-600 group-hover:text-slate-400 transition-colors">
                  {proj.progress}%
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Footer Section */}
      <div>
        <div className="px-3 mb-2 space-y-1 border-t border-slate-800/50 pt-4">
          <span className="px-3 text-[10px] font-mono tracking-wider text-slate-500 block mb-2 uppercase">
            Preferences
          </span>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all text-left cursor-pointer ${
                  isActive 
                    ? activeAccentClass 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? '' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Profile Footer */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-8.5 w-8.5 rounded-full border border-slate-800/80 object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="truncate">
              <span className="text-xs font-semibold text-slate-100 block truncate leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block truncate uppercase">
                {user.role}
              </span>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-red-400 transition-all shrink-0 cursor-pointer"
            title="Log out of Terminal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
