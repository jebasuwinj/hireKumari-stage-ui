import { useEffect, useState } from 'react'
import { Modal, Input, Select } from 'antd'
import { useOptions } from '../../hooks/useOptions.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useFeedback } from '../../hooks/useFeedback.jsx'
import FieldError from '../../components/FieldError.jsx'
import { createJob, updateJob } from '../../api/jobs.js'
import { collectErrors, minLength, required } from '../../utils/validation.js'
import './AdminPostJob.css'

const INITIAL_FORM = {
  title: '',
  taluk: undefined,
  type: undefined,
  experience: undefined,
  qualification: '',
  salaryMin: '',
  salaryMax: '',
  salaryLabel: '',
  vacancies: '',
  description: '',
  responsibilities: '',
}

function jobToForm(job) {
  if (!job) return INITIAL_FORM
  return {
    title: job.title ?? '',
    taluk: job.taluk ?? undefined,
    type: job.type ?? undefined,
    experience: job.experience ?? undefined,
    qualification: job.qualification ?? '',
    salaryMin: job.salaryMin ?? '',
    salaryMax: job.salaryMax ?? '',
    salaryLabel: job.salaryLabel ?? '',
    vacancies: job.vacancies ?? '',
    description: job.description ?? '',
    responsibilities: (job.responsibilities ?? []).join('\n'),
  }
}

