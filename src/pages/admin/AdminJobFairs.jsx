import { useState } from 'react'
import dayjs from 'dayjs'
import { Modal, Input, DatePicker } from 'antd'
import PageState from '../../components/PageState.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import FieldError from '../../components/FieldError.jsx'
import JobFairDetailsModal from '../../components/JobFairDetailsModal.jsx'
import { ListRowsSkeleton } from '../../components/skeletons'
import { useAsync } from '../../hooks/useAsync.js'
import { useFeedback } from '../../hooks/useFeedback.jsx'
import { COLOR_PRESETS } from '../../data/adminMockData'
import { createJobFair, deleteJobFair, listJobFairsForAdmin, updateJobFair } from '../../api/jobFairs.js'
import { collectErrors, minLength, required } from '../../utils/validation.js'
import { jobFairStatusMeta } from '../../utils/jobFairStatus.js'
import './AdminJobFairs.css'

const FAIR_ICONS = { people: '👥', chart: '📊', monument: '🏛️' }
const ICON_CYCLE = ['people', 'chart', 'monument']

const EMPTY_FORM = {
  title: '',
  venue: '',
  date: null,
  time: '',
  description: '',
}

function AdminJobFairs() {
  const [reloadKey, setReloadKey] = useState(0)
  const { data: fairs, loading, error } = useAsync(() => listJobFairsForAdmin().then((r) => r.data), [reloadKey])
  const reload = () => setReloadKey((k) => k + 1)

  const [modalOpen, setModalOpen] = useState(false)
  const [viewFair, setViewFair] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const { toastSuccess, toastError, toastValidationError, confirmAction } = useFeedback()

  const list = fairs ?? []

  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFieldErrors({})
    setModalOpen(true)
  }

  const openEdit = (fair) => {
    setEditingId(fair.id)
    setForm({
      title: fair.title,
      venue: fair.venue,
      date: dayjs(fair.date),
      time: fair.time,
      description: fair.description ?? '',
    })
    setFieldErrors({})
    setModalOpen(true)
  }

  const handleDelete = (fair) => {
    confirmAction({
      title: `Delete "${fair.title}"?`,
      description: 'This event will be removed from the public Job Fairs page. This cannot be undone.',
      okText: 'Delete',
      danger: true,
      onConfirm: async () => {
        try {
          await deleteJobFair(fair.id)
          toastSuccess('Job fair deleted', `"${fair.title}" has been removed.`)
          reload()
        } catch (err) {
          toastError(err, 'Could not delete this job fair.')
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
    switch (field) {
      case 'title':
        return required(next.title, 'Event title is required.')
          || minLength(next.title, 3, 'Title must be at least 3 characters.')
      case 'venue':
        return required(next.venue, 'Venue is required.')
          || minLength(next.venue, 3, 'Venue must be at least 3 characters.')
      case 'date':
        return next.date ? undefined : 'Please select a date.'
      case 'time':
        return required(next.time, 'Please enter a time.')
          || minLength(next.time, 3, 'Time must be at least 3 characters.')
      default:
        return undefined
    }
  }

  const handleBlur = (field) => () => {
    const message = fieldMessage(field)
    setFieldErrors((f) => (f[field] === message ? f : { ...f, [field]: message }))
  }

  const validate = () => collectErrors({
    title: fieldMessage('title'),
    venue: fieldMessage('venue'),
    date: fieldMessage('date'),
    time: fieldMessage('time'),
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

    const payload = {
      title: form.title.trim(),
      venue: form.venue.trim(),
      date: form.date.toISOString(),
      timeLabel: form.time.trim(),
      description: form.description.trim(),
    }

    setSaving(true)
    try {
      if (editingId) {
        await updateJobFair(editingId, payload)
      } else {
        const nextIcon = ICON_CYCLE[list.length % ICON_CYCLE.length]
        const nextColor = COLOR_PRESETS[list.length % COLOR_PRESETS.length]
        await createJobFair({ ...payload, icon: nextIcon, color: nextColor })
      }
      setModalOpen(false)
      reload()
      toastSuccess(editingId ? 'Job fair updated' : 'Job fair added', `"${payload.title}" has been saved.`)
    } catch (err) {
      toastError(err, 'Could not save this job fair.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-job-fairs">
      <div className="admin-page-head">
        <div>
          <h1>Job Fairs &amp; Events</h1>
          <p>Manage the events shown on the public Job Fairs page</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openAdd}>+ Add Job Fair</button>
      </div>

      <PageState
        loading={loading}
        error={error}
        skeleton={<ListRowsSkeleton count={4} />}
      >
        {list.length > 0 ? (
          <div className="admin-fairs-list">
            {list.map((f) => (
              <div key={f.id} className="admin-fair-card">
                <span className="admin-fair-card__badge" style={{ background: `${f.color}1f`, color: f.color }}>
                  {FAIR_ICONS[f.icon]}
                </span>
                <div className="admin-fair-card__date" style={{ background: `${f.color}1f`, color: f.color }}>
                  <span>{f.month}</span>
                  <strong>{f.day}</strong>
                </div>
                <div className="admin-fair-card__main">
                  <strong>
                    {f.title}{' '}
                    <span
                      className="tag"
                      style={{ background: `${jobFairStatusMeta(f.status).color}1f`, color: jobFairStatusMeta(f.status).color }}
                    >
                      {jobFairStatusMeta(f.status).label}
                    </span>
                  </strong>
                  <p>📍 {f.venue}</p>
                  <p>🕒 {f.time}</p>
                </div>
                <div className="admin-fair-card__actions">
                  <button type="button" className="admin-icon-view" onClick={() => setViewFair(f)} aria-label={`View ${f.title}`}>
                    👁️
                  </button>
                  <button type="button" className="admin-icon-edit" onClick={() => openEdit(f)} aria-label={`Edit ${f.title}`}>
                    ✏️
                  </button>
                  <button type="button" className="admin-icon-delete" onClick={() => handleDelete(f)} aria-label={`Delete ${f.title}`}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📅"
            title="No job fairs scheduled yet"
            description="Add an event so job seekers can see it on the public Job Fairs page."
            action={<button type="button" className="btn btn-primary" onClick={openAdd}>+ Add Your First Job Fair</button>}
          />
        )}
      </PageState>

      <JobFairDetailsModal fair={viewFair} open={!!viewFair} onClose={() => setViewFair(null)} />

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width="min(560px, 92vw)"
        centered
        title={editingId ? 'Edit Job Fair' : 'Add Job Fair'}
      >
        <form className="admin-crud-form" onSubmit={handleSubmit} noValidate>
          <div className="admin-field">
            <label htmlFor="fair-title">Event Title <span className="required">*</span></label>
            <Input
              id="fair-title"
              size="large"
              status={fieldErrors.title ? 'error' : undefined}
              placeholder="e.g. District Mega Job Fair"
              value={form.title}
              onChange={handleChange('title')}
              onBlur={handleBlur('title')}
            />
            <FieldError>{fieldErrors.title}</FieldError>
          </div>

          <div className="admin-field">
            <label htmlFor="fair-venue">Venue <span className="required">*</span></label>
            <Input
              id="fair-venue"
              size="large"
              status={fieldErrors.venue ? 'error' : undefined}
              placeholder="e.g. District Employment Office, Nagercoil"
              value={form.venue}
              onChange={handleChange('venue')}
              onBlur={handleBlur('venue')}
            />
            <FieldError>{fieldErrors.venue}</FieldError>
          </div>

          <div className="admin-field-row">
            <div className="admin-field">
              <label htmlFor="fair-date">Date <span className="required">*</span></label>
              <DatePicker
                id="fair-date"
                size="large"
                format="DD MMM YYYY"
                status={fieldErrors.date ? 'error' : undefined}
                value={form.date}
                onChange={(value) => {
                  handleChange('date')(value)
                  setFieldErrors((f) => ({ ...f, date: value ? undefined : 'Please select a date.' }))
                }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                style={{ width: '100%' }}
              />
              <FieldError>{fieldErrors.date}</FieldError>
            </div>

            <div className="admin-field">
              <label htmlFor="fair-time">Time <span className="required">*</span></label>
              <Input
                id="fair-time"
                size="large"
                status={fieldErrors.time ? 'error' : undefined}
                placeholder="e.g. 10:00 AM - 4:00 PM"
                value={form.time}
                onChange={handleChange('time')}
                onBlur={handleBlur('time')}
              />
              <FieldError>{fieldErrors.time}</FieldError>
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="fair-description">Description</label>
            <Input.TextArea
              id="fair-description"
              rows={8}
              placeholder={'Add details about the event…\n\n**Key Highlights**\n* Free registration\n* Walk-in interviews'}
              value={form.description}
              onChange={handleChange('description')}
            />
          </div>

          <div className="admin-crud-form__actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Job Fair'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminJobFairs
