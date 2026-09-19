import { get, post, patch, del } from './client.js'

// Public — every visitor can browse sectors.
export const listCategories = () => get('/categories')

// Super admin only.
export const listCategoriesForAdmin = () => get('/admin/categories')
export const createCategory = (payload) => post('/admin/categories', payload)
export const updateCategory = (id, payload) => patch(`/admin/categories/${id}`, payload)
export const deleteCategory = (id) => del(`/admin/categories/${id}`)
