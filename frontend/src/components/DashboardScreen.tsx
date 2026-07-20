import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Zap, 
  Play, 
  Calendar, 
  ChevronRight, 
  Activity, 
  CheckSquare, 
  Star,
  Users
} from 'lucide-react';
import { Task, Project, UserProfile, CalendarEvent, AppSettings } from '../types';

interface DashboardScreenProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  projects: Project[];
  events: CalendarEvent[];
  settings: AppSettings;
  setActiveTab: (tab: string) => void;
  setSelectedTaskId: (id: string | null) => void;
}

export default function DashboardScreen({ 
  user, 
  setUser, 
  tasks, 
  setTasks, 
  projects, 
  events, 
  settings, 
  setActiveTab,
  setSelectedTaskId
}: DashboardScreenProps) {
  const [claimedBoost, setClaimedBoost] = useState(false);

  // Derive metrics
  const todayDateStr = "2026-07-20"; // standard context date
  const todayTasks = tasks.filter(t => t.dueDate === todayDateStr);
  const totalTodayCount = todayTasks.length;
  const completedTodayCount = todayTasks.filter(t => t.status === 'done').length;
  const todayProgressPercent = totalTodayCount > 0 ? Math.round((completedTodayCount / totalTodayCount) * 100) : 0;

  const urgentCount = tasks.filter(t => t.priority === 'urgent').length;
  const highCount = tasks.filter(t => t.priority === 'high').length;
  const mediumCount = tasks.filter(t => t.priority === 'medium').length;
  const lowCount = tasks.filter(t => t.priority === 'low').length;

  // Toggle task status
  const handleToggleTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening details
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newStatus = t.status === 'done' ? 'in_progress' : 'done';
        
        // Award XP if completed
        if (newStatus === 'done') {
          setUser(u => {
            const addedXp = t.storyPoints * 100;
            let newXp = u.xp + addedXp;
            let newLevel = u.level;
            if (newXp >= u.nextLevelXp) {
              newXp = newXp - u.nextLevelXp;
              newLevel += 1;
            }
            return {
              ...u,
              xp: newXp,
              level: newLevel,
              productivityScore: u.productivityScore + 25
            };
          });
        } else {
          // Subtract score
          setUser(u => ({
            ...u,
            productivityScore: Math.max(0, u.productivityScore - 20)
          }));
        }

        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const handleClaimBoost = () => {
    if (claimedBoost) return;
    setClaimedBoost(true);
    setUser(u => {
      const newXp = u.xp + 500;
      let newLevel = u.level;
      if (newXp >= u.nextLevelXp) {
        return {
          ...u,
          xp: newXp - u.nextLevelXp,
          level: newLevel + 1,
          productivityScore: u.productivityScore + 50
        };
      }
      return {
        ...u,
        xp: newXp,
        productivityScore: u.productivityScore + 50
      };
    });
  };

  const getAccentColorHex = () => {
    switch (settings.accentColor) {
      case 'purple': return '#a855f7';
      case 'emerald': return '#10b981';
      case 'amber': return '#f59e0b';
      case 'rose': return '#f43f5e';
      default: return '#3b82f6';
    }
  };

  const activeAccent = getAccentColorHex();

  // Filter today's meetings
  const todayEvents = events
    .filter(e => e.date === todayDateStr)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  return (
    <div className="flex-1 overflow-y-auto bg-[#07090d] text-slate-100 p-8 space-y-8 font-sans">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/50 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
            <span>VELOCITY WORKSPACE</span>
            <span>•</span>
            <span style={{ color: activeAccent }}>ACTIVE TERMINAL</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white mt-1">
            System Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Welcome back, {user.name}. Your active sprint has <span className="text-white font-medium">{tasks.filter(t=>t.status!=='done').length} outstanding tasks</span>.
          </p>
        </div>

        {/* Date Stamp HUD */}
        <div className="flex items-center gap-3 bg-[#0a0e17] border border-slate-800/80 px-4 py-2.5 rounded-xl">
          <Calendar className="w-4 h-4 text-slate-500" />
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-300 block font-mono">2026-07-20 UTC</span>
            <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Monday Operational Cycle</span>
          </div>
        </div>
      </div>

      {/* Grid of Key HUD Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Metric 1: Today's Tasks Progress Ring */}
        <div className="bg-[#0c0f16] border border-slate-800/60 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block">Today's Progress</span>
            <span className="text-2xl font-bold font-display block text-white">{completedTodayCount}/{totalTodayCount} Tasks</span>
            <span className="text-[10px] text-slate-400 font-mono block">
              {todayProgressPercent}% Completion quota
            </span>
          </div>

          <div className="relative h-16 w-16 flex items-center justify-center shrink-0">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                className="stroke-slate-800"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                className="transition-all duration-1000"
                style={{ stroke: activeAccent }}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={175.9}
                strokeDashoffset={175.9 - (175.9 * todayProgressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-mono font-bold text-slate-300">{todayProgressPercent}%</span>
          </div>
        </div>

        {/* Metric 2: Productivity score and streak */}
        <div className="bg-[#0c0f16] border border-slate-800/60 p-5 rounded-2xl relative overflow-hidden group">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block">Productivity Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-display text-white">{user.productivityScore}</span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +14.8%
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Velocity Index: Optimal Performance
            </p>
          </div>
          <div className="absolute top-3 right-3 text-slate-800 group-hover:text-slate-700 transition-colors">
            <Activity className="w-8 h-8 opacity-10" style={{ color: activeAccent }} />
          </div>
        </div>

        {/* Metric 3: Focus Timer Quick Launcher */}
        <div className="bg-[#0c0f16] border border-slate-800/60 p-5 rounded-2xl relative overflow-hidden group">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block">Focused Session Duration</span>
            <span className="text-2xl font-bold font-display block text-white">142 Mins</span>
            <span className="text-[10px] text-slate-400 font-mono block">
              Daily target: 180 Mins
            </span>
          </div>
          <button 
            onClick={() => setActiveTab('focus')}
            className="absolute bottom-4 right-4 h-8 w-8 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer shadow-md group-hover:scale-105"
            title="Resume Focus Session"
          >
            <Play className="w-3.5 h-3.5 fill-current" style={{ color: activeAccent }} />
          </button>
        </div>

        {/* Metric 4: Interactive Reward Booster */}
        <div className="bg-[#0c0f16] border border-slate-800/60 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block">Daily Catalyst Boost</span>
            <span className="text-xs text-slate-300 block font-mono">Claim today's focus bonus</span>
          </div>

          <button
            onClick={handleClaimBoost}
            disabled={claimedBoost}
            className={`w-full mt-3 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border text-[11px] font-mono font-medium transition-all cursor-pointer ${
              claimedBoost 
                ? 'bg-slate-900/60 text-slate-600 border-slate-800/40 cursor-not-allowed'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50 active:scale-95'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{claimedBoost ? 'BOOST SECURED (+500 XP)' : 'ACTIVATE CATALYST'}</span>
          </button>
        </div>
      </div>

      {/* Main Charts & Agenda Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Output Analytics Chart */}
        <div className="lg:col-span-2 bg-[#0c0f16] border border-slate-800/60 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" style={{ color: activeAccent }} /> Weekly Task Throughput
              </h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">Tasks resolved during previous 7 intervals</p>
            </div>
            
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800/40">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeAccent }}></span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Resolved tasks</span>
            </div>
          </div>

          {/* SVG Custom Area / Bar Chart */}
          <div className="h-56 relative w-full flex flex-col justify-between">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
              <div className="border-b border-slate-100 w-full"></div>
              <div className="border-b border-slate-100 w-full"></div>
              <div className="border-b border-slate-100 w-full"></div>
              <div className="border-b border-slate-100 w-full"></div>
            </div>

            {/* Interactive Bars with dynamic heights */}
            <div className="flex items-end justify-between h-44 px-4 z-10">
              {user.weeklyTaskCount.map((count, idx) => {
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const maxVal = 15;
                const pct = (count / maxVal) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="relative w-full flex justify-center">
                      {/* Tooltip on hover */}
                      <span className="absolute -top-8 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-all shadow-md z-20 pointer-events-none">
                        {count} tasks
                      </span>
                      {/* Visual Bar */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.05 }}
                        className="w-8 rounded-t-lg relative transition-all group-hover:brightness-110"
                        style={{ 
                          backgroundColor: activeAccent,
                          boxShadow: `0 4px 15px ${activeAccent}1a`
                        }}
                      >
                        {/* Overlay inner highlight */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-white/20 rounded-t-lg"></div>
                      </motion.div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
                      {days[idx]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Today's Sync & Focus Timeline */}
        <div className="bg-[#0c0f16] border border-slate-800/60 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" /> System Agenda
              </h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">Today's Scheduled Events</p>
            </div>
            <button 
              onClick={() => setActiveTab('calendar')}
              className="text-xs font-mono text-slate-500 hover:text-slate-300 flex items-center gap-0.5 cursor-pointer"
            >
              GRID <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
            {todayEvents.length > 0 ? (
              todayEvents.map((evt) => (
                <div 
                  key={evt.id} 
                  className="flex items-start gap-3.5 p-2.5 bg-slate-900/40 hover:bg-slate-900/80 rounded-xl border border-slate-800/40 hover:border-slate-800 transition-all group"
                >
                  <div className="flex flex-col items-center mt-1 shrink-0">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: evt.color }} />
                    <span className="w-0.5 bg-slate-800 h-8 mt-1 group-last:hidden" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors block truncate">
                        {evt.title}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800/30 shrink-0">
                        {evt.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5 uppercase">
                      <span>{evt.type}</span>
                      {evt.duration && (
                        <>
                          <span>•</span>
                          <span>{evt.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-600 font-mono text-xs">
                No active scheduled items today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Priority Distribution & Recent Tasks Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Priority Distribution */}
        <div className="bg-[#0c0f16] border border-slate-800/60 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-yellow-500" /> Priorities Payload
            </h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase">Outstanding tasks sorted by urgency weights</p>
          </div>

          <div className="space-y-4 my-6">
            {/* Urgent */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-red-400 flex items-center gap-1">🛑 URGENT</span>
                <span className="text-slate-400">{urgentCount} tasks</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: `${tasks.length ? (urgentCount/tasks.length)*100 : 0}%` }} />
              </div>
            </div>

            {/* High */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-amber-400 flex items-center gap-1">⚠️ HIGH</span>
                <span className="text-slate-400">{highCount} tasks</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${tasks.length ? (highCount/tasks.length)*100 : 0}%` }} />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-blue-400 flex items-center gap-1">⚡ MEDIUM</span>
                <span className="text-slate-400">{mediumCount} tasks</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${tasks.length ? (mediumCount/tasks.length)*100 : 0}%` }} />
              </div>
            </div>

            {/* Low */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-emerald-400 flex items-center gap-1">🛡️ LOW</span>
                <span className="text-slate-400">{lowCount} tasks</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${tasks.length ? (lowCount/tasks.length)*100 : 0}%` }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/40 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              Total active backlog load: {tasks.length} tasks
            </span>
          </div>
        </div>

        {/* Right 2 Columns: Recent Hot Backlogs */}
        <div className="lg:col-span-2 bg-[#0c0f16] border border-slate-800/60 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-500" style={{ color: activeAccent }} /> Active Sprint Items
                </h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">Primary developer task load</p>
              </div>
              <button 
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-mono text-slate-500 hover:text-slate-300 flex items-center gap-0.5 cursor-pointer"
              >
                KANBAN <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {tasks.slice(0, 4).map((task) => {
                const isCompleted = task.status === 'done';
                return (
                  <div
                    key={task.id}
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      setActiveTab('task-detail');
                    }}
                    className={`p-3 bg-[#090c12]/70 hover:bg-slate-900/60 border border-slate-800/50 hover:border-slate-800 rounded-xl transition-all flex items-center justify-between gap-4 group cursor-pointer ${
                      isCompleted ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Custom styled checkbox */}
                      <button
                        onClick={(e) => handleToggleTask(task.id, e)}
                        className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                          isCompleted 
                            ? 'bg-emerald-500/20 border-emerald-500/80 text-emerald-400' 
                            : 'border-slate-700 hover:border-slate-500 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <div className="min-w-0">
                        <span className={`text-xs font-semibold block truncate text-slate-200 group-hover:text-white ${
                          isCompleted ? 'line-through text-slate-500' : ''
                        }`}>
                          {task.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] font-mono text-slate-500 uppercase">{task.projectName}</span>
                          <span className="text-[10px] text-slate-600">•</span>
                          <span className="text-[9px] font-mono text-slate-500 uppercase">SP: {task.storyPoints}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Priority Tag */}
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                        task.priority === 'urgent' 
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : task.priority === 'high'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : task.priority === 'medium'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {task.priority.toUpperCase()}
                      </span>

                      {/* Assignee Avatar */}
                      <img 
                        src={task.assignee.avatar} 
                        alt={task.assignee.name} 
                        className="h-6.5 w-6.5 rounded-full object-cover border border-slate-800/80"
                        title={`Assigned to ${task.assignee.name}`}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border-t border-slate-800/40 pt-4 mt-4 flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase">
            <span>Operational State: Steady</span>
            <span style={{ color: activeAccent }}>SYSTEM LOCK v2.4</span>
          </div>
        </div>
      </div>

    </div>
  );
}
