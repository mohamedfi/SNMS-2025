const Attendance = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Attendance Management</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Track and manage student and teacher attendance.
        </p>

        <div className="mb-6 flex space-x-4">
          <button className="bg-primary-600 dark:bg-primary-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-sm">
            Mark Attendance
          </button>
          <button className="bg-gray-600 dark:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow-sm">
            View Reports
          </button>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Select a date to view or mark attendance.</p>
        </div>
      </div>
    </div>
  )
}

export default Attendance
