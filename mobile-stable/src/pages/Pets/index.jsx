import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPets, createPet } from '../../api/pets'
import { Plus, X } from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Pets() {
  const navigate = useNavigate()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadPets()
  }, [])

  async function loadPets() {
    try {
      const { data } = await getPets()
      setPets(Array.isArray(data) ? data : data.results || [])
    } catch {
      toast.error('Failed to load pets')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner text="Loading your pets…" />

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-sage-dark px-5 pt-12 pb-6">
        <h1 className="font-display text-2xl font-bold text-white">My Pets</h1>
        <p className="text-sage-light text-sm mt-1">{pets.length} pet{pets.length !== 1 ? 's' : ''} registered</p>
      </div>

      <div className="px-5 py-4 space-y-3">
        {pets.length === 0 && (
          <div className="text-center py-12">
            <span className="text-5xl block mb-3">🐾</span>
            <p className="text-gray-500 font-medium">No pets yet</p>
            <p className="text-gray-400 text-sm mt-1">Add your first pet to get started!</p>
          </div>
        )}

        {pets.map((pet) => {
          const emoji = pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐈' : pet.species === 'bird' ? '🐦' : '🐾'
          return (
            <button
              key={pet.id}
              onClick={() => navigate(`/pets/${pet.id}`)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-sage-dark/10 flex items-center justify-center text-3xl flex-shrink-0">
                {emoji}
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-base text-gray-900">{pet.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {pet.breed || pet.species} · {pet.gender || ''} {pet.weight ? `· ${pet.weight}kg` : ''}
                </p>
              </div>
              <div className="text-gray-300">›</div>
            </button>
          )
        })}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-sage-dark text-white rounded-full shadow-lg shadow-sage-dark/30 flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        <Plus size={24} />
      </button>

      {/* Add Pet Modal */}
      {showForm && (
        <AddPetModal
          onClose={() => setShowForm(false)}
          onCreated={() => { setShowForm(false); loadPets() }}
        />
      )}
    </div>
  )
}

function AddPetModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '', species: 'dog', breed: '', dob: '', gender: 'male', weight: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setErrors({ name: 'Name is required' }); return }

    setLoading(true)
    try {
      await createPet({ ...form, weight: form.weight ? parseFloat(form.weight) : undefined })
      toast.success(`${form.name} added! 🎉`)
      onCreated()
    } catch (err) {
      const msg = err.response?.data
      if (typeof msg === 'object') setErrors(msg)
      else toast.error('Failed to add pet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-gray-900">Add New Pet</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Pet Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="e.g. Buddy" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
              <select name="species" value={form.species} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none">
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <Field label="Breed" name="breed" value={form.breed} onChange={handleChange} error={errors.breed} placeholder="e.g. Labrador" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} error={errors.dob} />
            <Field label="Weight (kg)" name="weight" type="number" value={form.weight} onChange={handleChange} error={errors.weight} placeholder="e.g. 12" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-sage-dark text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-sage-dark/20 active:scale-[0.98] transition-all disabled:opacity-60">
            {loading ? 'Adding…' : 'Add Pet'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, name, type = 'text', value, onChange, error, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-400' : 'border-gray-200'} bg-white focus:ring-2 focus:ring-sage-dark/30 focus:border-sage-dark outline-none transition-all`} />
      {error && <p className="text-red-500 text-xs mt-1">{Array.isArray(error) ? error[0] : error}</p>}
    </div>
  )
}
