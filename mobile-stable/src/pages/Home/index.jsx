import { useState, useEffect } from 'react'
import { getPets } from '../../api/pets'
import { getStats } from '../../api/dashboard'
import { getAppointments } from '../../api/appointments'
import { useAuth } from '../../context/AuthContext'
import GreetingHeader from './GreetingHeader'
import PetSwitcher from './PetSwitcher'

import QuickActions from './QuickActions'
import UpcomingAppt from './UpcomingAppt'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function Home() {
  const { user } = useAuth()
  const [pets, setPets] = useState([])
  const [activePetId, setActivePetId] = useState(null)
  const [stats, setStats] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [petsRes, statsRes, apptRes] = await Promise.allSettled([
          getPets(),
          getStats(),
          getAppointments(),
        ])
        const petsList = petsRes.status === 'fulfilled' ? petsRes.value.data : []
        setPets(Array.isArray(petsList) ? petsList : petsList.results || [])
        if (petsList.length > 0) setActivePetId(petsList[0]?.id)

        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data)
        const apptList = apptRes.status === 'fulfilled' ? apptRes.value.data : []
        setAppointments(Array.isArray(apptList) ? apptList : apptList.results || [])
      } catch {
        // fail silently — data just won't render
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingSpinner text="Loading your dashboard…" />

  const userName = user?.username || user?.first_name || 'Pet Parent'

  return (
    <div className="min-h-screen bg-cream">
      <GreetingHeader userName={userName} />
      <PetSwitcher pets={pets} activePetId={activePetId} setActivePetId={setActivePetId} />

      <div className="px-5 space-y-6 pb-8">
        {/* Stats cards */}
        {stats && (
          <section className="grid grid-cols-2 gap-3">
            <StatCard label="My Pets" value={stats.pets_count ?? pets.length} emoji="🐾" />
            <StatCard label="Upcoming" value={stats.appointments_upcoming ?? 0} emoji="📅" />
            <StatCard label="Vaccines Due" value={stats.vaccinations_due ?? 0} emoji="💉" />
            <StatCard label="Unread" value={stats.unread_notifications ?? 0} emoji="🔔" />
          </section>
        )}

        {/* Quick actions */}
        <section>
          <h2 className="font-display text-base font-bold text-gray-800 mb-3">Quick Actions</h2>
          <QuickActions />
        </section>

        {/* Next appointment */}
        {appointments.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-base font-bold text-gray-800">Next Appointment</h2>
            </div>
            <UpcomingAppt appointment={appointments[0]} />
          </section>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, emoji }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
      <span className="text-2xl">{emoji}</span>
      <div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400">{label}</p>
      </div>
    </div>
  )
}