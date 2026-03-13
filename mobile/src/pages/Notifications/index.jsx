import { useState, useEffect } from 'react'
import { getNotifications, markRead, markAllRead } from '../../api/notifications'
import { Bell, CheckCheck } from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const { data } = await getNotifications()
      setNotifications(Array.isArray(data) ? data : data.results || [])
    } catch { toast.error('Failed to load notifications') }
    finally { setLoading(false) }
  }

  const handleRead = async (id) => {
    try {
      await markRead(id)
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
    } catch {}
  }

  const handleMarkAll = async () => {
    try {
      await markAllRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      toast.success('All marked as read')
    } catch { toast.error('Failed') }
  }

  if (loading) return <LoadingSpinner text="Loading notifications…" />

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-sage-dark px-5 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Notifications</h1>
            <p className="text-sage-light text-sm mt-1">{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAll}
              className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-2 rounded-full">
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="px-5 py-4 space-y-2 pb-24">
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl block mb-3">🔔</span>
            <p className="text-gray-500 font-medium">No notifications</p>
            <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
          </div>
        )}

        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => !n.is_read && handleRead(n.id)}
            className={`w-full text-left rounded-2xl p-4 shadow-sm border transition-all
              ${n.is_read ? 'bg-white border-gray-100' : 'bg-sage-dark/5 border-sage-dark/20'}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.is_read ? 'bg-transparent' : 'bg-sage-dark'}`} />
              <div className="flex-1">
                <p className={`text-sm ${n.is_read ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                  {n.title || n.message}
                </p>
                {n.body && <p className="text-xs text-gray-400 mt-0.5">{n.body}</p>}
                <p className="text-[10px] text-gray-300 mt-1">
                  {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
