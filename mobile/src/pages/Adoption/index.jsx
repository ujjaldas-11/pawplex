import { useState, useEffect } from 'react'
import { getAdoptionListings, expressInterest, getLostFound, createLostFound } from '../../api/adoption'
import { Heart, MapPin, Search, Plus, X, Send } from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Adoption() {
  const [tab, setTab] = useState('adopt')
  const [listings, setListings] = useState([])
  const [lostFound, setLostFound] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ species: '', gender: '' })
  const [selectedListing, setSelectedListing] = useState(null)
  const [showReportForm, setShowReportForm] = useState(false)
  const [interestMsg, setInterestMsg] = useState('')

  useEffect(() => { load() }, [tab, filters])

  async function load() {
    setLoading(true)
    try {
      if (tab === 'adopt') {
        const params = {}
        if (filters.species) params.species = filters.species
        if (filters.gender) params.gender = filters.gender
        const { data } = await getAdoptionListings(params)
        setListings(Array.isArray(data) ? data : data.results || [])
      } else {
        const { data } = await getLostFound({ type: 'lost' })
        setLostFound(Array.isArray(data) ? data : data.results || [])
      }
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  const handleInterest = async () => {
    if (!selectedListing) return
    try {
      await expressInterest(selectedListing.id, { message: interestMsg })
      toast.success('Interest submitted! 💚')
      setSelectedListing(null)
      setInterestMsg('')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit interest')
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-sage-dark px-5 pt-12 pb-6">
        <h1 className="font-display text-2xl font-bold text-white">Adoption</h1>
        <div className="flex gap-2 mt-4">
          {['adopt', 'lostfound'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all
                ${tab === t ? 'bg-white text-sage-dark' : 'bg-white/15 text-white'}`}>
              {t === 'adopt' ? '🏠 Adopt a Pet' : '🔍 Lost & Found'}
            </button>
          ))}
        </div>
      </div>

      {/* Filters for adopt tab */}
      {tab === 'adopt' && (
        <div className="px-5 py-3 flex gap-2">
          <select value={filters.species} onChange={(e) => setFilters({ ...filters, species: e.target.value })}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none">
            <option value="">All Species</option>
            <option value="dog">Dogs</option>
            <option value="cat">Cats</option>
            <option value="bird">Birds</option>
          </select>
          <select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none">
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      )}

      <div className="px-5 py-2 space-y-3 pb-24">
        {loading ? (
          <LoadingSpinner size="md" />
        ) : tab === 'adopt' ? (
          <>
            {listings.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No pets available for adoption right now</p>}
            {listings.map((l) => {
              const emoji = l.species === 'dog' ? '🐕' : l.species === 'cat' ? '🐈' : '🐾'
              return (
                <div key={l.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-3xl flex-shrink-0">{emoji}</div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900">{l.pet_name || l.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{l.breed || l.species} · {l.gender} · {l.age || ''}</p>
                      {l.description && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{l.description}</p>}
                    </div>
                  </div>
                  <button onClick={() => setSelectedListing(l)}
                    className="mt-3 w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                    <Heart size={14} /> Express Interest
                  </button>
                </div>
              )
            })}
          </>
        ) : (
          <>
            {lostFound.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No lost & found reports</p>}
            {lostFound.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-gray-900">{item.pet_name}</p>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{item.species} · {item.description}</p>
                {item.address && (
                  <p className="text-xs text-sage-dark mt-1 flex items-center gap-1"><MapPin size={10} /> {item.address}</p>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Report Lost/Found FAB */}
      {tab === 'lostfound' && (
        <button onClick={() => setShowReportForm(true)}
          className="fixed bottom-24 right-5 w-14 h-14 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform z-40">
          <Plus size={24} />
        </button>
      )}

      {/* Express Interest Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold">Express Interest</h2>
              <button onClick={() => setSelectedListing(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} /></button>
            </div>
            <p className="text-sm text-gray-600 mb-3">Interested in <strong>{selectedListing.pet_name || selectedListing.name}</strong>?</p>
            <textarea value={interestMsg} onChange={(e) => setInterestMsg(e.target.value)}
              placeholder="Tell the shelter why you'd be a great pet parent…" rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none resize-none mb-3" />
            <button onClick={handleInterest}
              className="w-full bg-sage-dark text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-[0.98]">
              <Send size={16} /> Submit
            </button>
          </div>
        </div>
      )}

      {/* Report Lost/Found Modal */}
      {showReportForm && <ReportLostFoundModal onClose={() => setShowReportForm(false)} onCreated={() => { setShowReportForm(false); load() }} />}
    </div>
  )
}

function ReportLostFoundModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    type: 'lost', pet_name: '', species: 'dog', description: '', address: '', contact: '', lat: '', lng: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude })),
      () => {}
    )
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createLostFound(form)
      toast.success('Report submitted!')
      onCreated()
    } catch { toast.error('Failed to submit report') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold">Report Lost/Found Pet</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            {['lost', 'found'].map((t) => (
              <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all
                  ${form.type === t ? 'border-sage-dark bg-sage-dark text-white' : 'border-gray-200 text-gray-600'}`}>
                {t === 'lost' ? '🔍 Lost' : '✅ Found'}
              </button>
            ))}
          </div>
          <input name="pet_name" value={form.pet_name} onChange={(e) => setForm({ ...form, pet_name: e.target.value })}
            placeholder="Pet name" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none" />
          <select value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none">
            <option value="dog">Dog</option><option value="cat">Cat</option><option value="bird">Bird</option><option value="other">Other</option>
          </select>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description…" rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none resize-none" />
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Location / Address" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none" />
          <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
            placeholder="Contact number" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none" />
          <button type="submit" disabled={loading}
            className="w-full bg-sage-dark text-white py-3 rounded-xl font-semibold active:scale-[0.98] disabled:opacity-60">
            {loading ? 'Submitting…' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  )
}
