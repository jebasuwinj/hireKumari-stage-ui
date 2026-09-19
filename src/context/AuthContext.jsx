import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/auth.js'
import { getToken, setToken } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [company, setCompany] = useState(null)
  // `loading` covers the initial "restore session from stored token" check on first load.
  const [loading, setLoading] = useState(true)

  const clearSession = useCallback(() => {
    setToken(null)
    setUser(null)
    setCompany(null)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function restore() {
      if (!getToken()) {
        setLoading(false)
        return
      }
      try {
        const { data } = await authApi.me()
        if (cancelled) return
        setUser({ id: data.id, email: data.email, role: data.role })
        setCompany(data.company || null)
      } catch {
        if (!cancelled) clearSession()
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [clearSession])

  const login = useCallback(async (identifier, password) => {
    const { data } = await authApi.login(identifier, password)
    setToken(data.token)
    setUser(data.user)
    setCompany(data.company || null)
    return data
  }, [])

  const logout = useCallback(() => {
    clearSession()
  }, [clearSession])

  const refreshCompany = useCallback(async () => {
    const { data } = await authApi.me()
    setCompany(data.company || null)
    return data.company
  }, [])

  const value = useMemo(
    () => ({ user, company, role: user?.role ?? null, loading, login, logout, refreshCompany }),
    [user, company, loading, login, logout, refreshCompany],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
