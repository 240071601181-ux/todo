import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  Zap, 
  TrendingUp, 
  Activity, 
  Clock, 
  CheckCircle2, 
  LogOut, 
  ShieldCheck, 
  Compass, 
  Flame,
  UserCheck,
  Send,
  Sliders
} from 'lucide-react';
import { UserProfile, AppSettings } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  settings: AppSettings;
  onLogout: () => void;
  accentColor: string;
}

export default function ProfileScreen({ user, settings, onLogout, accentColor }: ProfileScreenProps) {
  
  const [notifReports, setNotifReports] = useState(true);
  const [telemetry, setTelemetry] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const getAccentColorHex = () => {
    switch (accentColor) {
      case 'purple': return '#a855f7';
      case 'emerald': return '#10b981';
      case 'amber': return '#f59e0b';
      case 'rose': return '#f43f5e';
      default: return '#3b82f6';
    }
  };

  const activeAccent = getAccentColorHex();

  const achievements = [
    { 
      id: "ach-1", 
      title: "Keyboard Warrior", 
      desc: "Resolve 50 engineering story points in a single operational cycle.", 
      icon: ShieldCheck, 
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      unlocked: true 
    },
    { 
      id: "ach-2", 
      title: "Deep Focus Titan", 
      desc: "Maintain 10 focus sessions without timer suspension.", 
      icon: Clock, 
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      unlocked: true 
    },
    { 
      id: "ach-3", 
      title: "Sprint Finisher", 
      desc: "Successfully close an active sprint with zero trailing backlog tickets.", 
      icon: CheckCircle2, 
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      unlocked: true 
    },
    { 
      id: "ach-4", 
      title: "Catalyst Overloader", 
      desc: "Maintain an active productivity streak exceeding 10 consecutive cycles.", 
      icon: Flame, 
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      unlocked: true 
    },
    { 
      id: "ach-5", 
      title: "Zen Master", 
      desc: "Accumulate 1000 minutes inside Focus Terminal ambient soundtrack zones.", 
      icon: Compass, 
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      unlocked: false 
    },
    { 
      id: "ach-6", 
      title: "Alpha Orchestrator", 
      desc: "Simultaneously coordinate more than 3 active full-scale projects.", 
      icon: Award, 
      color: "text-slate-400 bg-slate-500/10 border-slate-500/20",
      unlocked: false 
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#07090d] text-slate-100 p-8 space-y-8 font-sans">
      
      {/* Top Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/50 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
            <span>DEVELOPER IDENTIFICATION</span>
            <span>•</span>
            <span style={{ color: activeAccent }}>CREDENTIAL XP HUBS</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white mt-1">
            Developer Profile
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Overview of streaks, productivity levels, achieved badges, and telemetry options.
          </p>
        </div>

        <button 
          onClick={onLogout}
          className="p-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-500/25 rounded-xl text-red-400 hover:text-red-300 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
        >
          <LogOut className="w-4 h-4" /> TERMINATE SESSION
        </button>
      </div>

      {/* Main Profile Info & Progression Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column Profile identity Card */}
        <div className="bg-[#0c0f16]/90 border border-slate-800/60 p-6 rounded-2xl flex flex-col items-center text-center space-y-5">
          <div className="relative">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-24 w-24 rounded-full object-cover border-2 border-slate-800"
              referrerPolicy="no-referrer"
            />
            {/* Streak hot indicator */}
            <span className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-[#05060a] border border-slate-800 flex items-center justify-center text-xs" title="Streak 🔥">
              🔥
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-200">{user.name}</h2>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">{user.role}</span>
            <span className="text-[11px] text-slate-400 block pt-0.5">{user.email}</span>
          </div>

          <div className="w-full border-t border-slate-800/40 pt-4 flex justify-between gap-4">
            <div className="flex-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Total level</span>
              <span className="text-lg font-bold text-white font-mono">{user.level}</span>
            </div>
            <div className="border-l border-slate-800/40"></div>
            <div className="flex-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Daily streak</span>
              <span className="text-lg font-bold text-amber-400 font-mono">🔥 {user.streakDays}</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns Progression Stats meters */}
        <div className="lg:col-span-2 bg-[#0c0f16]/90 border border-slate-800/60 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800/40 pb-3 mb-5">
              Experience & Progression Metrics
            </h3>

            {/* Level meter */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-end text-xs font-mono">
                <span className="text-slate-400 uppercase">XP progression</span>
                <span className="text-slate-300">{user.xp} / {user.nextLevelXp} XP ({Math.round((user.xp / user.nextLevelXp) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800/60">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(user.xp / user.nextLevelXp) * 100}%`, backgroundColor: activeAccent }} 
                />
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">Resolve more tickets and complete focus sessions to accumulate experience points.</span>
            </div>

            {/* Operational Metrics parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded-xl">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Productivity Score</span>
                <span className="text-xl font-bold font-display text-white mt-1 block">{user.productivityScore}</span>
              </div>
              <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded-xl">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Completed Tasks Week</span>
                <span className="text-xl font-bold font-display text-white mt-1 block">59 Tasks</span>
              </div>
              <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded-xl">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Active Sprint Load</span>
                <span className="text-xl font-bold font-display text-white mt-1 block">3 projects</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/40 pt-4 mt-5 flex items-center gap-2.5">
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              Authenticated session established on secure container.
            </span>
          </div>
        </div>
      </div>

      {/* Badges and Achievements Grid */}
      <div className="bg-[#0c0f16]/90 border border-slate-800/60 p-6 rounded-2xl">
        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800/40 pb-3 mb-5">
          Achieved Badges / Milestones ({achievements.filter(a=>a.unlocked).length}/{achievements.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const Icon = ach.icon;
            return (
              <div 
                key={ach.id} 
                className={`p-4 border rounded-xl flex items-start gap-3.5 transition-all relative overflow-hidden ${
                  ach.unlocked 
                    ? 'bg-slate-900/50 border-slate-800/80 hover:border-slate-800 hover:bg-slate-900/80' 
                    : 'bg-slate-950/20 border-slate-950/40 opacity-40'
                }`}
              >
                <div className={`p-2.5 rounded-xl border ${ach.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-200 block">{ach.title}</span>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">{ach.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preferences Option Switches */}
      <div className="bg-[#0c0f16]/90 border border-slate-800/60 p-6 rounded-2xl max-w-4xl">
        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800/40 pb-3 mb-5 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-slate-500" /> User Notification & Privacy Telemetry
        </h3>

        <div className="space-y-4">
          {/* report toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-900/20 rounded-xl border border-slate-800/40">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200 block">Real-time Notification Alerts</span>
              <p className="text-[10px] text-slate-500">Enable audio triggers and browser push notifications for core updates</p>
            </div>
            <button
              onClick={() => setNotifReports(!notifReports)}
              className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                notifReports ? 'bg-blue-500' : 'bg-slate-800'
              }`}
              style={{ backgroundColor: notifReports ? activeAccent : undefined }}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                notifReports ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* portfolio telemetry */}
          <div className="flex items-center justify-between p-3 bg-slate-900/20 rounded-xl border border-slate-800/40">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200 block">Public Portfolio Telemetry</span>
              <p className="text-[10px] text-slate-500">Allow other workspace team leaders to inspect your level progress index</p>
            </div>
            <button
              onClick={() => setTelemetry(!telemetry)}
              className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                telemetry ? 'bg-blue-500' : 'bg-slate-800'
              }`}
              style={{ backgroundColor: telemetry ? activeAccent : undefined }}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                telemetry ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* email report toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-900/20 rounded-xl border border-slate-800/40">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-200 block">Weekly Digest Email Report</span>
              <p className="text-[10px] text-slate-500">Receive custom charts compiling outstanding and closed tasks</p>
            </div>
            <button
              onClick={() => setWeeklyDigest(!weeklyDigest)}
              className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                weeklyDigest ? 'bg-blue-500' : 'bg-slate-800'
              }`}
              style={{ backgroundColor: weeklyDigest ? activeAccent : undefined }}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                weeklyDigest ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
