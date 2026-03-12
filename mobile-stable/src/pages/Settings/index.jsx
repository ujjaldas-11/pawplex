import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getProfile, updateProfile, changePassword } from '../../api/auth'
import { User, Mail, Phone, Lock, LogOut, ChevronRight } from 'lucide-react'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user, setUser, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [showPwdForm, setShowPwdForm] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    getProfile()
      .then(({ data }) => { setProfile(data); setForm(data) })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    try {
      const { data } = await updateProfile({
        username: form.username,
        email: form.email,
        phone: form.phone,
        first_name: form.first_name,
        last_name: form.last_name,
      })
      setProfile(data)
      setUser(data)
      setEditing(false)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update')
    }
  }

  if (loading) return <LoadingSpinner text="Loading profile…" />

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-sage-dark px-5 pt-12 pb-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center text-4xl mb-3">
          {profile?.username?.[0]?.toUpperCase() || '👤'}
        </div>
        <h1 className="font-display text-xl font-bold text-white">{profile?.first_name || profile?.username}</h1>
        <p className="text-sage-light text-sm mt-0.5">{profile?.email}</p>
        <span className="mt-2 text-[10px] bg-white/15 text-white px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
          {profile?.role || 'owner'}
        </span>
      </div>

      <div className="px-5 py-5 space-y-3 pb-24">
        {/* Profile Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <h2 className="font-semibold text-sm text-gray-900">Profile Information</h2>
            <button onClick={() => editing ? handleSave() : setEditing(true)}
              className="text-xs text-sage-dark font-semibold">
              {editing ? 'Save' : 'Edit'}
            </button>
          </div>

          <ProfileField icon={User} label="Username" value={form.username}
            editing={editing} onChange={(v) => setForm({ ...form, username: v })} />
          <ProfileField icon={Mail} label="Email" value={form.email}
            editing={editing} onChange={(v) => setForm({ ...form, email: v })} />
          <ProfileField icon={Phone} label="Phone" value={form.phone || ''}
            editing={editing} onChange={(v) => setForm({ ...form, phone: v })} />
          <ProfileField icon={User} label="First Name" value={form.first_name || ''}
            editing={editing} onChange={(v) => setForm({ ...form, first_name: v })} />
          <ProfileField icon={User} label="Last Name" value={form.last_name || ''}
            editing={editing} onChange={(v) => setForm({ ...form, last_name: v })} />
        </div>

        {/* Change Password */}
        <button onClick={() => setShowPwdForm(!showPwdForm)}
          className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 flex items-center gap-3">
          <Lock size={18} className="text-gray-400" />
          <span className="flex-1 text-sm font-medium text-gray-900 text-left">Change Password</span>
          <ChevronRight size={16} className="text-gray-300" />
        </button>

        {showPwdForm && <PasswordForm onDone={() => setShowPwdForm(false)} />}

        {/* Logout */}
        <button onClick={logout}
          className="w-full bg-white rounded-2xl shadow-sm border border-red-100 px-4 py-4 flex items-center gap-3 text-red-500">
          <LogOut size={18} />
          <span className="flex-1 text-sm font-semibold text-left">Log Out</span>
        </button>
      </div>
    </div>
  )
}

function ProfileField({ icon: Icon, label, value, editing, onChange }) {
  return (
    <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-50 last:border-0">
      <Icon size={16} className="text-gray-400 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
        {editing ? (
          <input value={value || ''} onChange={(e) => onChange(e.target.value)}
            className="w-full text-sm text-gray-900 py-1 outline-none bg-transparent border-b border-gray-200 focus:border-sage-dark" />
        ) : (
          <p className="text-sm text-gray-900">{value || '—'}</p>
        )}
      </div>
    </div>
  )
}

function PasswordForm({ onDone }) {
  const [form, setForm] = useState({ old_password: '', new_password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.old_password || !form.new_password) { toast.error('Fill both fields'); return }
    setLoading(true)
    try {
      await changePassword(form)
      toast.success('Password changed!')
      onDone()
    } catch (err) {
      toast.error(err.response?.data?.detail || err.response?.data?.old_password?.[0] || 'Failed to change password')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
      <input type="password" value={form.old_password} onChange={(e) => setForm({ ...form, old_password: e.target.value })}
        placeholder="Current password" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none text-sm" />
      <input type="password" value={form.new_password} onChange={(e) => setForm({ ...form, new_password: e.target.value })}
        placeholder="New password" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none text-sm" />
      <button type="submit" disabled={loading}
        className="w-full bg-sage-dark text-white py-3 rounded-xl font-semibold text-sm active:scale-[0.98] disabled:opacity-60">
        {loading ? 'Changing…' : 'Change Password'}
      </button>
    </form>
  )
}
