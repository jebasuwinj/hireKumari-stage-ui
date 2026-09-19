import { get, post } from './client.js'

export const register = (formData) => post('/auth/register', formData)
export const login = (identifier, password) => post('/auth/login', { identifier, password })
export const me = () => get('/auth/me')
export const forgotPassword = (email) => post('/auth/forgot-password', { email })
export const resetPassword = (token, password) => post(`/auth/reset-password/${token}`, { password })
export const changePassword = (currentPassword, newPassword) =>
  post('/auth/change-password', { currentPassword, newPassword })
