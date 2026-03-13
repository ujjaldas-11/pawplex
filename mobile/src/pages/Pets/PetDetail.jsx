import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPet, getPetQR, getVaccinations, addVaccination, getMedicalRecords, addMedicalRecord } from '../../api/pets'
import { ArrowLeft, QrCode, Syringe, FileText, Plus, X } from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function PetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [qr, setQr] = useState(null)
  const [tab, setTab] = useState('vaccinations')
  const [vaccinations, setVaccinations] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [showVaxForm, setShowVaxForm] = useState(false)
  const [showRecordForm, setShowRecordForm] = useState(false)

  useEffect(() => {
    load()
  }, [id])

  async function load() {
    try {
      const [petRes, qrRes, vaxRes, recRes] = await Promise.allSettled([
        getPet(id),
        getPetQR(id),
        getVaccinations(id),
        getMedicalRecords(id),
      ])
      if (petRes.status === 'fulfilled') setPet(petRes.value.data)
      if (qrRes.status === 'fulfilled') setQr(qrRes.value.data.qr_code)
      if (vaxRes.status === 'fulfilled') {
        const v = vaxRes.value.data
        setVaccinations(Array.isArray(v) ? v : v.results || [])
      }
      if (recRes.status === 'fulfilled') {
        const r = recRes.value.data
        setRecords(Array.isArray(r) ? r : r.results || [])
      }
    } catch {
      toast.error('Failed to load pet details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading pet details…" />
  if (!pet) return <div className="p-6 text-center text-gray-500">Pet not found</div>

  const emoji = pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐈' : '🐾'
  const tabs = [
    { key: 'vaccinations', label: 'Vaccinations', icon: Syringe },
    { key: 'records', label: 'Medical Records', icon: FileText },
    { key: 'qr', label: 'QR Code', icon: QrCode },
  ]

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-sage-dark px-5 pt-10 pb-8">
        <button onClick={() => navigate(-1)} className="text-white/70 mb-4 flex items-center gap-1">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-4xl">{emoji}</div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{pet.name}</h1>
            <p className="text-sage-light text-sm">{pet.breed || pet.species} · {pet.gender} · {pet.weight ? `${pet.weight}kg` : ''}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-white px-2">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition-all
              ${tab === key ? 'border-sage-dark text-sage-dark' : 'border-transparent text-gray-400'}`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-5 py-4">
        {tab === 'vaccinations' && (
          <div className="space-y-3">
            {vaccinations.length === 0 && <p className="text-gray-400 text-sm text-center py-6">No vaccination records yet</p>}
            {vaccinations.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="font-semibold text-sm text-gray-900">{v.vaccine_name}</p>
                <p className="text-xs text-gray-400 mt-1">Administered: {v.administered || '—'}</p>
                <p className="text-xs text-gray-400">Next due: {v.next_due || '—'}</p>
                {v.vet_clinic && <p className="text-xs text-sage-dark mt-1">{v.vet_clinic}</p>}
              </div>
            ))}
            <button onClick={() => setShowVaxForm(true)}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm font-medium flex items-center justify-center gap-2">
              <Plus size={16} /> Add Vaccination
            </button>
          </div>
        )}

        {tab === 'records' && (
          <div className="space-y-3">
            {records.length === 0 && <p className="text-gray-400 text-sm text-center py-6">No medical records yet</p>}
            {records.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="font-semibold text-sm text-gray-900">{r.title}</p>
                <p className="text-xs text-gray-400 mt-1">{r.description}</p>
                {r.diagnosed && <p className="text-xs text-gray-400">Diagnosed: {r.diagnosed}</p>}
                {r.treated_by && <p className="text-xs text-sage-dark mt-1">By: {r.treated_by}</p>}
              </div>
            ))}
            <button onClick={() => setShowRecordForm(true)}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm font-medium flex items-center justify-center gap-2">
              <Plus size={16} /> Add Medical Record
            </button>
          </div>
        )}

        {tab === 'qr' && (
          <div className="flex flex-col items-center py-8">
            {qr ? (
              <>
                <img src={qr} alt="Pet QR Code" className="w-48 h-48 rounded-2xl shadow-lg" />
                <p className="text-sm text-gray-400 mt-4">Scan to view {pet.name}'s profile</p>
              </>
            ) : (
              <p className="text-gray-400 text-sm">QR code not available</p>
            )}
          </div>
        )}
      </div>

      {/* Vaccination Form Modal */}
      {showVaxForm && (
        <QuickFormModal
          title="Add Vaccination"
          fields={[
            { name: 'vaccine_name', label: 'Vaccine Name', placeholder: 'e.g. Rabies' },
            { name: 'administered', label: 'Date Administered', type: 'date' },
            { name: 'next_due', label: 'Next Due Date', type: 'date' },
            { name: 'vet_clinic', label: 'Vet/Clinic', placeholder: 'e.g. PawsCare Clinic' },
          ]}
          onClose={() => setShowVaxForm(false)}
          onSubmit={async (data) => {
            await addVaccination(id, data)
            toast.success('Vaccination added!')
            setShowVaxForm(false)
            load()
          }}
        />
      )}

      {/* Medical Record Form Modal */}
      {showRecordForm && (
        <QuickFormModal
          title="Add Medical Record"
          fields={[
            { name: 'title', label: 'Title', placeholder: 'e.g. Annual Checkup' },
            { name: 'description', label: 'Description', placeholder: 'Details…' },
            { name: 'diagnosed', label: 'Date Diagnosed', type: 'date' },
            { name: 'treated_by', label: 'Treated By', placeholder: 'e.g. Dr. Sharma' },
          ]}
          onClose={() => setShowRecordForm(false)}
          onSubmit={async (data) => {
            await addMedicalRecord(id, data)
            toast.success('Medical record added!')
            setShowRecordForm(false)
            load()
          }}
        />
      )}
    </div>
  )
}

function QuickFormModal({ title, fields, onClose, onSubmit }) {
  const [form, setForm] = useState(() => fields.reduce((a, f) => ({ ...a, [f.name]: '' }), {}))
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(form)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input name={f.name} type={f.type || 'text'} value={form[f.name]}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-sage-dark/30 focus:border-sage-dark outline-none transition-all"
              />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-sage-dark text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all disabled:opacity-60">
            {loading ? 'Saving…' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  )
}
