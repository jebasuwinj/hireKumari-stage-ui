import { get, patch, post } from './client.js'

// Public.
export const submitContact = (payload) => post('/contact', payload)

// Super admin only.
export const listContactMessages = (query) => get('/admin/contact-messages', query)
export const updateContactStatus = (id, status) => patch(`/admin/contact-messages/${id}`, { status })
