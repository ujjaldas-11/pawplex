import { Calendar, Clock, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function UpcomingAppt({ appointment }) {
  const navigate = useNavigate()

  if (!appointment) return null

  return (
    <button
      onClick={() => navigate('/appointments')}
      className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-transform"
    >
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 
        flex items-center justify-center text-white flex-shrink-0 text-2xl">
        🏥
      </div>

      <div className="flex-1 text-left min-w-0">
        <p className="font-bold text-sm text-gray-900 truncate">
          {appointment.vet || appointment.clinic_name || 'Vet Appointment'}
        </p>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          {appointment.clinic || appointment.reason || ''}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-[11px] text-sage-dark font-medium">
            <Calendar size={11} /> {appointment.date || appointment.date_time?.split('T')[0] || ''}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-sage-dark font-medium">
            <Clock size={11} /> {appointment.time || appointment.date_time?.split('T')[1]?.slice(0,5) || ''}
          </span>
        </div>
      </div>

      <ChevronRight size={18} className="text-gray-300 flex-shrink-0" />
    </button>
  )
}