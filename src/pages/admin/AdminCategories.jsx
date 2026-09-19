import { useState } from 'react'
import { Modal, Input, Select } from 'antd'
import PageState from '../../components/PageState.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import FieldError from '../../components/FieldError.jsx'
import { CardGridSkeleton } from '../../components/skeletons'
import { useAsync } from '../../hooks/useAsync.js'
import { useFeedback } from '../../hooks/useFeedback.jsx'
import { COLOR_PRESETS } from '../../data/adminMockData'
import { SectorIcon } from '../../components/SectorCards'
import ColorSwatchPicker from './ColorSwatchPicker'
import { createCategory, deleteCategory, listCategoriesForAdmin, updateCategory } from '../../api/categories.js'
import { collectErrors, minLength, required } from '../../utils/validation.js'
import './AdminCategories.css'

const ICON_OPTIONS = [
  { value: 'gear', label: '⚙️ Gear' },
  { value: 'heart', label: '❤️ Heart' },
  { value: 'cap', label: '🎓 Graduation Cap' },
  { value: 'store', label: '🏬 Store' },
  { value: 'bell', label: '🔔 Bell' },
  { value: 'code', label: '🖥️ Code' },
  { value: 'gov', label: '🏛️ Government' },
  { value: 'dots', label: '⋯ Others' },
]

const EMPTY_FORM = { name: '', nameTa: '', icon: 'gear', color: COLOR_PRESETS[0] }

function AdminCategories() {
  const [reloadKey, setReloadKey] = useState(0)
  const { data: categories, loading, error } = useAsync(() => listCategoriesForAdmin().then((r) => r.data), [reloadKey])
  const reload = () => setReloadKey((k) => k + 1)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const { toastSuccess, toastError, toastValidationError, confirmAction } = useFeedback()

  const list = categories ?? []

  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFieldErrors({})
    setModalOpen(true)
  }

  const openEdit = (category) => {
    setEditingId(category.id)
    setForm({ name: category.name, nameTa: category.nameTa ?? '', icon: category.icon, color: category.color })
    setFieldErrors({})
    setModalOpen(true)
  }

  const handleDelete = (category) => {
    confirmAction({
      title: `Delete "${category.name}"?`,
      description:
        category.jobCount > 0
          ? `This category has ${category.jobCount} job(s). Deletion will be blocked until they are moved or removed.`
          : 'This sector will no longer be available for companies to select.',
      okText: 'Delete',
      danger: true,
      onConfirm: async () => {
        try {
          await deleteCategory(category.id)
          toastSuccess('Category deleted', `"${category.name}" has been removed.`)
          reload()
        } catch (err) {
          toastError(err, 'Could not delete this category.')
          throw err
        }
      },
    })
  }

  const handleChange = (field) => (eOrValue) => {
    const value = eOrValue?.target ? eOrValue.target.value : eOrValue
    setForm((f) => ({ ...f, [field]: value }))
    setFieldErrors((f) => (f[field] ? { ...f, [field]: undefined } : f))
  }

  const fieldMessage = (field, next = form) => {
    if (field === 'name') {
      return required(next.name, 'Category name is required.')
        || minLength(next.name, 2, 'Category name must be at least 2 characters.')
    }
    if (field === 'nameTa') {
      return required(next.nameTa, 'Tamil category name is required.')
        || minLength(next.nameTa, 2, 'Tamil category name must be at least 2 characters.')
    }
    return undefined
  }

  const handleBlur = (field) => () => {
    const message = fieldMessage(field)
    setFieldErrors((f) => (f[field] === message ? f : { ...f, [field]: message }))
  }

  const validate = () => collectErrors({
    name: fieldMessage('name'),
    nameTa: fieldMessage('nameTa'),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      toastValidationError()
      return
    }
    setFieldErrors({})
    setSaving(true)
    try {
      if (editingId) {
        await updateCategory(editingId, form)
      } else {
        await createCategory(form)
      }
      setModalOpen(false)
      reload()
      toastSuccess(editingId ? 'Category updated' : 'Category added', `"${form.name}" has been saved.`)
    } catch (err) {
      toastError(err, 'Could not save this category.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-categories">
      <div className="admin-page-head">
        <div>
          <h1>Job Categories</h1>
          <p>Manage the sectors job seekers can browse and filter by</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openAdd}>+ Add Category</button>
      </div>

      <PageState
        loading={loading}
        error={error}
        skeleton={<CardGridSkeleton count={8} columns={3} />}
      >
        {list.length > 0 ? (
          <div className="admin-categories-grid">
            {list.map((c) => (
              <div key={c.id} className="admin-category-card">
                <span className="admin-category-card__icon" style={{ background: `${c.color}1f`, color: c.color }}>
                  <SectorIcon icon={c.icon} />
                </span>
                <strong>{c.name}</strong>
                <small>{c.jobCount} Jobs</small>
                <div className="admin-category-card__actions">
                  <button type="button" className="admin-icon-edit" onClick={() => openEdit(c)} aria-label={`Edit ${c.name}`}>
                    ✏️
                  </button>
                  <button type="button" className="admin-icon-delete" onClick={() => handleDelete(c)} aria-label={`Delete ${c.name}`}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🗂️"
            title="No categories yet"
            description="Add a sector so companies can be classified and job seekers can filter by it."
            action={<button type="button" className="btn btn-primary" onClick={openAdd}>+ Add Category</button>}
          />
        )}
      </PageState>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width="min(480px, 92vw)"
        centered
        title={editingId ? 'Edit Category' : 'Add Category'}
      >
        <form className="admin-crud-form" onSubmit={handleSubmit} noValidate>
          <div className="admin-field">
            <label htmlFor="cat-name">Category Name <span className="required">*</span></label>
            <Input
              id="cat-name"
              size="large"
              status={fieldErrors.name ? 'error' : undefined}
              placeholder="e.g. Logistics"
              value={form.name}
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
            />
            <FieldError>{fieldErrors.name}</FieldError>
          </div>

          <div className="admin-field">
            <label htmlFor="cat-name-ta">Category Name (Tamil) <span className="required">*</span></label>
            <Input
              id="cat-name-ta"
              size="large"
              status={fieldErrors.nameTa ? 'error' : undefined}
              placeholder="எ.கா. லாஜிஸ்டிக்ஸ்"
              value={form.nameTa}
              onChange={handleChange('nameTa')}
              onBlur={handleBlur('nameTa')}
            />
            <FieldError>{fieldErrors.nameTa}</FieldError>
          </div>

          <div className="admin-field">
            <label htmlFor="cat-icon">Icon</label>
            <Select
              id="cat-icon"
              size="large"
              value={form.icon}
              onChange={handleChange('icon')}
              options={ICON_OPTIONS}
              style={{ width: '100%' }}
            />
          </div>

          <div className="admin-field">
            <label>Color</label>
            <ColorSwatchPicker value={form.color} onChange={handleChange('color')} />
          </div>

          <div className="admin-crud-form__actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Category'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminCategories
