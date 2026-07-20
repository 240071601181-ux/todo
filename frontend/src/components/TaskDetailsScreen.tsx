import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  CheckSquare, 
  MessageSquare, 
  Calendar, 
  Send, 
  ChevronRight, 
  User, 
  Tag, 
  Play, 
  CheckCircle2, 
  AlertTriangle,
  BookOpen,
  Archive,
  Trash2
} from 'lucide-react';
import { Task, Milestone, Comment, TaskStatus, TaskPriority } from '../types';

interface TaskDetailsScreenProps {
  task: Task | null;
  onUpdate: (data: {
    title?: string;
    description?: string | null;
    priority?: string;
    status?: string;
    dueDate?: string;
  }) => void;
  onDelete: () => void;
  onArchive: () => void;
  onRestore: () => void;
  setActiveTab: (tab: string) => void;
  setSelectedTaskId: (id: string | null) => void;
  accentColor: string;
}

export default function TaskDetailsScreen({ 
  task, 
  onUpdate,
  onDelete,
  onArchive,
  onRestore,
  setActiveTab, 
  setSelectedTaskId,
  accentColor
}: TaskDetailsScreenProps) {
  
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  if (!task) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#07090d] text-slate-500 font-mono text-sm h-screen">
        <span>ERR_SCOPE_NOT_FOUND // NO ACTIVE TASK ELEMENT INSTANTIATED</span>
        <button 
          onClick={() => setActiveTab('tasks')}
          className="mt-4 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          REVERT TO PIPELINES
        </button>
      </div>
    );
  }

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

  const handleToggleMilestone = (milestoneId: string) => {
    // Milestones are local only (no backend)
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentText('');
  };

  const handleUpdateStatus = (newStatus: TaskStatus) => {
    onUpdate({ status: newStatus });
  };

  const handleUpdatePriority = (newPriority: TaskPriority) => {
    onUpdate({ priority: newPriority });
  };

  const startEditing = () => {
    setEditTitle(task.title);
    setEditDesc(task.description);
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (!editTitle.trim()) return;
    onUpdate({
      title: editTitle,
      description: editDesc || null,
    });
    setIsEditing(false);
  };

  const totalMilestones = task.milestones.length;
  const completedMilestones = task.milestones.filter(m => m.completed).length;
  const milestoneProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-[#07090d] text-slate-100 p-8 space-y-8 font-sans">
      
      {/* Return Navigation Row */}
      <div className="flex items-center justify-between border-b border-slate-800/50 pb-5">
        <button 
          onClick={() => {
            setSelectedTaskId(null);
            setActiveTab('tasks');
          }}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> REVERT TO BACKLOG
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800/60 px-3 py-1 rounded-full uppercase">
            TICKET: {task.id.slice(0, 8).toUpperCase()}
          </span>

          <button
            onClick={onArchive}
            className="flex items-center gap-1 px-3 py-1 bg-slate-900 border border-slate-800 hover:border-amber-500/30 rounded-xl text-[10px] font-mono text-slate-400 hover:text-amber-400 transition-all cursor-pointer"
          >
            <Archive className="w-3 h-3" /> ARCHIVE
          </button>

          <button
            onClick={() => { if (confirm('Permanently delete this task scope?')) onDelete() }}
            className="flex items-center gap-1 px-3 py-1 bg-slate-900 border border-slate-800 hover:border-red-500/30 rounded-xl text-[10px] font-mono text-slate-400 hover:text-red-400 transition-all cursor-pointer"
          >
            <Trash2 className="w-3 h-3" /> DELETE
          </button>
        </div>
      </div>

      {/* Main Grid: Left 2 Columns Task Detail Content / Right 1 Column Metadata Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Segment */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
              <span>{task.projectName}</span>
              <span>/</span>
              <span className="text-slate-400">{task.id.slice(0, 8)}</span>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#07090d] border border-slate-800 rounded-xl py-2 px-3 text-xl font-bold text-white focus:outline-none focus:border-blue-500/50"
                />
                <textarea
                  rows={4}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-[#07090d] border border-slate-800 rounded-xl py-2 px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="px-4 py-1.5 text-white text-xs font-mono font-semibold rounded-xl cursor-pointer"
                    style={{ backgroundColor: activeAccent }}
                  >
                    SAVE
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono rounded-xl cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2
                  onClick={startEditing}
                  className="font-display text-2xl font-bold tracking-tight text-white leading-tight cursor-pointer hover:text-blue-400 transition-colors"
                >
                  {task.title}
                </h2>
                <p
                  onClick={startEditing}
                  className="text-slate-300 text-sm leading-relaxed font-sans cursor-pointer hover:text-slate-200 transition-colors"
                >
                  {task.description}
                </p>
              </>
            )}

            <div className="flex items-center gap-2 flex-wrap pt-1">
              {task.tags.map((tag, i) => (
                <span key={i} className="text-[9px] font-mono bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-md">
                  #{tag.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* Description Block */}
          <div className="bg-[#0c0f16]/90 border border-slate-800/60 p-6 rounded-2xl space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-500" /> SCOPE SPECS / DESCRIPTION
            </h3>
            <p
              onClick={startEditing}
              className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-sans cursor-pointer hover:text-slate-200 transition-colors"
            >
              {task.description}
            </p>
          </div>

          {/* Checklist / Milestones Block */}
          <div className="bg-[#0c0f16]/90 border border-slate-800/60 p-6 rounded-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800/40 pb-3">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-slate-500" /> Engineering Checkpoints
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {completedMilestones}/{totalMilestones} Completed ({milestoneProgress}%)
              </span>
            </div>

            <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500" 
                style={{ width: `${milestoneProgress}%`, backgroundColor: activeAccent }} 
              />
            </div>

            <div className="space-y-2.5">
              {task.milestones.length > 0 ? (
                task.milestones.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleToggleMilestone(m.id)}
                    className="p-3 bg-[#090b10] hover:bg-slate-900/40 border border-slate-800/40 rounded-xl flex items-center gap-3 transition-colors cursor-pointer group"
                  >
                    <button
                      className={`h-4.5 w-4.5 rounded flex items-center justify-center shrink-0 border transition-all ${
                        m.completed 
                          ? 'bg-emerald-500/20 border-emerald-500/80 text-emerald-400'
                          : 'border-slate-700 group-hover:border-slate-500 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <span className={`text-xs ${
                      m.completed ? 'line-through text-slate-500' : 'text-slate-300 group-hover:text-slate-200'
                    }`}>
                      {m.title}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-600 font-mono text-xs">
                  No checkpoint sub-tasks documented for this ticket.
                </div>
              )}
            </div>
          </div>

          {/* Discussions/Comments Block */}
          <div className="bg-[#0c0f16]/90 border border-slate-800/60 p-6 rounded-2xl space-y-6">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800/40 pb-3">
              <MessageSquare className="w-4 h-4 text-slate-500" /> Collaborative Feed ({task.comments.length})
            </h3>

            <div className="space-y-4">
              {task.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl">
                  <img 
                    src={comment.author.avatar} 
                    alt={comment.author.name} 
                    className="h-8.5 w-8.5 rounded-full object-cover shrink-0 border border-slate-800/80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block truncate leading-tight">{comment.author.name}</span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase block truncate">{comment.author.role}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">{comment.createdAt}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed font-sans pt-1">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}

              {task.comments.length === 0 && (
                <div className="text-center py-6 text-slate-600 font-mono text-xs">
                  No discussions recorded. Initiate the dialogue thread below.
                </div>
              )}
            </div>

            <form onSubmit={handlePostComment} className="flex gap-3 items-end pt-3 border-t border-slate-800/40">
              <div className="flex-1">
                <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Draft Comment</label>
                <textarea
                  rows={2}
                  placeholder="Record note, report anomaly, or tag team member..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-[#07090d] border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/40 transition-all font-sans resize-none"
                />
              </div>
              <button
                type="submit"
                className="p-3 text-white rounded-xl cursor-pointer transition-all shrink-0 shadow-lg active:scale-95"
                style={{ backgroundColor: activeAccent }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Right Metadata Sidebar */}
        <div className="space-y-6">
          
          <div className="bg-[#0c0f16]/95 border border-slate-800/80 p-5 rounded-2xl space-y-5">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800/40 pb-3">
              Ticket Metadata
            </h3>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Assignee</span>
              <div className="flex items-center gap-3 bg-[#07090d] p-2.5 border border-slate-800/80 rounded-xl">
                <img 
                  src={task.assignee.avatar} 
                  alt={task.assignee.name} 
                  className="h-9 w-9 rounded-full object-cover shrink-0 border border-slate-800/80"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-200 block truncate leading-tight">
                    {task.assignee.name}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 block truncate uppercase mt-0.5">
                    {task.assignee.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Pipeline Stage</span>
              <select
                value={task.status}
                onChange={(e) => handleUpdateStatus(e.target.value as TaskStatus)}
                className="w-full bg-[#07090d] border border-slate-800/80 rounded-xl py-2 px-3 text-xs text-slate-300 font-mono focus:outline-none cursor-pointer"
              >
                <option value="todo">🔵 TO DO</option>
                <option value="in_progress">🟣 IN PROGRESS</option>
                <option value="done">🟢 DONE</option>
              </select>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Urgency Weight</span>
              <select
                value={task.priority}
                onChange={(e) => handleUpdatePriority(e.target.value as TaskPriority)}
                className="w-full bg-[#07090d] border border-slate-800/80 rounded-xl py-2 px-3 text-xs text-slate-300 font-mono focus:outline-none cursor-pointer"
              >
                <option value="low">🛡️ LOW</option>
                <option value="medium">⚡ MEDIUM</option>
                <option value="high">⚠️ HIGH</option>
                <option value="urgent">🛑 URGENT</option>
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Target Timeline</span>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-[#07090d] px-3 py-2 rounded-xl border border-slate-800/60">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{task.dueDate || 'No due date'}</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-800/40 text-xs font-mono">
              <span className="text-slate-500 uppercase">Story weight</span>
              <span className="text-slate-100 font-bold">{task.storyPoints} Points</span>
            </div>

            {/* Edit Title/Description button */}
            <button
              onClick={startEditing}
              className="w-full py-2 bg-slate-900 border border-slate-800 hover:border-blue-500/30 rounded-xl text-xs font-mono text-slate-400 hover:text-blue-400 transition-all cursor-pointer"
            >
              EDIT TICKET
            </button>
          </div>

          <div className="p-4 bg-yellow-950/20 border border-yellow-500/25 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 text-yellow-500 shrink-0" />
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-yellow-500 block uppercase">STRICT DEADLINE TETHER</span>
              <p className="text-[10.5px] text-slate-400 leading-normal font-sans">
                This item is tethered to active HIPAA certification loops. Any delay will push product release dates out.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
