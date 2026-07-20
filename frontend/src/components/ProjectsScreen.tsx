import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, Activity, Clock, CheckCircle2, ChevronRight, Send, ArrowLeft, Sliders,
  TrendingUp, Plus, Pencil, Trash2, X, BarChart3, Calendar, ListTodo
} from 'lucide-react';
import { Project, Task, UserProfile } from '../types';

interface ProjectsScreenProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  tasks: Task[];
  onCreateProject: (data: {
    name: string; description?: string; color?: string; status?: string;
    progress?: number; dueDate?: string | null; category?: string;
    stakeholders?: { name: string; avatar: string; role: string }[];
  }) => Promise<void>;
  onUpdateProject: (id: string, data: {
    name?: string; description?: string; color?: string; status?: string;
    progress?: number; dueDate?: string | null; category?: string;
    stakeholders?: { name: string; avatar: string; role: string }[];
  }) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  setSelectedTaskId: (id: string | null) => void;
  setActiveTab: (tab: string) => void;
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
  accentColor: string;
  currentUser: UserProfile;
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120';
const COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6', '#ec4899'];

export default function ProjectsScreen({
  projects, setProjects, tasks, onCreateProject, onUpdateProject, onDeleteProject,
  setSelectedTaskId, setActiveTab, currentProjectId, setCurrentProjectId, accentColor, currentUser
}: ProjectsScreenProps) {
  const [activeTabSub, setActiveTabSub] = useState<'backlog' | 'active_sprint' | 'qa_review'>('active_sprint');
  const [pulseInput, setPulseInput] = useState('');
  const [showStatusControls, setShowStatusControls] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newProject, setNewProject] = useState<{ name: string; description: string; color: string; status: Project['status']; category: string; dueDate: string; progress: number }>({ name: '', description: '', color: '#3b82f6', status: 'active', category: '', dueDate: '', progress: 0 });
  const [editForm, setEditForm] = useState<{ name: string; description: string; color: string; status: Project['status']; category: string; dueDate: string; progress: number }>({ name: '', description: '', color: '#3b82f6', status: 'active', category: '', dueDate: '', progress: 0 });

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
  const selectedProj = projects.find(p => p.id === currentProjectId);

  const handleUpdateProgress = (projId: string, val: number) => {
    setProjects(prev => prev.map(p => p.id === projId ? { ...p, progress: val } : p));
    onUpdateProject(projId, { progress: val })
  };

  const handleUpdateStatus = (projId: string, status: Project['status']) => {
    setProjects(prev => prev.map(p => p.id === projId ? { ...p, status } : p));
    onUpdateProject(projId, { status })
  };

  const handleAddPulseAction = (projId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!pulseInput.trim()) return;
    setProjects(prev => prev.map(p => {
      if (p.id === projId) {
        return {
          ...p,
          pulseFeed: [{
            id: `feed-${Date.now()}`,
            user: "Alex Carter (You)",
            action: "registered operational log:",
            target: pulseInput,
            time: "Just now"
          }, ...p.pulseFeed]
        };
      }
      return p;
    }));
    setPulseInput('');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    await onCreateProject({
      name: newProject.name,
      description: newProject.description,
      color: newProject.color,
      status: newProject.status,
      category: newProject.category,
      dueDate: newProject.dueDate || null,
      progress: newProject.progress,
    });
    setShowCreateModal(false);
    setNewProject({ name: '', description: '', color: '#3b82f6', status: 'active', category: '', dueDate: '', progress: 0 });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProj) return;
    await onUpdateProject(selectedProj.id, {
      name: editForm.name,
      description: editForm.description,
      color: editForm.color,
      status: editForm.status,
      category: editForm.category,
      dueDate: editForm.dueDate || null,
      progress: editForm.progress,
    });
    setShowEditModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProj) return;
    await onDeleteProject(selectedProj.id);
    setShowDeleteConfirm(false);
    setCurrentProjectId(null);
  };

  const openEditModal = () => {
    if (!selectedProj) return;
    setEditForm({
      name: selectedProj.name,
      description: selectedProj.description,
      color: selectedProj.color,
      status: selectedProj.status,
      category: selectedProj.category,
      dueDate: selectedProj.dueDate,
      progress: selectedProj.progress,
    });
    setShowEditModal(true);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProj || !newMemberName.trim() || !newMemberRole.trim()) return;
    const updated = [...selectedProj.stakeholders, {
      name: newMemberName.trim(),
      role: newMemberRole.trim(),
      avatar: DEFAULT_AVATAR,
    }];
    setProjects(prev => prev.map(p =>
      p.id === selectedProj.id ? { ...p, stakeholders: updated } : p,
    ));
    onUpdateProject(selectedProj.id, { stakeholders: updated });
    setNewMemberName('');
    setNewMemberRole('');
    setShowAddMember(false);
  };

  const handleRemoveMember = (idx: number) => {
    if (!selectedProj) return;
    const updated = selectedProj.stakeholders.filter((_, i) => i !== idx);
    setProjects(prev => prev.map(p =>
      p.id === selectedProj.id ? { ...p, stakeholders: updated } : p,
    ));
    onUpdateProject(selectedProj.id, { stakeholders: updated });
  };

  if (selectedProj) {
    const projectTasks = tasks.filter(t => t.projectId === selectedProj.id);
    const backlogTasks = projectTasks.filter(t => t.status === 'todo');
    const activeTasks = projectTasks.filter(t => t.status === 'in_progress');
    const doneTasks = projectTasks.filter(t => t.status === 'done');
    const currentTabTasks =
      activeTabSub === 'backlog' ? backlogTasks :
      activeTabSub === 'active_sprint' ? activeTasks : doneTasks;

    const totalTasks = projectTasks.length;
    const completedCount = doneTasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
    const upcomingDeadlines = projectTasks
      .filter(t => t.dueDate && new Date(t.dueDate) > new Date())
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);

    return (
      <div className="flex-1 overflow-y-auto bg-[#07090d] text-slate-100 p-8 space-y-8 font-sans">

        {/* Back Link Row with Edit/Delete */}
        <div className="flex items-center justify-between border-b border-slate-800/50 pb-5">
          <button
            onClick={() => setCurrentProjectId(null)}
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> REVERT TO DIRECTORY
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={openEditModal}
              className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" /> EDIT
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1 text-xs font-mono text-red-400 hover:text-red-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> DELETE
            </button>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800/60 px-3 py-1 rounded-full uppercase ml-2">
              Project Node: {selectedProj.id.slice(0, 8)}
            </span>
          </div>
        </div>

        {/* Project Header Summary Card */}
        <div className="bg-[#0c0f16] border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden">
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

        {/* Project Statistics Bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#0c0f16] border border-slate-800/60 rounded-xl p-4 flex items-center gap-3">
            <ListTodo className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase block">Total Tasks</span>
              <span className="text-lg font-bold text-white">{totalTasks}</span>
            </div>
          </div>
          <div className="bg-[#0c0f16] border border-slate-800/60 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase block">Completed</span>
              <span className="text-lg font-bold text-white">{completedCount}</span>
            </div>
          </div>
          <div className="bg-[#0c0f16] border border-slate-800/60 rounded-xl p-4 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase block">Completion Rate</span>
              <span className="text-lg font-bold text-white">{completionRate}%</span>
            </div>
          </div>
          <div className="bg-[#0c0f16] border border-slate-800/60 rounded-xl p-4 flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase block">Open Tasks</span>
              <span className="text-lg font-bold text-white">{totalTasks - completedCount}</span>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        {upcomingDeadlines.length > 0 && (
          <div className="bg-[#0c0f16] border border-slate-800/60 rounded-2xl p-5">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" /> Upcoming Deadlines
            </h3>
            <div className="space-y-2">
              {upcomingDeadlines.map((t) => (
                <div key={t.id} className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/40">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: selectedProj.color }} />
                  <span className="flex-1 truncate">{t.title}</span>
                  <span className="font-mono text-[10px] text-slate-500 shrink-0">{t.dueDate}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    t.priority === 'urgent' ? 'bg-red-500/15 text-red-400' :
                    t.priority === 'high' ? 'bg-amber-500/15 text-amber-400' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Splitting */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Columns - Tasks */}
          <div className="lg:col-span-2 space-y-5">
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

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-[#0c0f16] border border-slate-800/60 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" /> Stakeholders
                </h3>
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                  title="Add Member"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {showAddMember && (
                <form onSubmit={handleAddMember} className="mb-4 p-3 bg-[#07090d] border border-slate-800/80 rounded-xl space-y-2">
                  <input
                    type="text"
                    placeholder="Member name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full bg-[#0a0d14] border border-slate-800/80 rounded-lg py-1.5 px-2.5 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/40 font-sans"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Lead Engineer)"
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="w-full bg-[#0a0d14] border border-slate-800/80 rounded-lg py-1.5 px-2.5 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/40 font-sans"
                    required
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button type="button" onClick={() => setShowAddMember(false)}
                      className="text-[10px] font-mono text-slate-500 hover:text-slate-300 px-2 py-1 cursor-pointer">Cancel</button>
                    <button type="submit"
                      className="text-[10px] font-mono text-white bg-blue-600 px-3 py-1 rounded-lg cursor-pointer hover:bg-blue-700">Add</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {selectedProj.stakeholders.map((person, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/40 group">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="h-8 w-8 rounded-full object-cover shrink-0 border border-slate-800/80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-slate-200 block truncate leading-tight">{person.name}</span>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block truncate mt-0.5">{person.role}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(i)}
                      className="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shrink-0"
                      title="Remove member"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {selectedProj.stakeholders.length === 0 && (
                  <div className="text-center py-4 text-slate-600 font-mono text-xs">
                    No stakeholders assigned.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#0c0f16] border border-slate-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400 animate-pulse" /> Project Pulse Feed
                </h3>
              </div>
              <form onSubmit={(e) => handleAddPulseAction(selectedProj.id, e)} className="relative">
                <input
                  type="text"
                  placeholder="Record incident or operational event..."
                  value={pulseInput}
                  onChange={(e) => setPulseInput(e.target.value)}
                  className="w-full bg-[#07090d] border border-slate-800/80 rounded-xl py-2 pl-3 pr-9 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/40 transition-all font-sans"
                />
                <button type="submit" className="absolute right-1.5 top-1.5 p-1 text-slate-500 hover:text-white transition-colors cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
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

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0c0f16] border border-slate-800/80 rounded-2xl p-6 w-full max-w-lg mx-4">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Edit Project</h3>
                <button onClick={() => setShowEditModal(false)} className="text-slate-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Name</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-[#07090d] border border-slate-800/80 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/40" required />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Description</label>
                  <textarea value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full bg-[#07090d] border border-slate-800/80 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/40 h-20 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Category</label>
                    <input type="text" value={editForm.category} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full bg-[#07090d] border border-slate-800/80 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/40" />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Due Date</label>
                    <input type="date" value={editForm.dueDate} onChange={e => setEditForm(p => ({ ...p, dueDate: e.target.value }))}
                      className="w-full bg-[#07090d] border border-slate-800/80 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500/40" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Color</label>
                  <div className="flex gap-2">
                    {COLORS.map(c => (
                      <button key={c} type="button" onClick={() => setEditForm(p => ({ ...p, color: c }))}
                        className={`h-6 w-6 rounded-full border-2 cursor-pointer transition-all ${editForm.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowEditModal(false)}
                    className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg cursor-pointer">Cancel</button>
                  <button type="submit"
                    className="text-xs font-mono text-white bg-blue-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0c0f16] border border-slate-800/80 rounded-2xl p-6 w-full max-w-sm mx-4 text-center">
              <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-2">Delete Project</h3>
              <p className="text-xs text-slate-400 mb-5">Are you sure you want to delete "{selectedProj.name}"? This cannot be undone.</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg cursor-pointer">Cancel</button>
                <button onClick={handleDeleteConfirm}
                  className="text-xs font-mono text-white bg-red-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-red-700">Delete</button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    );
  }

  // RENDER DIRECTORY VIEW
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
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 text-xs font-mono text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> NEW PROJECT
        </button>
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
              <div className="border-t border-slate-800/40 pt-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>Sprint completeness</span>
                  <span className="text-slate-200 font-bold">{proj.progress}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${proj.progress}%`, backgroundColor: proj.color }} />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {proj.stakeholders.slice(0, 3).map((person, i) => (
                      <img key={i} src={person.avatar} alt={person.name}
                        className="h-6 w-6 rounded-full object-cover border border-slate-900 shrink-0" title={person.name}
                        referrerPolicy="no-referrer" />
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

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-20">
          <Plus className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 font-mono text-sm">No projects yet. Create your first blueprint.</p>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0c0f16] border border-slate-800/80 rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">New Project Blueprint</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Name</label>
                <input type="text" value={newProject.name} onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#07090d] border border-slate-800/80 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/40"
                  placeholder="e.g. Nova Platform" required />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Description</label>
                <textarea value={newProject.description} onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-[#07090d] border border-slate-800/80 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/40 h-20 resize-none"
                  placeholder="Brief description of the project..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Category</label>
                  <input type="text" value={newProject.category} onChange={e => setNewProject(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-[#07090d] border border-slate-800/80 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/40"
                    placeholder="e.g. AI & Infrastructure" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Due Date</label>
                  <input type="date" value={newProject.dueDate} onChange={e => setNewProject(p => ({ ...p, dueDate: e.target.value }))}
                    className="w-full bg-[#07090d] border border-slate-800/80 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500/40" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Color</label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setNewProject(p => ({ ...p, color: c }))}
                      className={`h-6 w-6 rounded-full border-2 cursor-pointer transition-all ${newProject.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg cursor-pointer">Cancel</button>
                <button type="submit"
                  className="text-xs font-mono text-white bg-blue-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700">Create</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
