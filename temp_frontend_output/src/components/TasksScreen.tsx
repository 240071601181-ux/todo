import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Kanban, 
  List, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  UserPlus, 
  FolderPlus,
  HelpCircle,
  Tag
} from 'lucide-react';
import { Task, Project, TaskStatus, TaskPriority } from '../types';

interface TasksScreenProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  projects: Project[];
  setSelectedTaskId: (id: string | null) => void;
  setActiveTab: (tab: string) => void;
  accentColor: string;
}

export default function TasksScreen({ 
  tasks, 
  setTasks, 
  projects, 
  setSelectedTaskId, 
  setActiveTab,
  accentColor
}: TasksScreenProps) {
  
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newProjId, setNewProjId] = useState(projects[0]?.id || '');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newStoryPoints, setNewStoryPoints] = useState(3);
  const [newTags, setNewTags] = useState('');

  // Filtering logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesProject = selectedProjectFilter === 'all' || task.projectId === selectedProjectFilter;
    const matchesPriority = selectedPriorityFilter === 'all' || task.priority === selectedPriorityFilter;

    return matchesSearch && matchesProject && matchesPriority;
  });

  // State manipulation handlers
  const handleMoveStatus = (taskId: string, targetStatus: TaskStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: targetStatus };
      }
      return t;
    }));
  };

  const handleToggleDone = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: t.status === 'done' ? 'in_progress' : 'done' };
      }
      return t;
    }));
  };

  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to terminate this task scope?")) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const matchedProject = projects.find(p => p.id === newProjId);
    
    const created: Task = {
      id: `task-${Date.now()}`,
      title: newTitle,
      description: newDesc || 'No extended documentation compiled.',
      status: 'todo',
      priority: newPriority,
      dueDate: "2026-07-20", // Today's cycle
      assignee: {
        name: "Alex Carter",
        role: "Lead Architect",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120"
      },
      projectId: newProjId,
      projectName: matchedProject ? matchedProject.name : 'Unassigned Root',
      storyPoints: newStoryPoints,
      tags: newTags ? newTags.split(',').map(s => s.trim()).filter(Boolean) : ['Custom'],
      milestones: [],
      comments: []
    };

    setTasks(prev => [created, ...prev]);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewPriority('medium');
    setNewStoryPoints(3);
    setNewTags('');
    setShowAddModal(false);
  };

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

  // Render a single task card
  const renderTaskCard = (task: Task) => {
    const isCompleted = task.status === 'done';
    
    return (
      <motion.div
        key={task.id}
        layoutId={task.id}
        onClick={() => {
          setSelectedTaskId(task.id);
          setActiveTab('task-detail');
        }}
        className={`p-4 bg-[#0c0f16]/90 border border-slate-800/80 hover:border-slate-700/80 rounded-xl shadow-lg transition-all flex flex-col justify-between gap-4 group cursor-pointer relative ${
          isCompleted ? 'opacity-60 border-slate-900/60 bg-slate-950/20' : ''
        }`}
      >
        <div>
          {/* Card Top Row */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <span className="text-[9px] font-mono tracking-wider text-slate-500 uppercase truncate max-w-[120px]">
              {task.projectName}
            </span>
            <div className="flex items-center gap-1">
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
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
            </div>
          </div>

          {/* Title */}
          <h4 className={`text-xs font-semibold text-slate-200 group-hover:text-white transition-colors ${
            isCompleted ? 'line-through text-slate-500' : ''
          }`}>
            {task.title}
          </h4>

          {/* Description Snippet */}
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {task.tags.map((tag, i) => (
              <span key={i} className="text-[9px] font-mono bg-slate-900/80 text-slate-500 border border-slate-800/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Tag className="w-2.5 h-2.5 shrink-0" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer Row */}
        <div className="flex justify-between items-center border-t border-slate-800/40 pt-3 mt-1">
          {/* Assignee Avatar */}
          <div className="flex items-center gap-1.5">
            <img 
              src={task.assignee.avatar} 
              alt={task.assignee.name} 
              className="h-6 w-6 rounded-full border border-slate-800/80 object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="text-[10px] font-mono text-slate-500">SP: {task.storyPoints}</span>
          </div>

          {/* Navigation/Actions controls inside Kanban cards */}
          <div className="flex items-center gap-1 shrink-0">
            {task.status !== 'todo' && (
              <button
                onClick={(e) => handleMoveStatus(task.id, task.status === 'done' ? 'in_progress' : 'todo', e)}
                className="p-1 hover:bg-slate-900 rounded text-slate-500 hover:text-white transition-colors cursor-pointer"
                title="Move Back"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={(e) => handleToggleDone(task.id, e)}
              className={`p-1 rounded transition-colors cursor-pointer ${
                isCompleted ? 'text-emerald-400 hover:bg-emerald-950/20' : 'text-slate-500 hover:text-emerald-400 hover:bg-slate-900'
              }`}
              title={isCompleted ? 'Mark Active' : 'Mark Completed'}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>

            {task.status !== 'done' && (
              <button
                onClick={(e) => handleMoveStatus(task.id, task.status === 'todo' ? 'in_progress' : 'done', e)}
                className="p-1 hover:bg-slate-900 rounded text-slate-500 hover:text-white transition-colors cursor-pointer"
                title="Move Forward"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={(e) => handleDeleteTask(task.id, e)}
              className="p-1 hover:bg-slate-900 rounded text-slate-500 hover:text-red-400 transition-colors cursor-pointer ml-1"
              title="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#07090d] text-slate-100 p-8 space-y-8 font-sans">
      
      {/* Top Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/50 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
            <span>OPERATIONAL PIPELINES</span>
            <span>•</span>
            <span style={{ color: activeAccent }}>SPRINT BACKLOG</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white mt-1">
            Today's Tasks
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage, stage, and compile active engineering scopes across your active timelines.
          </p>
        </div>

        {/* View Switches & Action button */}
        <div className="flex items-center gap-3">
          {/* Toggle View Layout */}
          <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                viewMode === 'kanban' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> KANBAN
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" /> LIST
            </button>
          </div>

          {/* Scaffold Task Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 text-white text-xs font-mono font-semibold py-2 px-4 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
            style={{ backgroundColor: activeAccent }}
          >
            <Plus className="w-4 h-4" /> SCAFFOLD TASK
          </button>
        </div>
      </div>

      {/* Interactive Filters Grid */}
      <div className="bg-[#0a0d14]/80 border border-slate-800/60 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search pipelines, scopes, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#07090d] border border-slate-800/80 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all font-sans"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Project Filter */}
          <div className="flex items-center gap-1.5 bg-[#07090d] border border-slate-800/80 px-2.5 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 font-mono focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0a0d14]">ALL PROJECTS</option>
              {projects.map(p => (
                <option key={p.id} value={p.id} className="bg-[#0a0d14]">{p.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-[#07090d] border border-slate-800/80 px-2.5 py-1.5 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 font-mono focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0a0d14]">ALL PRIORITIES</option>
              <option value="urgent" className="bg-[#0a0d14]">🛑 URGENT</option>
              <option value="high" className="bg-[#0a0d14]">⚠️ HIGH</option>
              <option value="medium" className="bg-[#0a0d14]">⚡ MEDIUM</option>
              <option value="low" className="bg-[#0a0d14]">🛡️ LOW</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Board Representation */}
      {viewMode === 'kanban' ? (
        /* Kanban View columns grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TO DO column */}
          <div className="bg-[#0a0d14]/40 border border-slate-800/40 rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-800/40 pb-2">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> TO DO
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800/40 px-2 py-0.5 rounded-full">
                {filteredTasks.filter(t => t.status === 'todo').length}
              </span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {filteredTasks.filter(t => t.status === 'todo').map(renderTaskCard)}
              {filteredTasks.filter(t => t.status === 'todo').length === 0 && (
                <div className="text-center py-10 text-slate-600 font-mono text-xs">
                  Clean backlog column.
                </div>
              )}
            </div>
          </div>

          {/* IN PROGRESS column */}
          <div className="bg-[#0a0d14]/40 border border-slate-800/40 rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-800/40 pb-2">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500" /> IN PROGRESS
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800/40 px-2 py-0.5 rounded-full">
                {filteredTasks.filter(t => t.status === 'in_progress').length}
              </span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {filteredTasks.filter(t => t.status === 'in_progress').map(renderTaskCard)}
              {filteredTasks.filter(t => t.status === 'in_progress').length === 0 && (
                <div className="text-center py-10 text-slate-600 font-mono text-xs">
                  No active in-flight targets.
                </div>
              )}
            </div>
          </div>

          {/* DONE column */}
          <div className="bg-[#0a0d14]/40 border border-slate-800/40 rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-800/40 pb-2">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> DONE
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800/40 px-2 py-0.5 rounded-full">
                {filteredTasks.filter(t => t.status === 'done').length}
              </span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {filteredTasks.filter(t => t.status === 'done').map(renderTaskCard)}
              {filteredTasks.filter(t => t.status === 'done').length === 0 && (
                <div className="text-center py-10 text-slate-600 font-mono text-xs">
                  No finalized compilations yet.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* List View layout */
        <div className="bg-[#0c0f16] border border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800/80 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Pipeline Item</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Project Scope</th>
                  <th className="py-4 px-4">Urgency</th>
                  <th className="py-4 px-4">Assignee</th>
                  <th className="py-4 px-4">Story Points</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredTasks.map((task) => {
                  const isCompleted = task.status === 'done';
                  return (
                    <tr 
                      key={task.id}
                      onClick={() => {
                        setSelectedTaskId(task.id);
                        setActiveTab('task-detail');
                      }}
                      className="hover:bg-slate-900/40 cursor-pointer transition-colors group text-xs text-slate-300"
                    >
                      <td className="py-4 px-6 font-semibold text-slate-200">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => handleToggleDone(task.id, e)}
                            className={`h-5 w-5 rounded flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                              isCompleted 
                                ? 'bg-emerald-500/20 border-emerald-500/80 text-emerald-400' 
                                : 'border-slate-700 hover:border-slate-500 text-transparent'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <span className={isCompleted ? 'line-through text-slate-500' : 'group-hover:text-white'}>
                            {task.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                          task.status === 'todo' 
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : task.status === 'in_progress'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400 font-mono text-[10px] uppercase">
                        {task.projectName}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${
                          task.priority === 'urgent' 
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : task.priority === 'high'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : task.priority === 'medium'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <img 
                            src={task.assignee.avatar} 
                            alt={task.assignee.name} 
                            className="h-6 w-6 rounded-full object-cover border border-slate-800/80"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-slate-400">{task.assignee.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                        {task.storyPoints} SP
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={(e) => handleDeleteTask(task.id, e)}
                          className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Task modal component */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-[#0c1017] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
              <h3 className="text-sm font-semibold text-slate-200 uppercase font-mono tracking-wider">
                Scaffold New Pipeline Scope
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-xs text-slate-500 hover:text-slate-300 font-mono cursor-pointer"
              >
                ESC // CLOSE
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement real-time logs aggregation buffer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#07090d] border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all font-sans"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Documentation / Description</label>
                <textarea
                  rows={3}
                  placeholder="Compile explicit engineering instructions for this milestone..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#07090d] border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all font-sans resize-none"
                />
              </div>

              {/* Project select & priority row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Project Scope</label>
                  <select
                    value={newProjId}
                    onChange={(e) => setNewProjId(e.target.value)}
                    className="w-full bg-[#07090d] border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-300 font-mono focus:outline-none cursor-pointer"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Urgency Weight</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full bg-[#07090d] border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-300 font-mono focus:outline-none cursor-pointer"
                  >
                    <option value="low">🛡️ LOW</option>
                    <option value="medium">⚡ MEDIUM</option>
                    <option value="high">⚠️ HIGH</option>
                    <option value="urgent">🛑 URGENT</option>
                  </select>
                </div>
              </div>

              {/* Story points & tags row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Story Weight (Points)</label>
                  <input
                    type="number"
                    min={1}
                    max={21}
                    value={newStoryPoints}
                    onChange={(e) => setNewStoryPoints(Number(e.target.value))}
                    className="w-full bg-[#07090d] border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Infra, Redis, WebGL"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full bg-[#07090d] border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-slate-800/60 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-900/40 text-slate-400 text-xs font-mono rounded-xl cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white text-xs font-mono font-semibold rounded-xl cursor-pointer"
                  style={{ backgroundColor: activeAccent }}
                >
                  COMPILE SCOPE
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
