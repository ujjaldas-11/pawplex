import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAppointments } from '../../api/appointments'
import { Calendar, Clock, Plus } from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const statusColors = {
  pending:   'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  done:      'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function Appointments() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAppointments()
      .then(({ data }) => setAppointments(Array.isArray(data) ? data : data.results || []))
      .catch(() => toast.error('Failed to load appointments'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Loading appointments…" />

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-sage-dark px-5 pt-12 pb-6">
        <h1 className="font-display text-2xl font-bold text-white">Appointments</h1>
        <p className="text-sage-light text-sm mt-1">{appointments.length} appointment{appointments.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="px-5 py-4 space-y-3">
        {appointments.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl block mb-3">📅</span>
            <p className="text-gray-500 font-medium">No appointments yet</p>
            <p className="text-gray-400 text-sm mt-1">Book your first vet visit</p>
          </div>
        )}

        {appointments.map((appt) => (
          <div key={appt.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-bold text-sm text-gray-900">{appt.clinic_name || appt.vet || 'Vet Appointment'}</p>
                <p className="text-xs text-gray-400 mt-0.5">{appt.reason || ''}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColors[appt.status] || statusColors.pending}`}>
                {appt.status || 'pending'}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <span className="flex items-center gap-1 text-xs text-sage-dark font-medium">
                <Calendar size={12} /> {appt.date || appt.date_time?.split('T')[0] || '—'}
              </span>
              <span className="flex items-center gap-1 text-xs text-sage-dark font-medium">
                <Clock size={12} /> {appt.time || appt.date_time?.split('T')[1]?.slice(0,5) || '—'}
              </span>
              {appt.pet_name && (
                <span className="text-xs text-gray-400">🐾 {appt.pet_name}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/appointments/book')}
        className="fixed bottom-24 right-5 w-14 h-14 bg-sage-dark text-white rounded-full shadow-lg shadow-sage-dark/30 flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        <Plus size={24} />
      </button>
    </div>
  )
}
