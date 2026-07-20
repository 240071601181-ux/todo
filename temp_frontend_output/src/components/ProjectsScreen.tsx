import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Activity, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Send, 
  ArrowLeft, 
  Sliders, 
  AlertOctagon,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Project, Task } from '../types';

interface ProjectsScreenProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  tasks: Task[];
  setSelectedTaskId: (id: string | null) => void;
  setActiveTab: (tab: string) => void;
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
  accentColor: string;
}

export default function ProjectsScreen({
  projects,
  setProjects,
  tasks,
  setSelectedTaskId,
  setActiveTab,
  currentProjectId,
  setCurrentProjectId,
  accentColor
}: ProjectsScreenProps) {
  
  const [activeTabSub, setActiveTabSub] = useState<'backlog' | 'active_sprint' | 'qa_review'>('active_sprint');
  const [pulseInput, setPulseInput] = useState('');
  const [showStatusControls, setShowStatusControls] = useState(false);

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

  // If a specific project is selected, render its detailed view!
  const selectedProj = projects.find(p => p.id === currentProjectId);

  const handleUpdateProgress = (projId: string, val: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projId) {
        return { ...p, progress: val };
      }
      return p;
    }));
  };

  const handleUpdateStatus = (projId: string, status: Project['status']) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projId) {
        return { ...p, status };
      }
      return p;
    }));
  };

  const handleAddPulseAction = (projId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!pulseInput.trim()) return;

    setProjects(prev => prev.map(p => {
      if (p.id === projId) {
        const newFeedItem = {
          id: `feed-${Date.now()}`,
          user: "Alex Carter (You)",
          action: "registered operational log:",
          target: pulseInput,
          time: "Just now"
        };
        return {
          ...p,
          pulseFeed: [newFeedItem, ...p.pulseFeed]
        };
      }
      return p;
    }));

    setPulseInput('');
  };

  if (selectedProj) {
    // RENDER DETAILED VIEW (e.g. Solaris Redact Engine, Alpha Nexus Core)
    const projectTasks = tasks.filter(t => t.projectId === selectedProj.id);
    const backlogTasks = projectTasks.filter(t => t.status === 'todo');
    const activeTasks = projectTasks.filter(t => t.status === 'in_progress');
    const doneTasks = projectTasks.filter(t => t.status === 'done');

    const currentTabTasks = 
      activeTabSub === 'backlog' ? backlogTasks :
      activeTabSub === 'active_sprint' ? activeTasks :
      doneTasks;

    return (
      <div className="flex-1 overflow-y-auto bg-[#07090d] text-slate-100 p-8 space-y-8 font-sans">
        
        {/* Back Link Row */}
        <div className="flex items-center justify-between border-b border-slate-800/50 pb-5">
          <button 
            onClick={() => setCurrentProjectId(null)}
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> REVERT TO DIRECTORY
          </button>

          <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800/60 px-3 py-1 rounded-full uppercase">
            Project Node: {selectedProj.id}
          </span>
        </div>

        {/* Project Header Summary Card */}
        <div className="bg-[#0c0f16] border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden">
          {/* Subtle colored glow corner */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl" style={{ backgroundColor: selectedProj.color }}></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1.5 flex-1">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase block">
                {selectedProj.category}
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedProj.color }} />
                {selectedProj.name}
              </h2>
              <p className="text-slate-400 text-xs max-w-2xl">
                {selectedProj.description}
              </p>
            </div>

            {/* Micro stats circle/bar */}
            <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800/40 p-4 rounded-xl shrink-0">
              <div className="text-center">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">Completion</span>
                <span className="text-xl font-bold font-display text-white">{selectedProj.progress}%</span>
              </div>
              <div className="w-12 bg-slate-800 h-1 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${selectedProj.progress}%`, backgroundColor: selectedProj.color }} />
              </div>
            </div>
          </div>

          {/* Quick HUD controls for live preview toggles */}
          <div className="mt-5 pt-5 border-t border-slate-800/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-mono text-slate-400">STATUS:</span>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border uppercase ${
                selectedProj.status === 'planning' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                selectedProj.status === 'active' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                selectedProj.status === 'review' ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' :
                'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}>
                ● {selectedProj.status}
              </span>

              <span className="text-slate-600 font-mono text-[10px]">•</span>

              <span className="text-[10px] font-mono text-slate-400">DEADLINE:</span>
              <span className="text-[10px] font-mono text-slate-300">{selectedProj.dueDate}</span>
            </div>

            {/* Slider triggers */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStatusControls(!showStatusControls)}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" /> STAGE CALIBRATOR
              </button>
            </div>
          </div>

          {showStatusControls && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-4 p-4 bg-[#07090d] border border-slate-800/80 rounded-xl space-y-4"
            >
              <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Calibration Matrix (Simulate Project Evolution)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Progress Adjuster */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>PROGRESS SCOPE</span>
                    <span>{selectedProj.progress}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={selectedProj.progress}
                    onChange={(e) => handleUpdateProgress(selectedProj.id, Number(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Status selector */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-slate-400 block">SENSE STATE SELECTOR</span>
                  <div className="flex flex-wrap gap-2">
                    {['planning', 'active', 'review', 'completed'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selectedProj.id, st as Project['status'])}
                        className={`px-3 py-1 rounded text-[10px] font-mono uppercase transition-colors cursor-pointer ${
                          selectedProj.status === st 
                            ? 'bg-slate-800 text-white border border-slate-700' 
                            : 'bg-slate-950 text-slate-500 border border-slate-900 hover:text-slate-300'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Content Splitting: Left 2 Columns Tasks / Right Column Stakeholders and Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Columns - Backlog / Active / Done lists */}
          <div className="lg:col-span-2 space-y-5">
            {/* Tab choices */}
            <div className="flex border-b border-slate-800/60 pb-1.5">
              <button
                onClick={() => setActiveTabSub('backlog')}
                className={`px-4 py-2 text-xs font-mono tracking-wider transition-all cursor-pointer relative ${
                  activeTabSub === 'backlog' ? 'text-white font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span>BACKLOG ({backlogTasks.length})</span>
                {activeTabSub === 'backlog' && (
                  <span className="absolute bottom-[-1.5px] inset-x-0 h-0.5" style={{ backgroundColor: selectedProj.color }} />
                )}
              </button>

              <button
                onClick={() => setActiveTabSub('active_sprint')}
                className={`px-4 py-2 text-xs font-mono tracking-wider transition-all cursor-pointer relative ${
                  activeTabSub === 'active_sprint' ? 'text-white font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span>ACTIVE SPRINT ({activeTasks.length})</span>
                {activeTabSub === 'active_sprint' && (
                  <span className="absolute bottom-[-1.5px] inset-x-0 h-0.5" style={{ backgroundColor: selectedProj.color }} />
                )}
              </button>

              <button
                onClick={() => setActiveTabSub('qa_review')}
                className={`px-4 py-2 text-xs font-mono tracking-wider transition-all cursor-pointer relative ${
                  activeTabSub === 'qa_review' ? 'text-white font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span>COMPLETED ({doneTasks.length})</span>
                {activeTabSub === 'qa_review' && (
                  <span className="absolute bottom-[-1.5px] inset-x-0 h-0.5" style={{ backgroundColor: selectedProj.color }} />
                )}
              </button>
            </div>

            {/* List representation */}
            <div className="space-y-3">
              {currentTabTasks.length > 0 ? (
                currentTabTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTaskId(t.id);
                      setActiveTab('task-detail');
                    }}
                    className="p-4 bg-[#0c0f16]/90 border border-slate-800/60 hover:border-slate-800 hover:bg-slate-900/40 rounded-xl transition-all flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: selectedProj.color }} />
                      <div>
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors block">
                          {t.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block mt-0.5">
                          Points: {t.storyPoints} SP • Priority: {t.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <img 
                        src={t.assignee.avatar} 
                        alt={t.assignee.name} 
                        className="h-6 w-6 rounded-full object-cover border border-slate-800/80"
                        referrerPolicy="no-referrer"
                      />
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-600 font-mono text-xs">
                  No compiling items inside this category.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Stakeholders and Pulse Feeds */}
          <div className="space-y-6">
            {/* Stakeholders card */}
            <div className="bg-[#0c0f16] border border-slate-800/60 p-5 rounded-2xl">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" /> Stakeholders
              </h3>
              <div className="space-y-3">
                {selectedProj.stakeholders.map((person, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/40">
                    <img 
                      src={person.avatar} 
                      alt={person.name} 
                      className="h-8 w-8 rounded-full object-cover shrink-0 border border-slate-800/80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-slate-200 block truncate leading-tight">{person.name}</span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block truncate mt-0.5">{person.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Pulse Feed activity */}
            <div className="bg-[#0c0f16] border border-slate-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400 animate-pulse" /> Project Pulse Feed
                </h3>
              </div>

              {/* Dynamic activity submission */}
              <form onSubmit={(e) => handleAddPulseAction(selectedProj.id, e)} className="relative">
                <input
                  type="text"
                  placeholder="Record incident or operational event..."
                  value={pulseInput}
                  onChange={(e) => setPulseInput(e.target.value)}
                  className="w-full bg-[#07090d] border border-slate-800/80 rounded-xl py-2 pl-3 pr-9 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/40 transition-all font-sans"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1 text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* List */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {selectedProj.pulseFeed.map((item) => (
                  <div key={item.id} className="text-xs p-2.5 bg-slate-900/20 border border-slate-800/30 rounded-xl">
                    <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
                      <span>{item.user}</span>
                      <span>{item.time}</span>
                    </div>
                    <p className="text-slate-300">
                      <span className="text-slate-500 italic font-mono">{item.action} </span>
                      <span className="font-medium text-slate-200">{item.target}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // RENDER DIRECTORY / ARCHITECTURE LIST (Default project view)
  return (
    <div className="flex-1 overflow-y-auto bg-[#07090d] text-slate-100 p-8 space-y-8 font-sans">
      
      {/* Top Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/50 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
            <span>VELOCITY DIRECTORY</span>
            <span>•</span>
            <span style={{ color: activeAccent }}>ACTIVE BLUEPRINTS</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white mt-1">
            Active Projects
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Comprehensive developer pipelines, build stages, and milestone feeds.
          </p>
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => {
          const matchedTasksCount = tasks.filter(t => t.projectId === proj.id).length;
          
          return (
            <div
              key={proj.id}
              onClick={() => setCurrentProjectId(proj.id)}
              className="bg-[#0c0f16]/90 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 transition-all shadow-lg flex flex-col justify-between gap-6 cursor-pointer group relative overflow-hidden"
            >
              {/* Subtle top horizontal color bar */}
              <div className="absolute top-0 inset-x-0 h-1" style={{ backgroundColor: proj.color }}></div>

              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                    {proj.category}
                  </span>
                  
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                    proj.status === 'planning' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                    proj.status === 'active' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                    proj.status === 'review' ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' :
                    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {proj.status}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-slate-200 group-hover:text-white transition-colors flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: proj.color }} />
                  {proj.name}
                </h3>

                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Progress HUD segment */}
              <div className="border-t border-slate-800/40 pt-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>Sprint completeness</span>
                  <span className="text-slate-200 font-bold">{proj.progress}%</span>
                </div>
                {/* Custom bar */}
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${proj.progress}%`, backgroundColor: proj.color }} />
                </div>

                {/* Team + Task Counts */}
                <div className="flex justify-between items-center mt-1">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {proj.stakeholders.slice(0, 3).map((person, i) => (
                      <img 
                        key={i} 
                        src={person.avatar} 
                        alt={person.name} 
                        className="h-6 w-6 rounded-full object-cover border border-slate-900 shrink-0"
                        title={person.name}
                        referrerPolicy="no-referrer"
                      />
                    ))}
                    {proj.stakeholders.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[8px] font-mono text-slate-400 shrink-0">
                        +{proj.stakeholders.length - 3}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {matchedTasksCount} Active items
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
