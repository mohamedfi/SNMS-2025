import { useState, useEffect } from 'react'
import api from '../services/api'
import { X } from 'lucide-react'

interface Student {
  id: number
  first_name: string
  last_name: string
  date_of_birth: string
  gender: 'male' | 'female'
  student_id: string
  enrollment_date: string
  status: 'active' | 'inactive' | 'graduated'
  parent_name: string
  parent_phone: string
  parent_email?: string
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
  emergency_contact_relation: string
  medical_conditions?: string
  allergies?: string
  blood_type?: string
  class_assigned?: string
  notes?: string
  created_at: string
}

interface Attendance {
  id: number
  student_id: number
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  check_in_time?: string
  check_out_time?: string
  notes?: string
  created_at: string
  student?: Student
}

const Attendance = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showStudentDetail, setShowStudentDetail] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null)
  const [validationError, setValidationError] = useState<string>('')
  const [formData, setFormData] = useState({
    student_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present' as 'present' | 'absent' | 'late' | 'excused',
    check_in_time: '',
    check_out_time: '',
    notes: '',
  })

  useEffect(() => {
    fetchAttendances()
    fetchStudents()
  }, [])

  const fetchAttendances = async () => {
    try {
      const response = await api.get('/attendances')
      setAttendances(response.data)
    } catch (error) {
      console.error('Error fetching attendances:', error)
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
    setValidationError('')

    try {
      // Prepare data, converting empty strings to null for optional time fields
      const submitData = {
        ...formData,
        check_in_time: formData.check_in_time || null,
        check_out_time: formData.check_out_time || null,
        notes: formData.notes || null,
      }

      if (editingAttendance) {
        await api.put(`/attendances/${editingAttendance.id}`, submitData)
        alert('Attendance updated successfully!')
      } else {
        await api.post('/attendances', submitData)
        alert('Attendance recorded successfully!')
      }
      setShowModal(false)
      resetForm()
      fetchAttendances()
    } catch (error: any) {
      console.error('Error saving attendance:', error)
      if (error.response?.data?.errors) {
        const errors = Object.entries(error.response.data.errors)
          .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n')
        setValidationError(errors)
      } else {
        setValidationError(error.response?.data?.message || 'Failed to save attendance')
      }
    }
  }

  const handleViewStudent = async (studentId: number) => {
    try {
      const response = await api.get(`/students/${studentId}`)
      setSelectedStudent(response.data)
      setShowStudentDetail(true)
    } catch (error) {
      console.error('Error fetching student details:', error)
      alert('Failed to load student information')
    }
  }

  const handleEdit = (attendance: Attendance) => {
    setEditingAttendance(attendance)
    setFormData({
      student_id: attendance.student_id.toString(),
      date: attendance.date,
      status: attendance.status,
      check_in_time: attendance.check_in_time || '',
      check_out_time: attendance.check_out_time || '',
      notes: attendance.notes || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return
    try {
      await api.delete(`/attendances/${id}`)
      alert('Attendance deleted successfully!')
      fetchAttendances()
    } catch (error) {
      console.error('Error deleting attendance:', error)
      alert('Failed to delete attendance')
    }
  }

  const resetForm = () => {
    setEditingAttendance(null)
    setValidationError('')
    setFormData({
      student_id: '',
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      check_in_time: '',
      check_out_time: '',
      notes: '',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'absent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'late': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'excused': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  if (loading) {
    return <div className="px-4 py-6">Loading...</div>
  }

  return (
    <div className="px-4 py-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Management</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track student attendance records</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true) }}
            className="bg-primary-600 dark:bg-primary-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-sm"
          >
            Mark Attendance
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Notes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No attendance records found. Click "Mark Attendance" to create one.
                  </td>
                </tr>
              ) : (
                attendances.map((attendance) => (
                  <tr key={attendance.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewStudent(attendance.student_id)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 hover:underline font-medium"
                      >
                        {attendance.student ? `${attendance.student.first_name} ${attendance.student.last_name}` : `Student #${attendance.student_id}`}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(attendance.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(attendance.status)}`}>
                        {attendance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {attendance.check_in_time || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {attendance.check_out_time || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {attendance.notes || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEdit(attendance)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4">Edit</button>
                      <button onClick={() => handleDelete(attendance.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingAttendance ? 'Edit Attendance' : 'Mark Attendance'}
              </h3>

              {/* Validation Error Display */}
              {validationError && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-300 font-medium whitespace-pre-line">
                    {validationError}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student *</label>
                    <select
                      required
                      value={formData.student_id}
                      onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.first_name} {student.last_name} ({student.student_id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status *</label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="excused">Excused</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check In Time</label>
                    <input
                      type="time"
                      value={formData.check_in_time}
                      onChange={(e) => setFormData({...formData, check_in_time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check Out Time</label>
                    <input
                      type="time"
                      value={formData.check_out_time}
                      onChange={(e) => setFormData({...formData, check_out_time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm() }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    {editingAttendance ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {showStudentDetail && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedStudent.first_name} {selectedStudent.last_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Student ID: {selectedStudent.student_id}
                  </p>
                </div>
                <button
                  onClick={() => setShowStudentDetail(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Student Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Personal Information
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Date of Birth</label>
                    <p className="text-gray-900 dark:text-white">{new Date(selectedStudent.date_of_birth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Gender</label>
                    <p className="text-gray-900 dark:text-white capitalize">{selectedStudent.gender}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedStudent.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      selectedStudent.status === 'inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Enrollment Date</label>
                    <p className="text-gray-900 dark:text-white">{new Date(selectedStudent.enrollment_date).toLocaleDateString()}</p>
                  </div>
                  {selectedStudent.class_assigned && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Class</label>
                      <p className="text-gray-900 dark:text-white">{selectedStudent.class_assigned}</p>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Parent/Guardian Contact
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Parent Name</label>
                    <p className="text-gray-900 dark:text-white">{selectedStudent.parent_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                    <p className="text-gray-900 dark:text-white">{selectedStudent.parent_phone}</p>
                  </div>
                  {selectedStudent.parent_email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                      <p className="text-gray-900 dark:text-white">{selectedStudent.parent_email}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Address</label>
                    <p className="text-gray-900 dark:text-white">{selectedStudent.address}</p>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Emergency Contact
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Contact Name</label>
                    <p className="text-gray-900 dark:text-white">{selectedStudent.emergency_contact_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                    <p className="text-gray-900 dark:text-white">{selectedStudent.emergency_contact_phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Relation</label>
                    <p className="text-gray-900 dark:text-white">{selectedStudent.emergency_contact_relation}</p>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Medical Information
                  </h4>
                  {selectedStudent.blood_type && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Blood Type</label>
                      <p className="text-gray-900 dark:text-white">{selectedStudent.blood_type}</p>
                    </div>
                  )}
                  {selectedStudent.allergies && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Allergies</label>
                      <p className="text-gray-900 dark:text-white">{selectedStudent.allergies}</p>
                    </div>
                  )}
                  {selectedStudent.medical_conditions && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Medical Conditions</label>
                      <p className="text-gray-900 dark:text-white">{selectedStudent.medical_conditions}</p>
                    </div>
                  )}
                  {!selectedStudent.blood_type && !selectedStudent.allergies && !selectedStudent.medical_conditions && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">No medical information available</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedStudent.notes && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                    Additional Notes
                  </h4>
                  <p className="text-gray-900 dark:text-white whitespace-pre-line">{selectedStudent.notes}</p>
                </div>
              )}

              {/* Close Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowStudentDetail(false)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Attendance
