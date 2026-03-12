import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClinics, getSlots, createAppointment } from '../../api/appointments'
import { getPets } from '../../api/pets'
import { ArrowLeft, Check } from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function BookAppointment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [clinics, setClinics] = useState([])
  const [slots, setSlots] = useState([])
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [selected, setSelected] = useState({
    clinic: null,
    slot: null,
    pet: null,
    date_time: '',
    reason: '',
  })

  useEffect(() => {
    Promise.allSettled([getClinics(), getPets()])
      .then(([clinicsRes, petsRes]) => {
        if (clinicsRes.status === 'fulfilled') {
          const c = clinicsRes.value.data
          setClinics(Array.isArray(c) ? c : c.results || [])
        }
        if (petsRes.status === 'fulfilled') {
          const p = petsRes.value.data
          setPets(Array.isArray(p) ? p : p.results || [])
        }
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (selected.clinic) {
      getSlots(selected.clinic)
        .then(({ data }) => setSlots(Array.isArray(data) ? data : data.results || []))
        .catch(() => setSlots([]))
    }
  }, [selected.clinic])

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await createAppointment({
        pet: selected.pet,
        clinic: selected.clinic,
        slot: selected.slot,
        date_time: selected.date_time,
        reason: selected.reason,
      })
      toast.success('Appointment booked! 🎉')
      navigate('/appointments', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading clinics…" />

  const steps = ['Clinic', 'Slot', 'Pet', 'Details']

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-sage-dark px-5 pt-10 pb-6">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          className="text-white/70 mb-3 flex items-center gap-1">
          <ArrowLeft size={18} /> {step > 1 ? 'Back' : 'Cancel'}
        </button>
        <h1 className="font-display text-xl font-bold text-white">Book Appointment</h1>

        {/* Step indicator */}
        <div className="flex gap-2 mt-4">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1 rounded-full ${i + 1 <= step ? 'bg-white' : 'bg-white/20'} transition-all`} />
              <p className={`text-[10px] mt-1 ${i + 1 <= step ? 'text-white' : 'text-white/40'}`}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-5">
        {/* Step 1: Select Clinic */}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-600 mb-2">Select a clinic</p>
            {clinics.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No clinics available</p>}
            {clinics.map((c) => (
              <button key={c.id}
                onClick={() => { setSelected({ ...selected, clinic: c.id }); setStep(2) }}
                className={`w-full text-left bg-white rounded-2xl p-4 shadow-sm border-2 transition-all
                  ${selected.clinic === c.id ? 'border-sage-dark' : 'border-gray-100'}`}
              >
                <p className="font-bold text-sm text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.address || c.location || ''}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Select Slot */}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-600 mb-2">Select a time slot</p>
            {slots.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No slots available for this clinic</p>}
            <div className="grid grid-cols-2 gap-2">
              {slots.map((s) => (
                <button key={s.id}
                  onClick={() => { setSelected({ ...selected, slot: s.id, date_time: s.date_time || s.start_time || '' }); setStep(3) }}
                  className={`text-left bg-white rounded-xl p-3 border-2 transition-all text-sm
                    ${selected.slot === s.id ? 'border-sage-dark' : 'border-gray-100'}`}
                >
                  <p className="font-semibold text-gray-900">{s.date || s.day || ''}</p>
                  <p className="text-xs text-gray-400">{s.time || s.start_time || ''} {s.end_time ? `– ${s.end_time}` : ''}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Pet */}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-600 mb-2">Which pet is this for?</p>
            {pets.map((p) => {
              const emoji = p.species === 'dog' ? '🐕' : p.species === 'cat' ? '🐈' : '🐾'
              return (
                <button key={p.id}
                  onClick={() => { setSelected({ ...selected, pet: p.id }); setStep(4) }}
                  className={`w-full flex items-center gap-3 bg-white rounded-2xl p-4 border-2 transition-all
                    ${selected.pet === p.id ? 'border-sage-dark' : 'border-gray-100'}`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <div className="text-left">
                    <p className="font-bold text-sm text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.breed || p.species}</p>
                  </div>
                  {selected.pet === p.id && <Check size={18} className="ml-auto text-sage-dark" />}
                </button>
              )
            })}
          </div>
        )}

        {/* Step 4: Reason + Submit */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-600 mb-2">Add details</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for visit</label>
              <textarea
                value={selected.reason}
                onChange={(e) => setSelected({ ...selected, reason: e.target.value })}
                placeholder="e.g. Annual vaccination, skin issue…"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-sage-dark/30 focus:border-sage-dark outline-none transition-all resize-none"
              />
            </div>
            {!selected.date_time && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input type="datetime-local" value={selected.date_time}
                  onChange={(e) => setSelected({ ...selected, date_time: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-sage-dark/30 focus:border-sage-dark outline-none transition-all"
                />
              </div>
            )}
            <button onClick={handleSubmit} disabled={submitting}
              className="w-full bg-sage-dark text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-sage-dark/20 active:scale-[0.98] transition-all disabled:opacity-60">
              {submitting ? 'Booking…' : 'Confirm Booking'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
