import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as loginAPI } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import { PawPrint, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
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
    if (!form.password) newErrors.password = 'Password is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const { data } = await loginAPI(form)
      login({ access: data.access, refresh: data.refresh, role: data.role })
      toast.success('Welcome back! 🐾')
      navigate('/', { replace: true })
    } catch (err) {
      const msg = err.response?.data
      if (typeof msg === 'object') {
        setErrors(msg)
      } else {
        toast.error(msg?.detail || 'Invalid credentials')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-sage-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <PawPrint size={32} className="text-white" />
        </div>
        <h1 className="font-display text-3xl font-bold text-gray-900">PawCare</h1>
        <p className="text-gray-400 text-sm mt-1">Your Pet's World · All In One</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className={`w-full px-4 py-3 rounded-xl border ${errors.username ? 'border-red-400' : 'border-gray-200'} bg-white focus:ring-2 focus:ring-sage-dark/30 focus:border-sage-dark outline-none transition-all`}
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPwd ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
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
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {errors.detail && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl">
            {errors.detail}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sage-dark text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-sage-dark/20 
            active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-sage-dark font-semibold">Sign Up</Link>
      </p>
    </div>
  )
}
