import { Bell, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getUnreadCount } from '../../api/notifications'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function GreetingHeader({ userName = 'Pet Parent' }) {
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    getUnreadCount()
      .then(({ data }) => setUnread(data.unread_count || 0))
      .catch(() => {})
  }, [])

  return (
    <div className="bg-slate-900 px-5 pt-12 pb-8 rounded-b-3xl shadow-xl shadow-slate-900/10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-slate-400 text-sm font-medium">{getGreeting()} 🌿</p>
          <h1 className="font-display text-white text-3xl font-bold mt-1 tracking-tight">
            {userName}'s Pets
          </h1>
        </div>
        <button
          onClick={() => navigate('/notifications')}
          className="relative w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <Bell size={20} />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      </div>

      <button
        onClick={() => navigate('/search')}
        className="w-full bg-slate-800/80 rounded-2xl px-5 py-3.5 flex items-center gap-3 text-slate-400 text-sm border border-slate-700/50 hover:bg-slate-800 transition-colors"
      >
        <Search size={16} />
        Search pets, vets, services…
      </button>
    </div>
  )
}