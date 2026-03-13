import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CalendarPlus, Heart, MessageCircle } from 'lucide-react'

const actions = [
  {
    label: 'Emergency SOS',
    icon: AlertTriangle,
    route: '/emergency',
    gradient: 'from-rose-500 to-pink-600',
    shadow: 'shadow-rose-500/25',
  },
  {
    label: 'Book a Vet',
    icon: CalendarPlus,
    route: '/appointments/book',
    gradient: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/25',
  },
  {
    label: 'Adopt a Pet',
    icon: Heart,
    route: '/adoption',
    gradient: 'from-violet-500 to-fuchsia-600',
    shadow: 'shadow-violet-500/25',
  },
  {
    label: 'Community',
    icon: MessageCircle,
    route: '/community',
    gradient: 'from-amber-400 to-orange-500',
    shadow: 'shadow-orange-500/25',
  },
]

export default function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map(({ label, icon: Icon, route, gradient, shadow }) => (
        <button
          key={route}
          onClick={() => navigate(route)}
          className={`bg-gradient-to-br ${gradient} ${shadow} shadow-lg hover-lift
            rounded-[20px] p-5 flex flex-col items-center gap-3
            text-white border border-white/10`}
        >
          <Icon size={28} strokeWidth={2} />
          <span className="text-sm font-semibold tracking-wide text-center leading-tight">
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}