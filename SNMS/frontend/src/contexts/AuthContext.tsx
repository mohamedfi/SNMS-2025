import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../services/api'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'teacher' | 'parent'
  teacher_id?: number
  student_id?: number
  teacher?: any
  student?: any
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string, role?: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isTeacher: boolean
  isParent: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'))
  const [loading, setLoading] = useState(true)

  // Fetch user data on mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await api.get('/me')
          setUser(response.data.user)
        } catch (error) {
          console.error('Failed to fetch user:', error)
          // Token might be invalid, clear it
          localStorage.removeItem('auth_token')
          setToken(null)
        }
      }
      setLoading(false)
    }

    fetchUser()
  }, [token])

  const login = async (email: string, password: string, role?: string) => {
    try {
      const response = await api.post('/login', { email, password, role })
      const { user: userData, token: authToken } = response.data

      setUser(userData)
      setToken(authToken)
      localStorage.setItem('auth_token', authToken)
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    api.post('/logout').catch(() => {
      // Ignore logout errors
    })

    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
  }

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTeacher: user?.role === 'teacher',
    isParent: user?.role === 'parent',
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