function PostJobModal({ open, onClose, job, onSaved }) {
  const isEditing = Boolean(job)
  const { company } = useAuth()
  const { toastSuccess, toastError, toastValidationError } = useFeedback()
  const { options } = useOptions()
  const [form, setForm] = useState(() => jobToForm(job))
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(jobToForm(job))
      setFieldErrors({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, job])

  const salaryRangeError = (min, max) => {
    if (min !== '' && max !== '' && Number(min) > Number(max)) {
      return 'Maximum salary must be greater than the minimum salary.'
    }
    return undefined
  }

  const fieldMessage = (field, next = form) => {
    switch (field) {
      case 'title':
        return required(next.title, 'Job title is required.')
          || minLength(next.title, 3, 'Job title must be at least 3 characters.')
      case 'taluk':
        return next.taluk ? undefined : 'Please select a location.'
      case 'type':
        return next.type ? undefined : 'Please select a job type.'
      case 'vacancies':
        if (next.vacancies === '' || next.vacancies == null) return 'Enter the number of vacancies.'
        if (Number(next.vacancies) < 1) return 'Vacancies must be at least 1.'
        return undefined
      case 'description':
        return required(next.description, 'Job description is required.')
          || minLength(next.description, 10, 'Description must be at least 10 characters.')
      case 'salaryMin':
      case 'salaryMax':
        return salaryRangeError(next.salaryMin, next.salaryMax)
      default:
        return undefined
    }
  }

  const handleChange = (field) => (eOrValue) => {
    const value = eOrValue?.target ? eOrValue.target.value : eOrValue
    setForm((f) => ({ ...f, [field]: value }))
    setFieldErrors((f) => {
      if (!f[field] && field !== 'salaryMin' && field !== 'salaryMax') return f
      const next = { ...f, [field]: undefined }
      if (field === 'salaryMin' || field === 'salaryMax') next.salaryMax = undefined
      return next
    })
  }

  const handleBlur = (field) => () => {
    if (field === 'salaryMin' || field === 'salaryMax') {
      const message = salaryRangeError(form.salaryMin, form.salaryMax)
      setFieldErrors((f) => (f.salaryMax === message ? f : { ...f, salaryMax: message }))
      return
    }
    const message = fieldMessage(field)
    setFieldErrors((f) => (f[field] === message ? f : { ...f, [field]: message }))
  }

  const validate = () => {
    const errors = collectErrors({
      title: fieldMessage('title'),
      taluk: fieldMessage('taluk'),
      type: fieldMessage('type'),
      vacancies: fieldMessage('vacancies'),
      description: fieldMessage('description'),
    })
    const salaryError = salaryRangeError(form.salaryMin, form.salaryMax)
    if (salaryError) errors.salaryMax = salaryError
    return errors
  }

  const buildPayload = () => ({
    title: form.title.trim(),
    taluk: form.taluk,
    type: form.type,
    experience: form.experience || undefined,
    qualification: form.qualification.trim(),
    salaryMin: form.salaryMin !== '' ? Number(form.salaryMin) : undefined,
    salaryMax: form.salaryMax !== '' ? Number(form.salaryMax) : undefined,
    salaryLabel: form.salaryLabel.trim(),
    vacancies: Number(form.vacancies),
    description: form.description.trim(),
    responsibilities: form.responsibilities
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean),
  })

  const handleSubmit = async (status) => {
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      toastValidationError()
      return
    }
    setFieldErrors({})
    setSubmitting(true)
    try {
      if (isEditing) {
        await updateJob(job.id, buildPayload())
      } else {
        await createJob({ ...buildPayload(), status })
      }
      toastSuccess(isEditing ? 'Job updated' : 'Job saved', `"${form.title}" has been ${isEditing ? 'updated' : status === 'draft' ? 'saved as a draft' : 'published'}.`)
      if (typeof onSaved === 'function') onSaved()
      onClose()
    } catch (err) {
      toastError(err, 'Could not save this job. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const resetAndClose = () => {
    onClose()
  }

  const talukOptions = options.taluks.map((t) => ({ value: t, label: t }))
  const typeOptions = options.jobTypes.map((t) => ({ value: t, label: t }))
  const experienceOptions = options.experienceLevels.map((e) => ({ value: e, label: e }))

  return (
    <Modal
      open={open}
      onCancel={resetAndClose}
      footer={null}
      width="min(720px, 92vw)"
      centered
      destroyOnHidden
      styles={{
        header: { position: 'sticky', top: 0, zIndex: 1, background: '#fff', paddingBottom: 16, marginBottom: 0 },
        // Extra body padding so antd focus rings aren't clipped by overflow.
        body: { padding: '16px 12px 24px' },
      }}
      afterClose={() => {
        setFieldErrors({})
        setForm(jobToForm(job))
      }}
      title={isEditing ? 'Edit Job' : 'Post a New Job'}
    >
      <form className="admin-post-job__card admin-post-job__card--modal" onSubmit={(e) => e.preventDefault()}>
          {company?.categoryName && (
            <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--color-text-muted, #6b7280)' }}>
              Posting under sector: <strong>{company.categoryName}</strong> (set on your Company Profile)
            </p>
          )}

          <div className="admin-field">
            <label htmlFor="title">Job Title <span className="required">*</span></label>
            <Input
              id="title"
              size="large"
              status={fieldErrors.title ? 'error' : undefined}
              placeholder="e.g. Production Supervisor"
              value={form.title}
              onChange={handleChange('title')}
              onBlur={handleBlur('title')}
            />
            <FieldError>{fieldErrors.title}</FieldError>
          </div>

          <div className="admin-field-row">
            <div className="admin-field">
              <label htmlFor="taluk">Location (Taluk) <span className="required">*</span></label>
              <Select
                id="taluk"
                size="large"
                status={fieldErrors.taluk ? 'error' : undefined}
                placeholder="Select a taluk"
                value={form.taluk}
                onChange={(value) => {
                  handleChange('taluk')(value)
                  setFieldErrors((f) => ({ ...f, taluk: value ? undefined : 'Please select a location.' }))
                }}
                options={talukOptions}
                style={{ width: '100%' }}
              />
              <FieldError>{fieldErrors.taluk}</FieldError>
            </div>

            <div className="admin-field">
              <label htmlFor="type">Job Type <span className="required">*</span></label>
              <Select
                id="type"
                size="large"
                status={fieldErrors.type ? 'error' : undefined}
                placeholder="Select job type"
                value={form.type}
                onChange={(value) => {
                  handleChange('type')(value)
                  setFieldErrors((f) => ({ ...f, type: value ? undefined : 'Please select a job type.' }))
                }}
                options={typeOptions}
                style={{ width: '100%' }}
              />
              <FieldError>{fieldErrors.type}</FieldError>
            </div>
          </div>

          <div className="admin-field-row">
            <div className="admin-field">
              <label htmlFor="experience">Experience Level</label>
              <Select
                id="experience"
                size="large"
                placeholder="Select experience"
                value={form.experience}
                onChange={handleChange('experience')}
                options={experienceOptions}
                allowClear
                style={{ width: '100%' }}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="qualification">Qualification</label>
              <Input
                id="qualification"
                size="large"
                placeholder="e.g. Diploma, Any Degree"
                value={form.qualification}
                onChange={handleChange('qualification')}
              />
            </div>
          </div>

          <div className="admin-field-row">
            <div className="admin-field">
              <label htmlFor="salaryMin">Minimum Salary (₹/month)</label>
              <Input
                id="salaryMin"
                type="number"
                min="0"
                size="large"
                status={fieldErrors.salaryMax ? 'error' : undefined}
                placeholder="e.g. 18000"
                value={form.salaryMin}
                onChange={handleChange('salaryMin')}
                onBlur={handleBlur('salaryMin')}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="salaryMax">Maximum Salary (₹/month)</label>
              <Input
                id="salaryMax"
                type="number"
                min="0"
                size="large"
                status={fieldErrors.salaryMax ? 'error' : undefined}
                placeholder="e.g. 24000"
                value={form.salaryMax}
                onChange={handleChange('salaryMax')}
                onBlur={handleBlur('salaryMax')}
              />
              <FieldError>{fieldErrors.salaryMax}</FieldError>
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="salaryLabel">Salary Label Override</label>
            <Input
              id="salaryLabel"
              size="large"
              placeholder="e.g. As per Govt Norms (shown instead of the amounts above)"
              value={form.salaryLabel}
              onChange={handleChange('salaryLabel')}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="vacancies">Number of Vacancies <span className="required">*</span></label>
            <Input
              id="vacancies"
              type="number"
              min="1"
              size="large"
              status={fieldErrors.vacancies ? 'error' : undefined}
              placeholder="e.g. 4"
              value={form.vacancies}
              onChange={handleChange('vacancies')}
              onBlur={handleBlur('vacancies')}
            />
            <FieldError>{fieldErrors.vacancies}</FieldError>
          </div>

          <div className="admin-field">
            <label htmlFor="description">Job Description <span className="required">*</span></label>
            <Input.TextArea
              id="description"
              rows={4}
              status={fieldErrors.description ? 'error' : undefined}
              placeholder="Describe the role, responsibilities and requirements..."
              value={form.description}
              onChange={handleChange('description')}
              onBlur={handleBlur('description')}
            />
            <FieldError>{fieldErrors.description}</FieldError>
          </div>

          <div className="admin-field">
            <label htmlFor="responsibilities">Key Responsibilities</label>
            <Input.TextArea
              id="responsibilities"
              rows={3}
              placeholder={'One responsibility per line, e.g.\nSupervise daily production activities\nEnsure adherence to safety standards'}
              value={form.responsibilities}
              onChange={handleChange('responsibilities')}
            />
          </div>

          <div className="admin-post-job__actions">
            {isEditing ? (
              <button type="button" className="btn btn-primary" disabled={submitting} onClick={() => handleSubmit(job.status)}>
                {submitting ? 'Saving…' : 'Save Changes →'}
              </button>
            ) : (
              <>
                <button type="button" className="btn btn-primary" disabled={submitting} onClick={() => handleSubmit('active')}>
                  {submitting ? 'Publishing…' : 'Publish Job →'}
                </button>
                <button type="button" className="btn btn-outline" disabled={submitting} onClick={() => handleSubmit('draft')}>
                  Save as Draft
                </button>
              </>
            )}
            <button type="button" className="btn btn-outline" onClick={resetAndClose}>Cancel</button>
          </div>
        </form>
    </Modal>
  )
}

export default PostJobModal
