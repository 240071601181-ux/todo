import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Clock, Plus, Activity, ChevronLeft, ChevronRight,
  Bookmark, Trash2, Pencil, X, List, LayoutGrid, BarChart3
} from 'lucide-react';
import { CalendarEvent, AppSettings, CalendarView } from '../types';

interface CalendarScreenProps {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  onCreateEvent: (data: { title: string; date: string; time?: string; duration?: string; type?: string; color?: string }) => Promise<void>;
  onUpdateEvent: (id: string, data: { title?: string; date?: string; time?: string | null; duration?: string | null; type?: string; color?: string }) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
  settings: AppSettings;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const TYPE_COLORS: Record<string, string> = { meeting: '#f59e0b', task: '#3b82f6', focus: '#a855f7', milestone: '#10b981' };

function getAccentColor(accentColor: string) {
  switch (accentColor) {
    case 'purple': return '#a855f7';
    case 'emerald': return '#10b981';
    case 'amber': return '#f59e0b';
    case 'rose': return '#f43f5e';
    default: return '#3b82f6';
  }
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function getMonthDays(year: number, month: number): { date: Date; dateStr: string; isCurrentMonth: boolean }[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const days: { date: Date; dateStr: string; isCurrentMonth: boolean }[] = [];

  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, dateStr: formatDate(d), isCurrentMonth: false });
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    days.push({ date, dateStr: formatDate(date), isCurrentMonth: true });
  }
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d);
    days.push({ date, dateStr: formatDate(date), isCurrentMonth: false });
  }
  return days;
}

