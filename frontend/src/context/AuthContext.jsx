import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('washhub_token'))
  const [loading, setLoading] = useState(true)

  // Restore user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('washhub_user')
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('washhub_user')
      }
    }
    setLoading(false)
  }, [token])

  const login = useCallback(async (email, password) => {
    const response = await authService.login(email, password)
    const { user: userData, token: authToken } = response.data

    localStorage.setItem('washhub_token', authToken)
    localStorage.setItem('washhub_user', JSON.stringify(userData))

    setToken(authToken)
    setUser(userData)

    return userData
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Proceed even if API call fails
    } finally {
      localStorage.removeItem('washhub_token')
      localStorage.removeItem('washhub_user')
      setToken(null)
      setUser(null)
    }
  }, [])

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('washhub_user', JSON.stringify(updatedUser))
  }, [])

  const isAuthenticated = Boolean(token && user)

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
