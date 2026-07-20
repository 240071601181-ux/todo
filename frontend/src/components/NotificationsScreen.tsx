import { Bell, CheckCheck, ArrowLeft } from 'lucide-react'
import type { Notification } from '../types'

interface NotificationsScreenProps {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onBack: () => void
  accentColor: string
}

const typeIcons: Record<string, string> = {
  due_today: '⏰',
  overdue: '🚨',
  completed: '✅',
  project_update: '📋',
}

const typeLabels: Record<string, string> = {
  due_today: 'Due Today',
  overdue: 'Overdue',
  completed: 'Completed',
  project_update: 'Project Update',
}

const typeColors: Record<string, string> = {
  due_today: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  project_update: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

function getAccentColorHex(accentColor: string): string {
  switch (accentColor) {
    case 'purple': return '#a855f7'
    case 'emerald': return '#10b981'
    case 'amber': return '#f59e0b'
    case 'rose': return '#f43f5e'
    default: return '#3b82f6'
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / 86400000)

  if (days === 0) {
    return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return d.toLocaleDateString()
}

export default function NotificationsScreen({
  notifications,
  unreadCount,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
  onBack,
  accentColor,
}: NotificationsScreenProps) {
  const accentHex = getAccentColorHex(accentColor)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-mono">Loading notifications...</span>
        </div>
      </div>
    )
  }

  const grouped: Record<string, Notification[]> = {}
  for (const n of notifications) {
    if (!grouped[n.type]) grouped[n.type] = []
    grouped[n.type].push(n)
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-slate-200 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bell className="w-4 h-4" style={{ color: accentHex }} />
              Notifications
            </h1>
            <p className="text-[10px] font-mono text-slate-500 mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-all cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Bell className="w-8 h-8 text-slate-600 mb-3" />
            <p className="text-xs text-slate-500">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => { if (!n.read) onMarkAsRead(n.id) }}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                !n.read
                  ? 'bg-slate-900/30 border-slate-700/60'
                  : 'bg-transparent border-slate-800/40'
              } hover:bg-slate-900/40`}
            >
              <span className="text-lg shrink-0 mt-0.5">{typeIcons[n.type] ?? '🔔'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded border ${typeColors[n.type]}`}>
                    {typeLabels[n.type] ?? n.type}
                  </span>
                  {!n.read && (
                    <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: accentHex }} />
                  )}
                </div>
                <p className="text-sm text-slate-200 mt-1">{n.message}</p>
                <span className="text-[10px] font-mono text-slate-600 mt-1.5 block">
                  {formatDate(n.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