function getWeekDays(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export default function CalendarScreen({ events, setEvents, onCreateEvent, onUpdateEvent, onDeleteEvent, settings }: CalendarScreenProps) {
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => formatDate(today), [today]);
  const [view, setView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formTime, setFormTime] = useState('10:00');
  const [formDuration, setFormDuration] = useState('1h');
  const [formType, setFormType] = useState<'meeting' | 'task' | 'milestone' | 'focus'>('meeting');
  const [formColor, setFormColor] = useState('#f59e0b');
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const activeAccent = getAccentColor(settings.accentColor);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthDays = useMemo(() => getMonthDays(currentYear, currentMonth), [currentYear, currentMonth]);
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const dayEvents = useMemo(() =>
    events.filter(e => e.date === selectedDate).sort((a, b) => (a.time || '').localeCompare(b.time || '')),
    [events, selectedDate]
  );

  const monthEventMap = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }
    return map;
  }, [events]);

  const weekEventMap = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    }
    return map;
  }, [events]);

  const agendaEvents = useMemo(() =>
    events.filter(e => e.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || '')),
    [events, todayStr]
  );

  const navigate = useCallback((dir: number) => {
    const d = new Date(currentDate);
    if (view === 'month') {
      d.setMonth(d.getMonth() + dir);
    } else if (view === 'week') {
      d.setDate(d.getDate() + dir * 7);
    } else {
      d.setDate(d.getDate() + dir);
    }
    setCurrentDate(d);
  }, [currentDate, view]);

  const resetToToday = useCallback(() => {
    setCurrentDate(today);
    setSelectedDate(todayStr);
  }, [today, todayStr]);

  const openAddModal = useCallback(() => {
    setFormTitle('');
    setFormTime('10:00');
    setFormDuration('1h');
    setFormType('meeting');
    setFormColor('#f59e0b');
    setEditingEvent(null);
    setShowAddModal(true);
  }, []);

  const openEditModal = useCallback((evt: CalendarEvent) => {
    if (evt.id.startsWith('task-')) return;
    setFormTitle(evt.title);
    setFormTime(evt.time || '10:00');
    setFormDuration(evt.duration || '1h');
    setFormType(evt.type);
    setFormColor(evt.color);
    setEditingEvent(evt);
    setShowAddModal(true);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingEvent) {
      await onUpdateEvent(editingEvent.id, {
        title: formTitle,
        time: formTime,
        duration: formDuration,
        type: formType,
        color: formColor,
      });
    } else {
      await onCreateEvent({
        title: formTitle,
        date: selectedDate,
        time: formTime,
        duration: formDuration,
        type: formType,
        color: formColor,
      });
    }
    setShowAddModal(false);
    setEditingEvent(null);
  };

  const handleDelete = async () => {
    if (!editingEvent) return;
    await onDeleteEvent(editingEvent.id);
    setShowAddModal(false);
    setEditingEvent(null);
  };

  const handleDragStart = (evt: CalendarEvent) => (e: React.DragEvent) => {
    setDraggedEvent(evt);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', evt.id);
  };

  const handleDropOnDay = (dateStr: string) => async (e: React.DragEvent) => {
    e.preventDefault();
    setDropTarget(null);
    if (!draggedEvent || draggedEvent.date === dateStr) {
      setDraggedEvent(null);
      return;
    }
    if (draggedEvent.id.startsWith('task-')) return;
    await onUpdateEvent(draggedEvent.id, { date: `${dateStr}T00:00:00.000Z` });
    setEvents(prev => prev.map(ev => ev.id === draggedEvent.id ? { ...ev, date: dateStr } : ev));
    setDraggedEvent(null);
  };

  const handleDragOver = (dateStr: string) => (e: React.DragEvent) => {
    e.preventDefault();
    setDropTarget(dateStr);
  };

  const handleDragLeave = () => setDropTarget(null);

  const createDateForList = (evt: CalendarEvent) => {
    const parts = evt.date.split('-');
    const m = parseInt(parts[1]) - 1;
    return `${MONTHS[m].slice(0, 3)} ${parseInt(parts[2])}, ${parts[0]}`;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#07090d] text-slate-100 p-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/50 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
            <span>OPERATIONAL CALENDAR</span>
            <span>•</span>
            <span style={{ color: activeAccent }}>CHRONOS SYSTEM</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white mt-1">
            {view === 'month' ? `${MONTHS[currentMonth]} ${currentYear}` :
             view === 'week' ? `Week of ${formatDate(weekDays[0])}` :
             view === 'day' ? `${MONTHS[currentMonth]} ${currentDate.getDate()}, ${currentYear}` :
             'Agenda View'}
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* View Switcher */}
          <div className="flex bg-slate-950 border border-slate-800/80 p-1 rounded-xl">
            {(['month', 'week', 'day', 'agenda'] as CalendarView[]).map(v => (
              <button key={v}
                onClick={() => setView(v)}
                className={`p-1.5 text-[10px] font-mono font-bold px-3 rounded-lg transition-all cursor-pointer ${
                  view === v ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {v === 'month' ? <LayoutGrid className="w-3.5 h-3.5 inline mr-1" /> :
                 v === 'week' ? <BarChart3 className="w-3.5 h-3.5 inline mr-1" /> :
                 v === 'day' ? <Clock className="w-3.5 h-3.5 inline mr-1" /> :
                 <List className="w-3.5 h-3.5 inline mr-1" />}
                {v.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex bg-slate-950 border border-slate-800/80 p-1 rounded-xl">
            <button onClick={() => navigate(-1)} className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={resetToToday}
              className="text-[10px] font-mono text-slate-400 font-bold px-3 py-1 rounded-lg hover:text-white transition-colors cursor-pointer">
              TODAY
            </button>
            <button onClick={() => navigate(1)} className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button onClick={openAddModal}
            className="inline-flex items-center gap-1.5 text-white text-xs font-mono font-semibold py-2 px-4 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
            style={{ backgroundColor: activeAccent }}>
            <Plus className="w-4 h-4" /> RECORD EVENT
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={view} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}>
          {/* MONTH VIEW */}
          {view === 'month' && (
            <div className="bg-[#0c0f16]/90 border border-slate-800/60 p-6 rounded-2xl">
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800/40 pb-3">
                {DAYS_OF_WEEK.map(d => <span key={d}>{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-2.5">
                {monthDays.map((dayItem, idx) => {
                  const isActive = dayItem.dateStr === selectedDate;
                  const isToday = dayItem.dateStr === todayStr;
                  const dayEvts = monthEventMap.get(dayItem.dateStr) || [];
                  return (
                    <div key={idx} draggable={false}
                      onDragOver={handleDragOver(dayItem.dateStr)}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDropOnDay(dayItem.dateStr)}
                      onClick={() => setSelectedDate(dayItem.dateStr)}
                      className={`h-20 p-2 border rounded-xl flex flex-col justify-between items-start transition-all cursor-pointer select-none relative group ${
                        isActive ? 'bg-slate-900 border-blue-500/80 shadow-md' :
                        isToday ? 'bg-slate-900/40 border-slate-700/80' :
                        dayItem.isCurrentMonth ? 'bg-[#090b10] border-slate-800/50 hover:border-slate-700/50 hover:bg-slate-900/20' :
                        'bg-[#05060a] border-slate-900/30 text-slate-600'
                      }`}
                      style={{ borderColor: isActive ? activeAccent : dropTarget === dayItem.dateStr ? activeAccent : undefined }}>
                      <span className={`text-xs font-mono font-bold ${isToday && !isActive ? 'text-blue-400' : 'text-slate-300'}`}>
                        {dayItem.date.getDate()}
                      </span>
                      <div className="flex gap-1 flex-wrap mt-auto">
                        {dayEvts.slice(0, 3).map(evt => (
                          <span key={evt.id} className="h-1.5 w-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: evt.color }} title={evt.title} />
                        ))}
                        {dayEvts.length > 3 && (
                          <span className="text-[7px] font-mono text-slate-500 font-bold">+{dayEvts.length - 3}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* WEEK VIEW */}
          {view === 'week' && (
            <div className="bg-[#0c0f16]/90 border border-slate-800/60 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-8 border-b border-slate-800/60">
                <div className="p-2 border-r border-slate-800/60" />
                {weekDays.map(d => {
                  const ds = formatDate(d);
                  const isToday = ds === todayStr;
                  return (
                    <div key={ds} onClick={() => { setSelectedDate(ds); setCurrentDate(d); }}
                      className={`p-2 text-center cursor-pointer transition-colors ${isToday ? 'bg-blue-500/10' : 'hover:bg-slate-900/40'}`}>
                      <div className="text-[9px] font-mono text-slate-500 uppercase">{DAYS_OF_WEEK[d.getDay()]}</div>
                      <div className={`text-xs font-bold mt-0.5 ${isToday ? 'text-blue-400' : 'text-slate-300'}`}>{d.getDate()}</div>
                    </div>
                  );
                })}
              </div>
              <div className="overflow-y-auto max-h-[500px]">
                {HOURS.map(hour => (
                  <div key={hour} className="grid grid-cols-8 border-b border-slate-800/30 min-h-[48px]">
                    <div className="p-1 text-[9px] font-mono text-slate-600 border-r border-slate-800/30 text-right pr-2">
                      {String(hour).padStart(2, '0')}:00
                    </div>
                    {weekDays.map(d => {
                      const ds = formatDate(d);
                      const hourEvents = (weekEventMap.get(ds) || []).filter(e => {
                        if (!e.time) return false;
                        const eh = parseInt(e.time.split(':')[0]);
                        return eh === hour;
                      });
                      return (
                        <div key={ds} className="p-0.5 relative min-h-[48px] hover:bg-slate-900/20 transition-colors"
                          onDragOver={handleDragOver(ds)} onDragLeave={handleDragLeave}
                          onDrop={handleDropOnDay(ds)}>
                          {hourEvents.map(evt => (
                            <div key={evt.id} draggable={!evt.id.startsWith('task-')} onDragStart={handleDragStart(evt)}
                              onClick={() => openEditModal(evt)}
                              className="text-[9px] font-mono p-1 rounded mb-0.5 truncate cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: evt.color + '30', color: evt.color, borderLeft: `2px solid ${evt.color}` }}>
                              {evt.time && <span className="font-bold">{evt.time} </span>}
                              {evt.title}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DAY VIEW */}
          {view === 'day' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#0c0f16]/90 border border-slate-800/60 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800/60">
                  <div className="text-xs font-mono text-slate-500 uppercase">
                    {DAYS_OF_WEEK[parseDate(selectedDate).getDay()]}, {MONTHS[parseDate(selectedDate).getMonth()]} {parseDate(selectedDate).getDate()}
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[600px]">
                  {HOURS.map(hour => {
                    const hourEvents = dayEvents.filter(e => {
                      if (!e.time) return false;
                      return parseInt(e.time.split(':')[0]) === hour;
                    });
                    return (
                      <div key={hour} className="flex border-b border-slate-800/30 min-h-[52px] hover:bg-slate-900/10 transition-colors">
                        <div className="w-16 p-1 text-[9px] font-mono text-slate-600 border-r border-slate-800/30 text-right pr-2 shrink-0">
                          {String(hour).padStart(2, '0')}:00
                        </div>
                        <div className="flex-1 p-1">
                          {hourEvents.map(evt => (
                            <div key={evt.id} draggable={!evt.id.startsWith('task-')} onDragStart={handleDragStart(evt)}
                              onClick={() => openEditModal(evt)}
                              className="text-xs font-mono p-2 rounded-lg mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: evt.color + '20', color: evt.color, borderLeft: `3px solid ${evt.color}` }}>
                              <div className="font-bold">{evt.title}</div>
                              <div className="text-[9px] opacity-70">{evt.time} {evt.duration ? `• ${evt.duration}` : ''}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-[#0c0f16]/90 border border-slate-800/60 p-5 rounded-2xl">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-4">Day Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Total Events</span>
                    <span className="text-white font-bold">{dayEvents.length}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Meetings</span>
                    <span className="text-white font-bold">{dayEvents.filter(e => e.type === 'meeting').length}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Tasks</span>
                    <span className="text-white font-bold">{dayEvents.filter(e => e.type === 'task').length}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Focus Blocks</span>
                    <span className="text-white font-bold">{dayEvents.filter(e => e.type === 'focus').length}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Milestones</span>
                    <span className="text-white font-bold">{dayEvents.filter(e => e.type === 'milestone').length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AGENDA VIEW */}
          {view === 'agenda' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#0c0f16]/90 border border-slate-800/60 p-6 rounded-2xl">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-4">Upcoming Events</h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {agendaEvents.length > 0 ? agendaEvents.map(evt => (
                    <div key={evt.id}
                      onClick={() => openEditModal(evt)}
                      className="flex items-center gap-3 p-3 bg-slate-900/30 border border-slate-800/40 rounded-xl hover:bg-slate-900/50 transition-colors cursor-pointer group">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: evt.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200 truncate">{evt.title}</span>
                          <span className="text-[9px] font-mono text-slate-500 bg-[#07090d] px-1.5 py-0.5 rounded border border-slate-800/40 shrink-0">
                            {evt.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 mt-0.5">
                          <span>{createDateForList(evt)}</span>
                          {evt.time && <><span>•</span><span>{evt.time}</span></>}
                          {evt.duration && <><span>•</span><span>{evt.duration}</span></>}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 text-slate-600 font-mono text-xs border border-dashed border-slate-800/40 rounded-xl">
                      No upcoming events.
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-[#0c0f16]/90 border border-slate-800/60 p-5 rounded-2xl">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-4">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Total Upcoming</span>
                    <span className="text-white font-bold">{agendaEvents.length}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>This Week</span>
                    <span className="text-white font-bold">
                      {agendaEvents.filter(e => {
                        const d = parseDate(e.date);
                        const weekStart = new Date(today);
                        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                        const weekEnd = new Date(weekStart);
                        weekEnd.setDate(weekEnd.getDate() + 7);
                        return d >= weekStart && d < weekEnd;
                      }).length}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-slate-900/30 rounded-xl border border-slate-800/40 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-[9.5px] font-mono text-slate-500 uppercase tracking-wide">
                    Ensure standups are updated daily inside slack/teams streams.
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Agenda sidebar for month view */}
      {view === 'month' && (
        <div className="bg-[#0c0f16]/90 border border-slate-800/60 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Selected Cycle</span>
              <h3 className="text-sm font-semibold text-white mt-1">
                {(() => {
                  const d = parseDate(selectedDate);
                  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
                })()}
              </h3>
            </div>
            <button onClick={() => { setSelectedDate(selectedDate); setView('day'); }}
              className="text-[10px] font-mono text-blue-400 hover:text-blue-300 cursor-pointer">FULL DAY VIEW →</button>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {dayEvents.length > 0 ? dayEvents.map(evt => (
              <div key={evt.id} draggable={!evt.id.startsWith('task-')} onDragStart={handleDragStart(evt)}
                onClick={() => openEditModal(evt)}
                className="p-3 bg-slate-900/50 border border-slate-800/50 rounded-xl flex items-start gap-3.5 group hover:border-slate-800 hover:bg-slate-900/80 transition-all cursor-pointer">
                <span className="h-2.5 w-2.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: evt.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate block">{evt.title}</span>
                    {evt.time && <span className="text-[9px] font-mono text-slate-500 bg-[#07090d] px-1.5 py-0.5 rounded border border-slate-800/40 shrink-0">{evt.time}</span>}
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 mt-1 uppercase">
                    <span>{evt.type}</span>
                    {evt.duration && <><span>•</span><span>{evt.duration}</span></>}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-slate-600 font-mono text-xs border border-dashed border-slate-800/40 rounded-xl">
                No registered milestones on this cycle.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-[#0c1017] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
              <h3 className="text-sm font-semibold text-slate-200 uppercase font-mono tracking-wider">
                {editingEvent ? 'Edit Event' : 'Log New Calendar Event'}
              </h3>
              <button onClick={() => { setShowAddModal(false); setEditingEvent(null); }}
                className="text-xs text-slate-500 hover:text-slate-300 font-mono cursor-pointer">
                ESC // CLOSE
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Event Title / Purpose</label>
                <input type="text" required placeholder="e.g. SRE Redis Cluster failover test"
                  value={formTitle} onChange={e => setFormTitle(e.target.value)}
                  className="w-full bg-[#07090d] border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all font-sans" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Time (HH:MM)</label>
                  <input type="time" required value={formTime} onChange={e => setFormTime(e.target.value)}
                    className="w-full bg-[#07090d] border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 font-mono focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Duration</label>
                  <input type="text" placeholder="e.g. 1h 30m" value={formDuration} onChange={e => setFormDuration(e.target.value)}
                    className="w-full bg-[#07090d] border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 mb-1.5">Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['meeting', 'task', 'focus', 'milestone'] as const).map(cat => (
                    <button key={cat} type="button" onClick={() => { setFormType(cat); setFormColor(TYPE_COLORS[cat]); }}
                      className={`py-2 px-1 rounded-xl text-[10px] font-mono uppercase border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        formType === cat ? 'bg-slate-900 border-slate-700 text-white' : 'bg-[#07090d] border-slate-900 text-slate-500 hover:text-slate-300'
                      }`}>
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[cat] }} />
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-3 border-t border-slate-800/60 mt-2">
                {editingEvent && !editingEvent.id.startsWith('task-') && (
                  <button type="button" onClick={handleDelete}
                    className="px-4 py-2 bg-red-900/30 border border-red-800/50 text-red-400 text-xs font-mono rounded-xl cursor-pointer hover:bg-red-900/50 flex items-center gap-1.5">
                    <Trash2 className="w-3 h-3" /> DELETE
                  </button>
                )}
                <button type="button" onClick={() => { setShowAddModal(false); setEditingEvent(null); }}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-900/40 text-slate-400 text-xs font-mono rounded-xl cursor-pointer">
                  CANCEL
                </button>
                <button type="submit"
                  className="px-4 py-2 text-white text-xs font-mono font-semibold rounded-xl cursor-pointer"
                  style={{ backgroundColor: activeAccent }}>
                  {editingEvent ? 'UPDATE' : 'REGISTER'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
