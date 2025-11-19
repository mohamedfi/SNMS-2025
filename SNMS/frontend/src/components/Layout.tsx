import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../contexts/AuthContext'

const Layout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [logoError, setLogoError] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                {!logoError ? (
                  <img
                    src="/Steps_logo.jpeg"
                    alt="Steps Nursery"
                    className="h-12 w-auto mr-3"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                    Steps NMS
                  </h1>
                )}
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-2 lg:space-x-3 overflow-x-auto">
                <Link to="/" className={`${isActive('/') ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'} inline-flex items-center px-2 lg:px-3 pt-1 border-b-2 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap`}>
                  Dashboard
                </Link>
                <Link to="/students" className={`${isActive('/students') ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'} inline-flex items-center px-2 lg:px-3 pt-1 border-b-2 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap`}>
                  Students
                </Link>
                <Link to="/admissions" className={`${isActive('/admissions') ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'} inline-flex items-center px-2 lg:px-3 pt-1 border-b-2 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap`}>
                  Admissions
                </Link>
                <Link to="/teachers" className={`${isActive('/teachers') ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'} inline-flex items-center px-2 lg:px-3 pt-1 border-b-2 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap`}>
                  Teachers
                </Link>
                <Link to="/attendance" className={`${isActive('/attendance') ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'} inline-flex items-center px-2 lg:px-3 pt-1 border-b-2 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap`}>
                  Attendance
                </Link>
                <Link to="/evaluations" className={`${isActive('/evaluations') ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'} inline-flex items-center px-2 lg:px-3 pt-1 border-b-2 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap`}>
                  Evaluations
                </Link>
                <Link to="/events" className={`${isActive('/events') ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'} inline-flex items-center px-2 lg:px-3 pt-1 border-b-2 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap`}>
                  Events
                </Link>
                <Link to="/hr" className={`${isActive('/hr') ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'} inline-flex items-center px-2 lg:px-3 pt-1 border-b-2 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap`}>
                  HR
                </Link>
                <Link to="/finance" className={`${isActive('/finance') ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'} inline-flex items-center px-2 lg:px-3 pt-1 border-b-2 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap`}>
                  Finance
                </Link>
                <Link to="/inventory" className={`${isActive('/inventory') ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'} inline-flex items-center px-2 lg:px-3 pt-1 border-b-2 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap`}>
                  Inventory
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                </div>
              </div>

              <ThemeToggle />

              <button
                onClick={handleLogout}
                className="bg-primary-600 dark:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
