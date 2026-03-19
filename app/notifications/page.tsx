"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import { getMyNotifications, markNotificationAsRead, type AppNotification } from '../api'

function statusTone(status: string) {
  const value = (status || '').toLowerCase()
  if (value === 'selected') return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
  if (value === 'rejected') return 'bg-red-50 text-red-700 ring-red-200'
  if (value === 'shortlisted') return 'bg-amber-50 text-amber-700 ring-amber-200'
  return 'bg-slate-100 text-slate-700 ring-slate-200'
}

function formatDate(isoDate: string) {
  const date = new Date(isoDate)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingId, setMarkingId] = useState<string | null>(null)

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const response = await getMyNotifications()
      setNotifications(response?.data?.data || [])
    } catch (error) {
      console.error('Failed to load notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const handleNotificationClick = async (notification: AppNotification) => {
    try {
      if (!notification.isRead) {
        setMarkingId(notification.id)
        await markNotificationAsRead(notification.id)
        setNotifications((prev) =>
          prev.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item))
        )
      }
      router.push('/applied-jobs')
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      toast.error('Failed to update notification')
    } finally {
      setMarkingId(null)
    }
  }

  const unreadCount = notifications.filter((item) => !item.isRead).length

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-slate-100" />
            <div className="mt-6 space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            <p className="mt-1 text-sm text-slate-500">Unread: {unreadCount}</p>
          </div>

          {notifications.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-base font-semibold text-slate-700">No notifications yet</p>
              <p className="mt-1 text-sm text-slate-500">You will see updates about your applications here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  disabled={markingId === notification.id}
                  className={`w-full px-6 py-4 text-left transition hover:bg-slate-50 disabled:opacity-60 ${
                    notification.isRead ? 'bg-white' : 'bg-indigo-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {notification.companyName} updated your application for {notification.jobTitle}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {notification.message || `Your application status is now ${notification.status}.`}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{formatDate(notification.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      )}
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(notification.status)}`}>
                        {notification.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
