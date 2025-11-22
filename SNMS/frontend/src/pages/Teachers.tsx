import { useState, useEffect } from 'react'
import api from '../services/api'

interface Teacher {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  employee_id: string
  date_of_birth: string
  gender: 'male' | 'female'
  hire_date: string
  status: 'active' | 'inactive' | 'on_leave'
  qualification: string
  years_of_experience: number
  specialization?: string
  certifications?: string
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
  emergency_contact_relation: string
  employment_type: 'full_time' | 'part_time' | 'contract'
  salary?: number
  class_assigned?: string
  notes?: string
  photo_url?: string
  created_at: string
}

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    employee_id: '',
    date_of_birth: '',
    gender: 'male' as 'male' | 'female',
    hire_date: '',
    status: 'active' as 'active' | 'inactive' | 'on_leave',
    qualification: '',
    years_of_experience: 0,
    specialization: '',
    certifications: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: '',
    employment_type: 'full_time' as 'full_time' | 'part_time' | 'contract',
    salary: '',
    class_assigned: '',
    notes: '',
  })

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/teachers')
      setTeachers(response.data)
    } catch (error) {
      console.error('Error fetching teachers:', error)
      alert('Failed to fetch teachers')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let response

      if (photoFile) {
        // Use FormData for file upload
        const formDataToSend = new FormData()
        formDataToSend.append('first_name', formData.first_name)
        formDataToSend.append('last_name', formData.last_name)
        formDataToSend.append('email', formData.email)
        formDataToSend.append('phone', formData.phone)
        formDataToSend.append('employee_id', formData.employee_id)
        formDataToSend.append('date_of_birth', formData.date_of_birth)
        formDataToSend.append('gender', formData.gender)
        formDataToSend.append('hire_date', formData.hire_date)
        formDataToSend.append('status', formData.status)
        formDataToSend.append('qualification', formData.qualification)
        formDataToSend.append('years_of_experience', formData.years_of_experience.toString())
        formDataToSend.append('specialization', formData.specialization)
        formDataToSend.append('certifications', formData.certifications)
        formDataToSend.append('address', formData.address)
        formDataToSend.append('emergency_contact_name', formData.emergency_contact_name)
        formDataToSend.append('emergency_contact_phone', formData.emergency_contact_phone)
        formDataToSend.append('emergency_contact_relation', formData.emergency_contact_relation)
        formDataToSend.append('employment_type', formData.employment_type)
        if (formData.salary) {
          formDataToSend.append('salary', formData.salary)
        }
        formDataToSend.append('class_assigned', formData.class_assigned)
        formDataToSend.append('notes', formData.notes)
        formDataToSend.append('photo', photoFile)

        if (editingTeacher) {
          // For updates with files, use POST with _method=PUT
          formDataToSend.append('_method', 'PUT')
          response = await api.post(`/teachers/${editingTeacher.id}`, formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        } else {
          response = await api.post('/teachers', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        }
      } else {
        // Use JSON for regular data
        const payload = {
          ...formData,
          salary: formData.salary ? parseFloat(formData.salary) : null,
        }

        if (editingTeacher) {
          response = await api.put(`/teachers/${editingTeacher.id}`, payload)
        } else {
          response = await api.post('/teachers', payload)
        }
      }

      alert(editingTeacher ? 'Teacher updated successfully!' : 'Teacher created successfully!')
      setShowModal(false)
      resetForm()
      fetchTeachers()
    } catch (error: any) {
      console.error('Error saving teacher:', error)
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat()
        alert('Validation errors:\n' + errors.join('\n'))
      } else {
        alert('Failed to save teacher')
      }
    }
  }

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setPhotoFile(null)
    setPhotoPreview(null)
    setFormData({
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      email: teacher.email,
      phone: teacher.phone,
      employee_id: teacher.employee_id,
      date_of_birth: teacher.date_of_birth,
      gender: teacher.gender,
      hire_date: teacher.hire_date,
      status: teacher.status,
      qualification: teacher.qualification,
      years_of_experience: teacher.years_of_experience,
      specialization: teacher.specialization || '',
      certifications: teacher.certifications || '',
      address: teacher.address,
      emergency_contact_name: teacher.emergency_contact_name,
      emergency_contact_phone: teacher.emergency_contact_phone,
      emergency_contact_relation: teacher.emergency_contact_relation,
      employment_type: teacher.employment_type,
      salary: teacher.salary?.toString() || '',
      class_assigned: teacher.class_assigned || '',
      notes: teacher.notes || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return

    try {
      await api.delete(`/teachers/${id}`)
      alert('Teacher deleted successfully!')
      fetchTeachers()
    } catch (error) {
      console.error('Error deleting teacher:', error)
      alert('Failed to delete teacher')
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const resetForm = () => {
    setEditingTeacher(null)
    setPhotoFile(null)
    setPhotoPreview(null)
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      employee_id: '',
      date_of_birth: '',
      gender: 'male',
      hire_date: '',
      status: 'active',
      qualification: '',
      years_of_experience: 0,
      specialization: '',
      certifications: '',
      address: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relation: '',
      employment_type: 'full_time',
      salary: '',
      class_assigned: '',
      notes: '',
    })
  }

  const openAddModal = () => {
    resetForm()
    setShowModal(true)
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Teachers Management</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage teacher profiles, schedules, and assignments.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-primary-600 dark:bg-primary-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-sm"
          >
            + Add New Teacher
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Loading teachers...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No teachers found. Click "Add New Teacher" to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {teacher.employee_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center space-x-3">
                        {teacher.photo_url ? (
                          <img
                            src={teacher.photo_url}
                            alt={`${teacher.first_name} ${teacher.last_name}`}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-gray-600 dark:text-gray-300 font-semibold">
                              {teacher.first_name.charAt(0)}{teacher.last_name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span>{teacher.first_name} {teacher.last_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {teacher.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {teacher.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {teacher.class_assigned || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {teacher.years_of_experience} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        teacher.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : teacher.status === 'inactive'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {teacher.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(teacher)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
              </h3>

              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Employee ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.employee_id}
                        onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Gender *
                      </label>
                      <select
                        required
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Information */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Employment Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Hire Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.hire_date}
                        onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Employment Type
                      </label>
                      <select
                        value={formData.employment_type}
                        onChange={(e) => setFormData({ ...formData, employment_type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="full_time">Full Time</option>
                        <option value="part_time">Part Time</option>
                        <option value="contract">Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="on_leave">On Leave</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Class Assigned
                      </label>
                      <input
                        type="text"
                        value={formData.class_assigned}
                        onChange={(e) => setFormData({ ...formData, class_assigned: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Salary
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Professional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Qualification *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.years_of_experience}
                        onChange={(e) => setFormData({ ...formData, years_of_experience: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Certifications
                      </label>
                      <input
                        type="text"
                        value={formData.certifications}
                        onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Emergency Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.emergency_contact_name}
                        onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.emergency_contact_phone}
                        onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Relation *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.emergency_contact_relation}
                        onChange={(e) => setFormData({ ...formData, emergency_contact_relation: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Photo Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    {(photoPreview || editingTeacher?.photo_url) && (
                      <img
                        src={photoPreview || editingTeacher?.photo_url}
                        alt="Teacher"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary-50 file:text-primary-700
                        hover:file:bg-primary-100
                        dark:file:bg-primary-900 dark:file:text-primary-300"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-sm"
                  >
                    {editingTeacher ? 'Update Teacher' : 'Create Teacher'}
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

export default Teachers
