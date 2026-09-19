import { get, post, patch, del } from './client.js'

// Public.
export const listJobs = (query) => get('/jobs', query)
export const getJob = (slug) => get(`/jobs/${slug}`)
export const applyToJob = (jobId, formData) => post(`/jobs/${jobId}/apply`, formData)

// The logged-in company's own postings.
export const listMyJobs = (status) => get('/company/jobs', status ? { status } : undefined)
export const getMyJob = (id) => get(`/company/jobs/${id}`)
export const createJob = (payload) => post('/company/jobs', payload)
export const updateJob = (id, payload) => patch(`/company/jobs/${id}`, payload)
export const updateJobStatus = (id, status) => patch(`/company/jobs/${id}/status`, { status })
export const deleteJob = (id) => del(`/company/jobs/${id}`)

// Super admin only.
export const listJobsForAdmin = (query) => get('/admin/jobs', query)
export const updateJobStatusAsAdmin = (id, status) => patch(`/admin/jobs/${id}/status`, { status })
