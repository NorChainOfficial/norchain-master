'use client'

import { useState, useEffect } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import {
  Bell,
  Check,
  CheckCheck,
  X,
  MessageSquare,
  UserPlus,
  GitCommit,
  AlertCircle,
  Sparkles,
  Trash2,
} from 'lucide-react'

interface Notification {
  id: string
  type: 'mention' | 'assignment' | 'comment' | 'message' | 'update' | 'system'
  title: string
  content?: string
  entity_type?: string
  entity_id?: string
  read_at?: string
  created_at: string
  actor?: {
    id: string
    name: string
    avatar_url?: string
  }
}

const typeIcons = {
  mention: MessageSquare,
  assignment: UserPlus,
  comment: MessageSquare,
  message: MessageSquare,
  update: GitCommit,
  system: AlertCircle,
}

const typeColors = {
  mention: 'bg-blue-500/15 text-blue-500',
  assignment: 'bg-violet-500/15 text-violet-500',
  comment: 'bg-emerald-500/15 text-emerald-500',
  message: 'bg-primary/15 text-primary',
  update: 'bg-amber-500/15 text-amber-500',
  system: 'bg-red-500/15 text-red-500',
}

interface NotificationCenterProps {
  userId?: string
  className?: string
}

export function NotificationCenter({
  userId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  className,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read_at).length

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/notifications?user_id=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/v1/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        )
      )
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read_at).map((n) => n.id)
    if (unreadIds.length === 0) return

    try {
      await fetch('/api/v1/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: unreadIds }),
      })
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      )
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/v1/notifications?id=${id}`, { method: 'DELETE' })
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return date.toLocaleDateString()
  }

  return (
    <div className={cn('relative', className)}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative flex h-10 w-10 items-center justify-center rounded-xl',
          'border bg-muted/50 hover:bg-muted transition-all duration-200',
          isOpen && 'bg-muted border-primary/30'
        )}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            className={cn(
              'absolute right-0 top-full mt-2 w-96 z-50',
              'bg-popover border rounded-2xl shadow-xl',
              'animate-slide-down origin-top-right'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 text-xs font-medium bg-primary/15 text-primary rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Bell className="h-10 w-10 mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                  <p className="text-xs">You&apos;re all caught up!</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = typeIcons[notification.type] || AlertCircle
                  const colorClass = typeColors[notification.type] || typeColors.system

                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'group flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer',
                        !notification.read_at && 'bg-primary/5'
                      )}
                      onClick={() => {
                        if (!notification.read_at) {
                          markAsRead(notification.id)
                        }
                      }}
                    >
                      {notification.actor ? (
                        <Avatar
                          src={notification.actor.avatar_url}
                          alt={notification.actor.name}
                          size="sm"
                        />
                      ) : (
                        <div
                          className={cn(
                            'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                            colorClass
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">
                          {notification.title}
                        </p>
                        {notification.content && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                            {notification.content}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read_at && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                            className="p-1 rounded hover:bg-muted transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {!notification.read_at && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 self-center" />
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t px-4 py-2">
                <button className="w-full text-center text-sm text-primary hover:underline">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default NotificationCenter

