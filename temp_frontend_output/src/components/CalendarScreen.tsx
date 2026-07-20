import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  MapPin, 
  Video, 
  BookOpen, 
  Activity, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { CalendarEvent, AppSettings } from '../types';

interface CalendarScreenProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  settings: AppSettings;
}

export default function CalendarScreen({ events, setEvents, settings }: CalendarScreenProps) {
  // Setup Calendar state
  const [selectedDate, setSelectedDate] = useState<string>("2026-07-20");
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('10:00');
  const [newDuration, setNewDuration] = useState('1h');
  const [newType, setNewType] = useState<'meeting' | 'task' | 'milestone' | 'focus'>('meeting');

  // Let's create an elegant grid layout for July 2026.
  // July 2026 starts on Wednesday, June 2026 ends on 30.
  // Pre-fill trailing days from June (28, 29, 30) and leading days from August (1, 2)
  const calendarDays = [
    { day: 28, dateStr: "2026-06-28", isCurrentMonth: false },
    { day: 29, dateStr: "2026-06-29", isCurrentMonth: false },
    { day: 30, dateStr: "2026-06-30", isCurrentMonth: false },
    { day: 1, dateStr: "2026-07-01", isCurrentMonth: true },
    { day: 2, dateStr: "2026-07-02", isCurrentMonth: true },
    { day: 3, dateStr: "2026-07-03", isCurrentMonth: true },
    { day: 4, dateStr: "2026-07-04", isCurrentMonth: true },
    { day: 5, dateStr: "2026-07-05", isCurrentMonth: true },
    { day: 6, dateStr: "2026-07-06", isCurrentMonth: true },
    { day: 7, dateStr: "2026-07-07", isCurrentMonth: true },
    { day: 8, dateStr: "2026-07-08", isCurrentMonth: true },
    { day: 9, dateStr: "2026-07-09", isCurrentMonth: true },
    { day: 10, dateStr: "2026-07-10", isCurrentMonth: true },
    { day: 11, dateStr: "2026-07-11", isCurrentMonth: true },
    { day: 12, dateStr: "2026-07-12", isCurrentMonth: true },
    { day: 13, dateStr: "2026-07-13", isCurrentMonth: true },
    { day: 14, dateStr: "2026-07-14", isCurrentMonth: true },
    { day: 15, dateStr: "2026-07-15", isCurrentMonth: true },
    { day: 16, dateStr: "2026-07-16", isCurrentMonth: true },
    { day: 17, dateStr: "2026-07-17", isCurrentMonth: true },
    { day: 18, dateStr: "2026-07-18", isCurrentMonth: true },
    { day: 19, dateStr: "2026-07-19", isCurrentMonth: true },
    { day: 20, dateStr: "2026-07-20", isCurrentMonth: true }, // Today focus
    { day: 21, dateStr: "2026-07-21", isCurrentMonth: true },
    { day: 22, dateStr: "2026-07-22", isCurrentMonth: true },
    { day: 23, dateStr: "2026-07-23", isCurrentMonth: true },
    { day: 24, dateStr: "2026-07-24", isCurrentMonth: true },
    { day: 25, dateStr: "2026-07-25", isCurrentMonth: true },
    { day: 26, dateStr: "2026-07-26", isCurrentMonth: true },
    { day: 27, dateStr: "2026-07-27", isCurrentMonth: true },
    { day: 28, dateStr: "2026-07-28", isCurrentMonth: true },
    { day: 29, dateStr: "2026-07-29", isCurrentMonth: true },
    { day: 30, dateStr: "2026-07-30", isCurrentMonth: true },
    { day: 31, dateStr: "2026-07-31", isCurrentMonth: true },
    { day: 1, dateStr: "2026-08-01", isCurrentMonth: false },
  ];

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

  // Filter events for selected date
  const dayEvents = events
    .filter(e => e.date === selectedDate)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let eventColor = '#3b82f6'; // Blue
    if (newType === 'meeting') eventColor = '#f59e0b'; // Amber
    if (newType === 'focus') eventColor = '#a855f7'; // Purple
    if (newType === 'milestone') eventColor = '#10b981'; // Emerald

    const created: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle,
      date: selectedDate,
      time: newTime,
      duration: newDuration || undefined,
      type: newType,
      color: eventColor
    };

    setEvents(prev => [...prev, created]);
    setNewTitle('');
    setNewTime('10:00');
    setNewDuration('1h');
    setShowAddEventModal(false);
  };

  const formatDateDisplay = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIdx = parseInt(parts[1]) - 1;
    return `${months[monthIdx]} ${parts[2]}, ${parts[0]}`;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#07090d] text-slate-100 p-8 space-y-8 font-sans">
      
      {/* Top Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/50 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
            <span>OPERATIONAL CALENDAR</span>
            <span>•</span>
            <span style={{ color: activeAccent }}>CHRONOS SYSTEM</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white mt-1">
            July 2026
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Coordinate sprints, architectural reviews, and maintain focused milestones.
          </p>
        </div>

        {/* Navigation / Action buttons */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-950 border border-slate-800/80 p-1 rounded-xl">
            <button className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400 font-bold px-3 py-1 flex items-center justify-center">
              JULY
            </span>
            <button className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowAddEventModal(true)}
            className="inline-flex items-center gap-1.5 text-white text-xs font-mono font-semibold py-2 px-4 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
            style={{ backgroundColor: activeAccent }}
          >
            <Plus className="w-4 h-4" /> RECORD EVENT
          </button>
        </div>
      </div>

      {/* Grid Layout of Calendar Grid and Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns - Monthly Grid Card */}
        <div className="lg:col-span-2 bg-[#0c0f16]/90 border border-slate-800/60 p-6 rounded-2xl">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800/40 pb-3">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2.5">
            {calendarDays.map((dayItem, idx) => {
              const isActive = dayItem.dateStr === selectedDate;
              const isToday = dayItem.dateStr === "2026-07-20";
              const dayHasEvents = events.some(e => e.date === dayItem.dateStr);
              const dayEvts = events.filter(e => e.date === dayItem.dateStr);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(dayItem.dateStr)}
                  className={`h-20 p-2 border rounded-xl flex flex-col justify-between items-start transition-all cursor-pointer select-none relative group ${
                    isActive 
                      ? 'bg-slate-900 border-blue-500/80 shadow-md'
                      : isToday
                      ? 'bg-slate-900/40 border-slate-700/80'
                      : dayItem.isCurrentMonth
                      ? 'bg-[#090b10] border-slate-800/50 hover:border-slate-700/50 hover:bg-slate-900/20'
                      : 'bg-[#05060a] border-slate-900/30 text-slate-600'
                  }`}
                  style={{
                    borderColor: isActive ? activeAccent : undefined
                  }}
                >
                  <span className={`text-xs font-mono font-bold ${
                    isToday && !isActive ? 'text-blue-400' : 'text-slate-300'
                  }`}>
                    {dayItem.day}
                  </span>

                  {/* Dot markers representing events */}
                  <div className="flex gap-1 flex-wrap mt-auto">
                    {dayEvts.slice(0, 3).map((evt) => (
                      <span 
                        key={evt.id} 
                        className="h-1.5 w-1.5 rounded-full shrink-0" 
                        style={{ backgroundColor: evt.color }}
                        title={evt.title}
                      />
                    ))}
                    {dayEvts.length > 3 && (
                      <span className="text-[7px] font-mono text-slate-500 font-bold">
                        +{dayEvts.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Agenda Sidebar for selected Date */}
        <div className="bg-[#0c0f16]/90 border border-slate-800/60 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800/50 pb-4 mb-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Selected Operational Cycle</span>
              <h3 className="text-sm font-semibold text-white mt-1">
                {formatDateDisplay(selectedDate)}
              </h3>
            </div>

            <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
              {dayEvents.length > 0 ? (
                dayEvents.map((evt) => (
                  <div 
                    key={evt.id}
                    className="p-3 bg-slate-900/50 border border-slate-800/50 rounded-xl flex items-start gap-3.5 group hover:border-slate-800 hover:bg-slate-900/80 transition-all"
                  >
                    <span className="h-2.5 w-2.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: evt.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate block">
                          {evt.title}
                        </span>
                        {evt.time && (
                          <span className="text-[9px] font-mono text-slate-500 bg-[#07090d] px-1.5 py-0.5 rounded border border-slate-800/40">
                            {evt.time}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 mt-1 uppercase">
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
                <div className="text-center py-12 text-slate-600 font-mono text-xs border border-dashed border-slate-800/40 rounded-xl">
                  No registered milestones on this cycle.
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-900/30 rounded-xl border border-slate-800/40 flex items-center gap-2 mt-4">
            <Bookmark className="w-4 h-4 text-slate-500" />
            <span className="text-[9.5px] font-mono text-slate-500 uppercase tracking-wide leading-relaxed">
              Ensure standups are updated daily inside slack/teams streams.
            </span>
          </div>
        </div>

      </div>

      {/* Add Event Modal component */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-[#0c1017] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
              <h3 className="text-sm font-semibold text-slate-200 uppercase font-mono tracking-wider">
                Log New Calendar Event
              </h3>
              <button 
                onClick={() => setShowAddEventModal(false)}
                className="text-xs text-slate-500 hover:text-slate-300 font-mono cursor-pointer"
              >
                ESC // CLOSE
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Event Title / Purpose</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SRE Redis Cluster failover test dry-run"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#07090d] border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Operational Time (HH:MM)</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-[#07090d] border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 1h 30m, 45m"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-[#07090d] border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Event Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'meeting', label: 'Meeting', color: 'bg-amber-500' },
                    { id: 'task', label: 'Task', color: 'bg-blue-500' },
                    { id: 'focus', label: 'Focus', color: 'bg-purple-500' },
                    { id: 'milestone', label: 'Milestone', color: 'bg-emerald-500' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setNewType(cat.id as any)}
                      className={`py-2 px-1 rounded-xl text-[10px] font-mono uppercase border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        newType === cat.id
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-[#07090d] border-slate-900 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${cat.color}`} />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-slate-800/60 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-900/40 text-slate-400 text-xs font-mono rounded-xl cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white text-xs font-mono font-semibold rounded-xl cursor-pointer"
                  style={{ backgroundColor: activeAccent }}
                >
                  REGISTER EVENT
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
