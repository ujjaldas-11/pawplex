import { useState, useEffect, useRef } from 'react'
import { triggerSOS, getNearbyVets, getContacts, createContact } from '../../api/emergency'
import { AlertTriangle, Phone, MapPin, Plus, X, Wifi } from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Emergency() {
  const [contacts, setContacts] = useState([])
  const [nearbyVets, setNearbyVets] = useState([])
  const [loading, setLoading] = useState(true)
  const [sosActive, setSosActive] = useState(false)
  const [sosData, setSosData] = useState(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [coords, setCoords] = useState(null)
  const wsRef = useRef(null)

  useEffect(() => {
    // Get location
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setCoords(c)
        getNearbyVets(c.lat, c.lng)
          .then(({ data }) => setNearbyVets(Array.isArray(data) ? data : data.results || []))
          .catch(() => {})
      },
      () => toast.error('Location access needed for emergency features')
    )

    getContacts()
      .then(({ data }) => setContacts(Array.isArray(data) ? data : data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false))

    return () => wsRef.current?.close()
  }, [])

  const handleSOS = async () => {
    if (!coords) {
      toast.error('Getting your location… please wait')
      return
    }

    setSosActive(true)
    try {
      const { data } = await triggerSOS({
        lat: coords.lat,
        lng: coords.lng,
        address: 'Current location',
        emergency_contact: contacts[0]?.phone || '',
        message: 'Emergency! Need immediate vet assistance!',
      })
      setSosData(data)
      toast.success('SOS sent! Help is on the way! 🚨')

      // Connect WebSocket for live updates
      try {
        const alertId = data.id
        const ws = new WebSocket(`ws://127.0.0.1:8000/ws/sos/${alertId}/`)
        ws.onmessage = (e) => {
          const msg = JSON.parse(e.data)
          toast(msg.message || 'SOS Update received', { icon: '🚨' })
        }
        ws.onerror = () => {}
        wsRef.current = ws
      } catch {}
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to send SOS')
      setSosActive(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading emergency info…" />

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-gradient-to-b from-red-600 to-red-700 px-5 pt-12 pb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-white">Emergency</h1>
        <p className="text-red-200 text-sm mt-1">Instant help when your pet needs it</p>
      </div>

      <div className="px-5 py-6 space-y-6 pb-24">
        {/* SOS Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleSOS}
            disabled={sosActive}
            className={`w-36 h-36 rounded-full flex flex-col items-center justify-center gap-2 shadow-2xl transition-all active:scale-95
              ${sosActive
                ? 'bg-gray-300 shadow-gray-200'
                : 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-300 animate-pulse'}`}
          >
            <AlertTriangle size={40} className="text-white" />
            <span className="text-white font-bold text-sm">{sosActive ? 'SOS Sent!' : 'SOS'}</span>
          </button>
          <p className="text-xs text-gray-400 mt-3 text-center">
            {sosActive ? 'Help is on the way. Stay calm.' : 'Tap to send emergency alert with your location'}
          </p>
          {sosActive && coords && (
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <Wifi size={12} /> Live tracking active
            </div>
          )}
        </div>

        {/* Nearby Vets */}
        <section>
          <h2 className="font-display text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-red-500" /> Nearby Vets
          </h2>
          {nearbyVets.length === 0 && <p className="text-gray-400 text-sm">No nearby vets found</p>}
          <div className="space-y-2">
            {nearbyVets.map((vet, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-lg flex-shrink-0">🏥</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">{vet.name}</p>
                  <p className="text-xs text-gray-400">{vet.address || ''} {vet.distance ? `· ${vet.distance}km` : ''}</p>
                </div>
                {vet.phone && (
                  <a href={`tel:${vet.phone}`} className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center">
                    <Phone size={14} className="text-green-600" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Contacts */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base font-bold text-gray-800 flex items-center gap-2">
              <Phone size={16} className="text-sage-dark" /> Emergency Contacts
            </h2>
            <button onClick={() => setShowContactForm(true)} className="text-xs text-sage-dark font-semibold flex items-center gap-1">
              <Plus size={14} /> Add
            </button>
          </div>
          {contacts.length === 0 && <p className="text-gray-400 text-sm">No emergency contacts added</p>}
          <div className="space-y-2">
            {contacts.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.relation} · {c.phone}</p>
                </div>
                <a href={`tel:${c.phone}`} className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center">
                  <Phone size={14} className="text-green-600" />
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Add Contact Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold">Add Emergency Contact</h2>
              <button onClick={() => setShowContactForm(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} /></button>
            </div>
            <ContactForm onCreated={() => {
              setShowContactForm(false)
              getContacts().then(({ data }) => setContacts(Array.isArray(data) ? data : data.results || []))
            }} />
          </div>
        </div>
      )}
    </div>
  )
}

function ContactForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', phone: '', relation: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) { toast.error('Name and phone required'); return }
    setLoading(true)
    try {
      await createContact(form)
      toast.success('Contact added!')
      onCreated()
    } catch { toast.error('Failed to add contact') }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none" />
      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="Phone number" type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none" />
      <input value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })}
        placeholder="Relation (e.g. Vet, Neighbor)" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none" />
      <button type="submit" disabled={loading}
        className="w-full bg-sage-dark text-white py-3 rounded-xl font-semibold active:scale-[0.98] disabled:opacity-60">
        {loading ? 'Saving…' : 'Save Contact'}
      </button>
    </form>
  )
}
