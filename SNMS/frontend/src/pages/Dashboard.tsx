import { useEffect, useState } from 'react'
import api from '../services/api'

interface DashboardStats {
  total_students: number
  total_teachers: number
  today_attendance: number
  pending_payments: number
}

const Dashboard = () => {
  const [apiStatus, setApiStatus] = useState<string>('')
  const [stats, setStats] = useState<DashboardStats>({
    total_students: 0,
    total_teachers: 0,
    today_attendance: 0,
    pending_payments: 0
  })
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Test API connection
    api.get('/')
      .then((response) => {
        setApiStatus(`Connected to Laravel ${response.data.Laravel}`)
      })
      .catch((error) => {
        setApiStatus(`Error: ${error.message}`)
      })

    // Fetch dashboard statistics
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await api.get('/dashboard/stats')
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to SNMS Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Steps Nursery Management System - Admin Portal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 p-3 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Students</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                    {loading ? '...' : stats.total_students}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-3 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Teachers</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                    {loading ? '...' : stats.total_teachers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Today's Attendance</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                    {loading ? '...' : `${stats.today_attendance}%`}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 p-3 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Pending Payments</dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                    {loading ? '...' : `$${stats.pending_payments}`}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Status */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${apiStatus.includes('Connected') ? 'bg-green-500' : 'bg-red-500'}`}></span>
          Backend API Status
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{apiStatus || 'Connecting...'}</p>
      </div>
    </div>
  )
}

export default Dashboard
