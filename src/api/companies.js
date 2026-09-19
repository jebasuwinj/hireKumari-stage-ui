import { get, patch, del } from './client.js'

// Public.
export const listCompanies = (query) => get('/companies', query)
export const getCompany = (slug) => get(`/companies/${slug}`)

// The logged-in company's own workspace.
export const getMyDashboard = () => get('/company/dashboard')
export const getMyProfile = () => get('/company/profile')
export const updateMyProfile = (payload) => patch('/company/profile', payload)
export const updateMyLogo = (file) => {
  const form = new FormData()
  form.append('logo', file)
  return patch('/company/profile/logo', form)
}

// Super admin only.
export const listCompaniesForAdmin = (query) => get('/admin/companies', query)
export const updateCompanyStatus = (id, status) => patch(`/admin/companies/${id}/status`, { status })
export const deleteCompanyForAdmin = (id) => del(`/admin/companies/${id}`)
