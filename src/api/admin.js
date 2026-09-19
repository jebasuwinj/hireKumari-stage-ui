import { get } from './client.js'

// Super admin only.
export const getDashboard = () => get('/admin/dashboard')
