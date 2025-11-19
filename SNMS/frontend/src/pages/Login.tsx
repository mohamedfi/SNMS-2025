import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

type Role = 'admin' | 'teacher' | 'parent'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const roles = [
    {
      id: 'admin',
      name: 'Admin',
      description: 'Full system access',
      icon: '👨‍💼',
      gradient: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'teacher',
      name: 'Teacher',
      description: 'Manage students & classes',
      icon: '👩‍🏫',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      id: 'parent',
      name: 'Parent',
      description: 'View child information',
      icon: '👪',
      gradient: 'from-pink-500 to-rose-600',
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedRole) {
      setError('Please select a portal')
      return
    }

    setLoading(true)

    try {
      await login(email, password, selectedRole)
      navigate('/')
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/Steps_logo.jpeg"
              alt="Steps Nursery"
              className="h-20 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Steps Nursery Management System
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Select your portal and sign in
          </p>
        </div>

        {/* Role Selection */}
        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id as Role)}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary-500"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className="text-6xl mb-4">{role.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {role.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {role.description}
                  </p>
                  <div className="mt-6">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${role.gradient}`}>
                      Sign in as {role.name}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Login Form */
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              {/* Selected Role Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 text-white text-3xl mb-3">
                  {roles.find((r) => r.id === selectedRole)?.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {roles.find((r) => r.id === selectedRole)?.name} Portal
                </h3>
                <button
                  onClick={() => {
                    setSelectedRole(null)
                    setError('')
                    setEmail('')
                    setPassword('')
                  }}
                  className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  ← Change portal
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
                    <div className="text-sm text-red-700 dark:text-red-400">{error}</div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Demo Credentials:</p>
                {selectedRole === 'admin' && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <p>Email: <span className="font-mono">admin@steps.com</span></p>
                    <p>Password: <span className="font-mono">password123</span></p>
                  </div>
                )}
                {selectedRole === 'teacher' && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <p>Email: <span className="font-mono">sarah.johnson@steps.com</span></p>
                    <p>Password: <span className="font-mono">teacher123</span></p>
                  </div>
                )}
                {selectedRole === 'parent' && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <p>Email: <span className="font-mono">robert.smith@email.com</span></p>
                    <p>Password: <span className="font-mono">parent123</span></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
