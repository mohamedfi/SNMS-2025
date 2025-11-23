import { useState, useEffect } from 'react'
import api from '../services/api'
import { Shield, Users as UsersIcon, Key, CheckCircle, XCircle, Plus } from 'lucide-react'

interface Role {
  id: number
  name: string
  display_name: string
  description: string
  permissions: Permission[]
}

interface Permission {
  id: number
  name: string
  display_name: string
  module: string
  description?: string
}

interface User {
  id: number
  name: string
  email: string
  roles: Role[]
}

interface Teacher {
  id: number
  first_name: string
  last_name: string
  email: string
}

interface Student {
  id: number
  first_name: string
  last_name: string
}

interface Employee {
  id: number
  first_name: string
  last_name: string
  email: string
}

const SettingsPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users')
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showCreateRole, setShowCreateRole] = useState(false)
  const [newRole, setNewRole] = useState({
    name: '',
    display_name: '',
    description: '',
    permissions: [] as number[]
  })
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [newUser, setNewUser] = useState({
    role: 'admin' as 'admin' | 'teacher' | 'parent' | 'other',
    username: '',
    email: '',
    password: '',
    teacher_id: null as number | null,
    student_id: null as number | null,
    employee_id: null as number | null
  })
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [usersRes, rolesRes, permissionsRes] = await Promise.all([
        api.get('/settings/users'),
        api.get('/roles'),
        api.get('/permissions')
      ])
      setUsers(usersRes.data)
      setRoles(rolesRes.data)
      setPermissions(permissionsRes.data)
    } catch (error) {
      console.error('Error fetching settings data:', error)
      alert('Failed to load settings data')
    } finally {
      setLoading(false)
    }
  }

  const handleAssignRole = async (userId: number, roleId: number) => {
    try {
      await api.post('/roles/assign', { user_id: userId, role_id: roleId })
      alert('Role assigned successfully!')
      fetchData()
    } catch (error) {
      console.error('Error assigning role:', error)
      alert('Failed to assign role')
    }
  }

  const handleRemoveRole = async (userId: number, roleId: number) => {
    try {
      await api.post('/roles/remove', { user_id: userId, role_id: roleId })
      alert('Role removed successfully!')
      fetchData()
    } catch (error) {
      console.error('Error removing role:', error)
      alert('Failed to remove role')
    }
  }

  const handleCreateRole = async () => {
    if (!newRole.name || !newRole.display_name) {
      alert('Please fill in role name and display name')
      return
    }

    try {
      await api.post('/roles', newRole)
      alert('Role created successfully!')
      setShowCreateRole(false)
      setNewRole({ name: '', display_name: '', description: '', permissions: [] })
      fetchData()
    } catch (error: any) {
      console.error('Error creating role:', error)
      alert(error.response?.data?.message || 'Failed to create role')
    }
  }

  const handleUpdateRolePermissions = async (roleId: number, permissionIds: number[]) => {
    try {
      await api.put(`/roles/${roleId}/permissions`, { permissions: permissionIds })
      alert('Role permissions updated successfully!')
      fetchData()
      setSelectedRole(null)
    } catch (error) {
      console.error('Error updating role permissions:', error)
      alert('Failed to update role permissions')
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/settings/teachers')
      setTeachers(response.data)
    } catch (error) {
      console.error('Error fetching teachers:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await api.get('/settings/students')
      setStudents(response.data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/settings/employees')
      setEmployees(response.data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const handleRoleChange = (role: 'admin' | 'teacher' | 'parent' | 'other') => {
    setNewUser({ ...newUser, role, teacher_id: null, student_id: null, employee_id: null })

    if (role === 'teacher') {
      fetchTeachers()
    } else if (role === 'parent') {
      fetchStudents()
    } else if (role === 'admin') {
      fetchEmployees()
    }
  }

  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert('Please fill in all required fields')
      return
    }

    // Validate entity selection based on role
    if (newUser.role === 'teacher' && !newUser.teacher_id) {
      alert('Please select a teacher')
      return
    }
    if (newUser.role === 'parent' && !newUser.student_id) {
      alert('Please select a student')
      return
    }
    if (newUser.role === 'admin' && !newUser.employee_id) {
      alert('Please select an employee')
      return
    }

    try {
      await api.post('/settings/users', newUser)
      alert('User created successfully!')
      setShowCreateUser(false)
      setNewUser({
        role: 'admin',
        username: '',
        email: '',
        password: '',
        teacher_id: null,
        student_id: null,
        employee_id: null
      })
      fetchData()
    } catch (error: any) {
      console.error('Error creating user:', error)
      alert(error.response?.data?.message || 'Failed to create user')
    }
  }

  if (loading) {
    return <div className="px-4 py-6">Loading...</div>
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings & Access Control
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage user roles and permissions
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            } flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            <UsersIcon className="h-5 w-5" />
            User Management
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`${
              activeTab === 'roles'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            } flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            <Shield className="h-5 w-5" />
            Roles & Permissions
          </button>
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          {/* User Management Header and Actions */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage system users and their access</p>
              </div>
              <button
                onClick={() => setShowCreateUser(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-md hover:shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Create New User
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Current Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <span
                          key={role.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                        >
                          {role.display_name}
                          <button
                            onClick={() => handleRemoveRole(user.id, role.id)}
                            className="ml-1 hover:text-red-600"
                          >
                            <XCircle className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      {user.roles.length === 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">No roles assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                    >
                      Manage Roles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div>
          {/* Create New Role Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowCreateRole(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              Create New Role
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{role.display_name}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{role.description}</p>
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {role.permissions.length} Permissions
                </p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((perm) => (
                    <span
                      key={perm.id}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {perm.module}
                    </span>
                  ))}
                  {role.permissions.length > 3 && (
                    <span className="text-xs text-gray-500">+{role.permissions.length - 3} more</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedRole(role)}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Edit Permissions
              </button>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 my-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Create New Role
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role Name (Internal)
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="e.g., manager"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={newRole.display_name}
                  onChange={(e) => setNewRole({ ...newRole, display_name: e.target.value })}
                  placeholder="e.g., Manager"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="Describe what this role can do"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Permissions
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  {Object.entries(permissions).map(([module, modulePerms]) => (
                    <div key={module}>
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white capitalize mb-1">{module}</h4>
                      {modulePerms.map((perm) => (
                        <label key={perm.id} className="flex items-center gap-2 cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            checked={newRole.permissions.includes(perm.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewRole({ ...newRole, permissions: [...newRole.permissions, perm.id] })
                              } else {
                                setNewRole({ ...newRole, permissions: newRole.permissions.filter(id => id !== perm.id) })
                              }
                            }}
                            className="rounded text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{perm.display_name}</span>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCreateRole}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Create Role
              </button>
              <button
                onClick={() => {
                  setShowCreateRole(false)
                  setNewRole({ name: '', display_name: '', description: '', permissions: [] })
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Manage Roles for {selectedUser.name}
            </h3>
            <div className="space-y-2">
              {roles.map((role) => {
                const hasRole = selectedUser.roles.some(r => r.id === role.id)
                return (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{role.display_name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{role.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (hasRole) {
                          handleRemoveRole(selectedUser.id, role.id)
                        } else {
                          handleAssignRole(selectedUser.id, role.id)
                        }
                        setSelectedUser(null)
                      }}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        hasRole
                          ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                      }`}
                    >
                      {hasRole ? 'Remove' : 'Assign'}
                    </button>
                  </div>
                )
              })}
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Role Permissions Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 my-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Edit Permissions for {selectedRole.display_name}
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(permissions).map(([module, modulePerms]) => (
                <div key={module} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 capitalize">{module}</h4>
                  <div className="space-y-2">
                    {modulePerms.map((perm) => {
                      const hasPermission = selectedRole.permissions.some(p => p.id === perm.id)
                      return (
                        <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hasPermission}
                            onChange={(e) => {
                              const newPermissions = e.target.checked
                                ? [...selectedRole.permissions, perm]
                                : selectedRole.permissions.filter(p => p.id !== perm.id)
                              setSelectedRole({ ...selectedRole, permissions: newPermissions })
                            }}
                            className="rounded text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{perm.display_name}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => handleUpdateRolePermissions(selectedRole.id, selectedRole.permissions.map(p => p.id))}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={() => setSelectedRole(null)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 my-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Create New User
            </h3>
            <div className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => handleRoleChange(e.target.value as 'admin' | 'teacher' | 'parent' | 'other')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Conditional Dropdown based on Role */}
              {newUser.role === 'teacher' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Teacher
                  </label>
                  <select
                    value={newUser.teacher_id || ''}
                    onChange={(e) => setNewUser({ ...newUser, teacher_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.first_name} {teacher.last_name} ({teacher.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {newUser.role === 'parent' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Student (Child)
                  </label>
                  <select
                    value={newUser.student_id || ''}
                    onChange={(e) => setNewUser({ ...newUser, student_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.first_name} {student.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {newUser.role === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Employee
                  </label>
                  <select
                    value={newUser.employee_id || ''}
                    onChange={(e) => setNewUser({ ...newUser, employee_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select an employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name} ({employee.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter password (min 8 characters)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCreateUser}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Create User
              </button>
              <button
                onClick={() => {
                  setShowCreateUser(false)
                  setNewUser({
                    role: 'admin',
                    username: '',
                    email: '',
                    password: '',
                    teacher_id: null,
                    student_id: null,
                    employee_id: null
                  })
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsPage
