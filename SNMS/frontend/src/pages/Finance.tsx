import { useState, useEffect } from 'react'
import api from '../services/api'

interface Student {
  id: number
  first_name: string
  last_name: string
}

interface Transaction {
  id: number
  student_id: number | null
  transaction_type: string
  amount: number
  transaction_date: string
  payment_method: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  reference_number: string
  description: string
  created_at: string
  student?: Student
}

const Finance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [formData, setFormData] = useState({
    student_id: '',
    transaction_type: '',
    amount: '',
    transaction_date: '',
    payment_method: 'cash',
    status: 'completed',
    reference_number: '',
    description: ''
  })

  useEffect(() => {
    fetchTransactions()
    fetchStudents()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions')
      setTransactions(response.data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students')
      setStudents(response.data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const transactionData = {
        ...formData,
        student_id: formData.student_id || null
      }

      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction.id}`, transactionData)
      } else {
        await api.post('/transactions', transactionData)
      }

      fetchTransactions()
      closeModal()
    } catch (error) {
      console.error('Error saving transaction:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return

    try {
      await api.delete(`/transactions/${id}`)
      fetchTransactions()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  const openModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction)
      setFormData({
        student_id: transaction.student_id?.toString() || '',
        transaction_type: transaction.transaction_type,
        amount: transaction.amount.toString(),
        transaction_date: transaction.transaction_date,
        payment_method: transaction.payment_method,
        status: transaction.status,
        reference_number: transaction.reference_number,
        description: transaction.description
      })
    } else {
      setEditingTransaction(null)
      setFormData({
        student_id: '',
        transaction_type: '',
        amount: '',
        transaction_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        status: 'completed',
        reference_number: 'TXN-' + Date.now(),
        description: ''
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTransaction(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'refunded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'card': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'bank_transfer': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'online': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStudentName = (studentId: number | null) => {
    if (!studentId) return 'N/A'
    const student = students.find(s => s.id === studentId)
    return student ? `${student.first_name} ${student.last_name}` : 'Unknown'
  }

  const calculateTotal = () => {
    return transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)
  }

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-600 dark:text-gray-400">Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Finance & Accounting</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Manage invoices, expenses, payments, and financial reports.
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              EGP {calculateTotal().toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Transactions</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {transactions.length}
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              {transactions.filter(t => t.status === 'pending').length}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => openModal()}
            className="bg-primary-600 dark:bg-primary-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-sm"
          >
            New Transaction
          </button>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          {transactions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions recorded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.reference_number}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.description.substring(0, 30)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {getStudentName(transaction.student_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {transaction.transaction_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                        EGP {parseFloat(transaction.amount.toString()).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentMethodColor(transaction.payment_method)}`}>
                          {transaction.payment_method.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.transaction_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => openModal(transaction)}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Student (Optional)
                    </label>
                    <select
                      value={formData.student_id}
                      onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">No Student (General)</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.first_name} {student.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Transaction Type *
                    </label>
                    <input
                      type="text"
                      value={formData.transaction_type}
                      onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
                      required
                      placeholder="e.g., Tuition Fee, Registration, Activity Fee"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount (EGP) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Transaction Date *
                    </label>
                    <input
                      type="date"
                      value={formData.transaction_date}
                      onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Payment Method *
                    </label>
                    <select
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="online">Online</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reference Number *
                    </label>
                    <input
                      type="text"
                      value={formData.reference_number}
                      onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    {editingTransaction ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Finance
