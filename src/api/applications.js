import { get, patch, request } from './client.js'

// The logged-in company's own applicants.
export const listMyApplications = (query) => get('/company/applications', query)
export const updateApplicationStatus = (id, status) => patch(`/company/applications/${id}/status`, { status })
export const getResumeLink = (id) => get(`/company/applications/${id}/resume`)

export async function exportMyApplications(query) {
  const res = await request('/company/applications/export', { method: 'GET', query, raw: true })
  const blob = await res.blob()
  const disposition = res.headers.get('Content-Disposition') || ''
  const match = disposition.match(/filename="?([^"]+)"?/)
  return { blob, filename: match ? match[1] : `applications-${Date.now()}.csv` }
}

// Super admin only.
export const listApplicationsForAdmin = (query) => get('/admin/applications', query)
