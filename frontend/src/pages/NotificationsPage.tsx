import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import NotificationsScreen from '../components/NotificationsScreen'
import * as notificationService from '../services/notificationService'
import type { Notification } from '../types'

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { settings } = useApp()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    try {
      await notificationService.generateNotifications()
      const [data, count] = await Promise.all([
        notificationService.getNotifications({ limit: 100 }),
        notificationService.getUnreadCount(),
      ])
      setNotifications(data.notifications.map(notificationService.mapNotification))
      setUnreadCount(count)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {
      // silently fail
    }
  }, [])

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch {
      // silently fail
    }
  }, [])

  const handleBack = useCallback(() => {
    navigate('/dashboard')
  }, [navigate])

  return (
    <NotificationsScreen
      notifications={notifications}
      unreadCount={unreadCount}
      loading={loading}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
      onBack={handleBack}
      accentColor={settings.accentColor}
    />
  )
}
