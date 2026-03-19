"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import { getMyNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../api'

function statusTone(status) {
	const value = (status || '').toLowerCase()
	if (value === 'selected') return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
	if (value === 'rejected') return 'bg-red-50 text-red-700 ring-red-200'
	if (value === 'shortlisted') return 'bg-amber-50 text-amber-700 ring-amber-200'
	return 'bg-slate-100 text-slate-700 ring-slate-200'
}

function timeLabel(isoDate) {
	const date = new Date(isoDate)
	if (Number.isNaN(date.getTime())) return ''
	return date.toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	})
}

export default function Notification() {
	const router = useRouter()
	const rootRef = useRef(null)
	const [isOpen, setIsOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [notifications, setNotifications] = useState([])
	const [markingId, setMarkingId] = useState(null)
	const [markingAll, setMarkingAll] = useState(false)

	const unreadCount = useMemo(
		() => notifications.filter((item) => !item.isRead).length,
		[notifications]
	)

	const fetchNotifications = async () => {
		try {
			setLoading(true)
			const response = await getMyNotifications()
			setNotifications(response?.data?.data || [])
		} catch (error) {
			console.error('Failed to fetch notifications:', error)
			toast.error('Failed to load notifications')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchNotifications()
	}, [])

	useEffect(() => {
		if (!isOpen) return

		const handleOutside = (event) => {
			if (!rootRef.current) return
			if (!rootRef.current.contains(event.target)) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleOutside)
		return () => document.removeEventListener('mousedown', handleOutside)
	}, [isOpen])

	const openPopover = async () => {
		setIsOpen((prev) => !prev)
		if (!isOpen) {
			await fetchNotifications()
		}
	}

	const handleNotificationClick = async (notification) => {
		try {
			if (!notification.isRead) {
				setMarkingId(notification.id)
				await markNotificationAsRead(notification.id)
				setNotifications((prev) =>
					prev.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item))
				)
			}
			setIsOpen(false)
			router.push('/applied-jobs')
		} catch (error) {
			console.error('Failed to mark notification as read:', error)
			toast.error('Failed to update notification')
		} finally {
			setMarkingId(null)
		}
	}

	const handleMarkAllAsRead = async () => {
		try {
			setMarkingAll(true)
			await markAllNotificationsAsRead()
			setNotifications([])
			toast.success('All notifications cleared')
		} catch (error) {
			console.error('Failed to clear notifications:', error)
			toast.error('Failed to clear notifications')
		} finally {
			setMarkingAll(false)
		}
	}

	return (
		<div className="relative" ref={rootRef}>
			<button
				type="button"
				onClick={openPopover}
				className="relative rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
				aria-label="Notifications"
			>
				<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
						d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
				</svg>

				{unreadCount > 0 && (
					<span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
						{unreadCount > 99 ? '99+' : unreadCount}
					</span>
				)}
			</button>

			{isOpen && (
				<div className="absolute right-0 z-30 mt-2 w-90 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
					<div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
						<div>
							<p className="text-sm font-semibold text-slate-800">Notifications</p>
							<p className="text-xs text-slate-500">Unread: {unreadCount}</p>
						</div>
						<button
							type="button"
							onClick={handleMarkAllAsRead}
							disabled={notifications.length === 0 || markingAll}
							className="text-xs font-semibold text-indigo-600 transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
						>
							{markingAll ? 'Clearing...' : 'Clear all'}
						</button>
					</div>

					<div className="max-h-96 overflow-y-auto">
						{loading ? (
							<div className="px-4 py-8 text-center text-sm text-slate-500">Loading notifications...</div>
						) : notifications.length === 0 ? (
							<div className="px-4 py-8 text-center text-sm text-slate-500">No notifications yet</div>
						) : (
							notifications.slice(0, 6).map((notification) => (
								<button
									key={notification.id}
									type="button"
									onClick={() => handleNotificationClick(notification)}
									disabled={markingId === notification.id}
									className={`w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 disabled:opacity-60 ${
										notification.isRead ? 'bg-white' : 'bg-indigo-50/30'
									}`}
								>
									<div className="flex items-start justify-between gap-3">
										<div>
											<p className="text-sm font-semibold text-slate-800">
												{notification.companyName} - {notification.jobTitle}
											</p>
											<p className="mt-1 text-xs text-slate-500">
												{notification.message || `Your application status is now ${notification.status}.`}
											</p>
											<p className="mt-1 text-[11px] text-slate-400">{timeLabel(notification.createdAt)}</p>
										</div>
										<span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${statusTone(notification.status)}`}>
											{notification.status}
										</span>
									</div>
								</button>
							))
						)}
					</div>
				</div>
			)}
		</div>
	)
}

