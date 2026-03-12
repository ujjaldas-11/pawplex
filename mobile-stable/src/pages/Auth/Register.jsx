import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerAPI, login as loginAPI } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import { PawPrint, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
  })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    // Basic validation
    const newErrors = {}
    if (!form.username.trim()) newErrors.username = 'Username is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    if (!form.password) newErrors.password = 'Password is required'
    if (form.password !== form.password2) newErrors.password2 = 'Passwords do not match'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      // Register
      await registerAPI(form)

      // Auto-login after registration
      const { data } = await loginAPI({
        username: form.username,
        password: form.password,
      })
      login({ access: data.access, refresh: data.refresh, role: data.role })
      toast.success('Account created! Welcome 🎉')
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Registration error:', err);
      if (!err.response) {
        // Network error (backend down or CORS)
        toast.error(`Connection failed: ${err.message}. Is the backend running?`);
      } else {
        const msg = err.response.data
        if (typeof msg === 'object') {
          setErrors(msg)
          const firstError = Object.values(msg).flat()[0]
          if (firstError) toast.error(typeof firstError === 'string' ? firstError : 'Registration failed')
        } else {
          toast.error('Registration failed. Please try again later.')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-8">
      {/* Logo */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-sage-dark rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <PawPrint size={28} className="text-white" />
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-400 text-sm mt-1">Join the PawCare family</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3.5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="Choose a username"
            className={`w-full px-4 py-3 rounded-xl border ${errors.username ? 'border-red-400' : 'border-gray-200'} bg-white focus:ring-2 focus:ring-sage-dark/30 focus:border-sage-dark outline-none transition-all`}
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{Array.isArray(errors.username) ? errors.username[0] : errors.username}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200'} bg-white focus:ring-2 focus:ring-sage-dark/30 focus:border-sage-dark outline-none transition-all`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{Array.isArray(errors.email) ? errors.email[0] : errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 XXXXX XXXXX"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-sage-dark/30 focus:border-sage-dark outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPwd ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-400' : 'border-gray-200'} bg-white focus:ring-2 focus:ring-sage-dark/30 focus:border-sage-dark outline-none transition-all pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{Array.isArray(errors.password) ? errors.password[0] : errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            name="password2"
            type="password"
            value={form.password2}
            onChange={handleChange}
            placeholder="Re-enter password"
            className={`w-full px-4 py-3 rounded-xl border ${errors.password2 ? 'border-red-400' : 'border-gray-200'} bg-white focus:ring-2 focus:ring-sage-dark/30 focus:border-sage-dark outline-none transition-all`}
          />
          {errors.password2 && <p className="text-red-500 text-xs mt-1">{Array.isArray(errors.password2) ? errors.password2[0] : errors.password2}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sage-dark text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-sage-dark/20 
            active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="mt-5 text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-sage-dark font-semibold">Sign In</Link>
      </p>
    </div>
  )
}
