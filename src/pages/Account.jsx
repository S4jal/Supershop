import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Account() {
  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })

  // Redirect if already logged in
  if (user) {
    navigate('/profile', { replace: true })
    return null
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        await signIn(form.email, form.password)
        toast.success('Welcome back!')
        navigate('/profile')
      } else {
        if (!form.name || !form.phone) {
          toast.error('Please fill all fields')
          setLoading(false)
          return
        }
        await signUp(form.email, form.password, form.name, form.phone)
        toast.success('Account created! Please check your email to verify.')
        setIsLogin(true)
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl border p-6">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{isLogin ? 'Sign In' : 'Create Account'}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? 'Welcome back to Alam Nagar Super Shop' : 'Join Alam Nagar Super Shop'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name"
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX"
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary-600 text-white font-semibold py-2.5 rounded-lg hover:bg-primary-700 transition disabled:opacity-50">
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-5">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary-600 hover:text-primary-700">
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}
