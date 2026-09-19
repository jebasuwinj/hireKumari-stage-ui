import { get, post, patch, del } from './client.js'

// Public.
export const listJobFairs = () => get('/job-fairs')
export const getJobFair = (slug) => get(`/job-fairs/${slug}`)

// Super admin only.
export const listJobFairsForAdmin = () => get('/admin/job-fairs')
export const createJobFair = (payload) => post('/admin/job-fairs', payload)
export const updateJobFair = (id, payload) => patch(`/admin/job-fairs/${id}`, payload)
export const deleteJobFair = (id) => del(`/admin/job-fairs/${id}`)
