import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import type { Notification } from '../types'

interface NotificationBellProps {
  notifications: Notification[]
  unreadCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onViewAll: () => void
  accentColor: string
}

const typeIcons: Record<string, string> = {
  due_today: '⏰',
  overdue: '🚨',
  completed: '✅',
  project_update: '📋',
}

const getAccentColorHex = (accentColor: string) => {
  switch (accentColor) {
    case 'purple': return '#a855f7'
    case 'emerald': return '#10b981'
    case 'amber': return '#f59e0b'
    case 'rose': return '#f43f5e'
    default: return '#3b82f6'
  }
}

export default function NotificationBell({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll,
  accentColor,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const accentHex = getAccentColorHex(accentColor)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-slate-200 transition-all cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold text-white"
            style={{ backgroundColor: accentHex }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-[#0a0d14] border border-slate-800/80 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60">
              <span className="text-xs font-semibold text-slate-200">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <span className="text-xs text-slate-500">No notifications</span>
                </div>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      if (!n.read) onMarkAsRead(n.id)
                    }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all cursor-pointer hover:bg-slate-900/40 ${
                      !n.read ? 'bg-slate-900/20' : ''
                    }`}
                  >
                    <span className="text-base shrink-0 mt-0.5">{typeIcons[n.type] ?? '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${!n.read ? 'text-slate-100' : 'text-slate-400'}`}>
                          {n.title}
                        </span>
                        {!n.read && (
                          <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: accentHex }} />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <span className="text-[9px] font-mono text-slate-600 mt-1 block">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            <button
              onClick={onViewAll}
              className="w-full px-4 py-2.5 text-[11px] font-medium text-center border-t border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 transition-all cursor-pointer"
            >
              View all notifications
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}
