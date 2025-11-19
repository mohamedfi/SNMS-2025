import { useState, useEffect } from 'react'
import api from '../services/api'

interface Student {
  id: number
  first_name: string
  last_name: string
}

interface Teacher {
  id: number
  first_name: string
  last_name: string
}

interface Evaluation {
  id: number
  student_id: number
  teacher_id: number
  subject: string
  evaluation_date: string
  score: number
  grade: string
  comments: string
  type: string
  created_at: string
  student?: Student
  teacher?: Teacher
}

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null)
  const [formData, setFormData] = useState({
    student_id: '',
    teacher_id: '',
    subject: '',
    evaluation_date: '',
    score: '',
    grade: '',
    comments: '',
    type: 'quiz'
  })

  useEffect(() => {
    fetchEvaluations()
    fetchStudents()
    fetchTeachers()
  }, [])

  const fetchEvaluations = async () => {
    try {
      const response = await api.get('/evaluations')
      setEvaluations(response.data)
    } catch (error) {
      console.error('Error fetching evaluations:', error)
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

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/teachers')
      setTeachers(response.data)
    } catch (error) {
      console.error('Error fetching teachers:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingEvaluation) {
        await api.put(`/evaluations/${editingEvaluation.id}`, formData)
      } else {
        await api.post('/evaluations', formData)
      }

      fetchEvaluations()
      closeModal()
    } catch (error) {
      console.error('Error saving evaluation:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this evaluation?')) return

    try {
      await api.delete(`/evaluations/${id}`)
      fetchEvaluations()
    } catch (error) {
      console.error('Error deleting evaluation:', error)
    }
  }

  const openModal = (evaluation?: Evaluation) => {
    if (evaluation) {
      setEditingEvaluation(evaluation)
      setFormData({
        student_id: evaluation.student_id.toString(),
        teacher_id: evaluation.teacher_id.toString(),
        subject: evaluation.subject,
        evaluation_date: evaluation.evaluation_date,
        score: evaluation.score.toString(),
        grade: evaluation.grade,
        comments: evaluation.comments,
        type: evaluation.type
      })
    } else {
      setEditingEvaluation(null)
      setFormData({
        student_id: '',
        teacher_id: '',
        subject: '',
        evaluation_date: new Date().toISOString().split('T')[0],
        score: '',
        grade: '',
        comments: '',
        type: 'quiz'
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingEvaluation(null)
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'B': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'C': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'D': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'test': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
      case 'assignment': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
      case 'project': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStudentName = (studentId: number) => {
    const student = students.find(s => s.id === studentId)
    return student ? `${student.first_name} ${student.last_name}` : 'Unknown'
  }

  const getTeacherName = (teacherId: number) => {
    const teacher = teachers.find(t => t.id === teacherId)
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown'
  }

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-600 dark:text-gray-400">Loading evaluations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Evaluations & Progress</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Track student evaluations, skills assessment, and progress reports.
        </p>

        <div className="mb-6">
          <button
            onClick={() => openModal()}
            className="bg-primary-600 dark:bg-primary-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-sm"
          >
            New Evaluation
          </button>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          {evaluations.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No evaluations recorded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teacher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {evaluations.map((evaluation) => (
                    <tr key={evaluation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {getStudentName(evaluation.student_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {getTeacherName(evaluation.teacher_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {evaluation.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(evaluation.type)}`}>
                          {evaluation.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {evaluation.score}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(evaluation.grade)}`}>
                          {evaluation.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(evaluation.evaluation_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => openModal(evaluation)}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(evaluation.id)}
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
                {editingEvaluation ? 'Edit Evaluation' : 'New Evaluation'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Student *
                    </label>
                    <select
                      value={formData.student_id}
                      onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.first_name} {student.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Teacher *
                    </label>
                    <select
                      value={formData.teacher_id}
                      onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.first_name} {teacher.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="quiz">Quiz</option>
                      <option value="test">Test</option>
                      <option value="assignment">Assignment</option>
                      <option value="project">Project</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Score (%) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.score}
                      onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Grade *
                    </label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Grade</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="F">F</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Evaluation Date *
                    </label>
                    <input
                      type="date"
                      value={formData.evaluation_date}
                      onChange={(e) => setFormData({ ...formData, evaluation_date: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Comments
                  </label>
                  <textarea
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
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
                    {editingEvaluation ? 'Update' : 'Create'}
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

export default Evaluations
