import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  ClipboardCheck,
  BookOpen,
  Calendar,
  Briefcase,
  DollarSign,
  Package,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react'

const Layout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [logoError, setLogoError] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/students', label: 'Students', icon: Users },
    { path: '/admissions', label: 'Admissions', icon: GraduationCap },
    { path: '/teachers', label: 'Teachers', icon: UserCheck },
    { path: '/attendance', label: 'Attendance', icon: ClipboardCheck },
    { path: '/evaluations', label: 'Evaluations', icon: BookOpen },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/hr', label: 'HR', icon: Briefcase },
    { path: '/finance', label: 'Finance', icon: DollarSign },
    { path: '/inventory', label: 'Inventory', icon: Package }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="w-full px-3 sm:px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Round Shape */}
            <div className="flex-shrink-0 flex items-center gap-3">
              {!logoError ? (
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary-200 dark:ring-primary-700 shadow-md">
                  <img
                    src="/Steps_logo.jpeg"
                    alt="Steps Nursery"
                    className="w-full h-full object-cover"
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
              )}
              <h1 className="hidden sm:block text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                Steps NMS
              </h1>
            </div>

            {/* Desktop Menu - Icons on top, text below */}
            <div className="hidden lg:flex items-center gap-2 flex-1 justify-center px-4">
              {menuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`${
                      active
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                    } flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 min-w-[70px] group`}
                  >
                    <Icon className={`${active ? 'h-6 w-6' : 'h-5 w-5'} mb-1 group-hover:scale-110 transition-transform`} />
                    <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right Side - User Info & Actions */}
            <div className="flex items-center gap-3">
              {/* User Info - Desktop */}
              <div className="hidden xl:flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize leading-tight">{user?.role}</p>
                </div>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Logout Button - Desktop */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-primary-700 hover:to-primary-800 dark:hover:from-primary-600 dark:hover:to-primary-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="px-4 pt-3 pb-4 space-y-2">
              {/* Mobile User Info */}
              <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 flex items-center justify-center shadow-md">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                </div>
              </div>

              {/* Mobile Menu Items */}
              {menuItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`${
                      active
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-l-4 border-primary-500 shadow-sm'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-transparent'
                    } flex items-center gap-4 px-4 py-3 text-base font-medium transition-all duration-200 rounded-r-xl`}
                  >
                    <Icon className="h-6 w-6" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {/* Mobile Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 mt-3 text-base font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 hover:from-primary-700 hover:to-primary-800 transition-all duration-200 rounded-xl shadow-md hover:shadow-lg"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
