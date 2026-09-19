import { useState } from 'react'
import { Modal, Input, Upload, message } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, InboxOutlined } from '@ant-design/icons'
import { applyToJob } from '../api/jobs.js'
import { useFeedback } from '../hooks/useFeedback.jsx'
import FieldError from './FieldError.jsx'
import {
  collectErrors,
  digitsOnly,
  minLength,
  required,
  validateEmail,
  validateMobile,
} from '../utils/validation.js'
import './ApplyJobModal.css'

const INITIAL_FORM = { name: '', email: '', phone: '' }
const RESUME_MAX_BYTES = 5 * 1024 * 1024

function ApplyJobModal({ open, onClose, job }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [fileList, setFileList] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const { toastSuccess, toastError, toastValidationError } = useFeedback()

  const fieldMessage = (field, next = form, nextFiles = fileList) => {
    switch (field) {
      case 'name':
        return required(next.name, 'Full name is required.')
          || minLength(next.name, 2, 'Name must be at least 2 characters.')
      case 'email':
        return validateEmail(next.email)
      case 'phone':
        return validateMobile(next.phone)
      case 'resume':
        return nextFiles.length === 0 ? 'Please upload your resume.' : undefined
      default:
        return undefined
    }
  }

  const handleChange = (field) => (e) => {
    let value = e.target.value
    if (field === 'phone') value = digitsOnly(value, 10)
    setForm((f) => ({ ...f, [field]: value }))
    setFieldErrors((f) => (f[field] ? { ...f, [field]: undefined } : f))
  }

  const handleBlur = (field) => () => {
    const message = fieldMessage(field)
    setFieldErrors((f) => (f[field] === message ? f : { ...f, [field]: message }))
  }

  const validate = () => collectErrors({
    name: fieldMessage('name'),
    email: fieldMessage('email'),
    phone: fieldMessage('phone'),
    resume: fieldMessage('resume'),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!job?.id) return

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      toastValidationError()
      return
    }
    setFieldErrors({})

    const formData = new FormData()
    formData.append('name', form.name.trim())
    formData.append('email', form.email.trim().toLowerCase())
    formData.append('phone', form.phone.trim())
    formData.append('resume', fileList[0])

    setSubmitting(true)
    try {
      await applyToJob(job.id, formData)
      setSubmitted(true)
      toastSuccess('Application submitted', `Your application for "${job.title}" was sent.`)
    } catch (err) {
      const msg = err?.message || 'Could not submit your application. Please try again.'
      if (/employer or admin account/i.test(msg) || /already exists/i.test(msg)) {
        setFieldErrors((f) => ({ ...f, email: msg }))
      }
      toastError(err, msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  const resetForm = () => {
    setForm(INITIAL_FORM)
    setFileList([])
    setSubmitted(false)
    setFieldErrors({})
  }

  const uploadProps = {
    fileList,
    multiple: false,
    accept: '.pdf,.doc,.docx',
    beforeUpload: (file) => {
      const isAllowed = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ].includes(file.type)
      if (!isAllowed) {
        message.error('Please upload a PDF or Word document.')
        return Upload.LIST_IGNORE
      }
      if (file.size > RESUME_MAX_BYTES) {
        message.error('Resume must be 5MB or smaller.')
        return Upload.LIST_IGNORE
      }
      setFileList([file])
      setFieldErrors((f) => (f.resume ? { ...f, resume: undefined } : f))
      return false
    },
    onRemove: () => {
      setFileList([])
      setFieldErrors((f) => ({ ...f, resume: 'Please upload your resume.' }))
    },
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width="min(520px, 92vw)"
      centered
      afterClose={resetForm}
      title={submitted ? null : `Apply for ${job?.title ?? 'this role'}`}
    >
      {submitted ? (
        <div className="apply-job-modal__success">
          <span aria-hidden="true">✔</span>
          <h2>Application Submitted!</h2>
          <p>
            Thanks, {form.name || 'candidate'}! Your application for &ldquo;{job?.title}&rdquo; at {job?.company} has
            been sent. They&apos;ll reach out to you directly if you&apos;re shortlisted.
          </p>
          <button type="button" className="btn btn-primary" onClick={handleClose}>Done</button>
        </div>
      ) : (
        <form className="apply-job-modal__form" onSubmit={handleSubmit} noValidate>
          {job && (
            <p className="apply-job-modal__subtitle">
              at <strong>{job.company}</strong> &bull; {job.location}
            </p>
          )}

          <div className="apply-job-field">
            <label htmlFor="apply-name">Full Name <span className="required">*</span></label>
            <Input
              id="apply-name"
              size="large"
              status={fieldErrors.name ? 'error' : undefined}
              prefix={<UserOutlined />}
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
            />
            <FieldError>{fieldErrors.name}</FieldError>
          </div>

          <div className="apply-job-field">
            <label htmlFor="apply-email">Email Address <span className="required">*</span></label>
            <Input
              id="apply-email"
              type="email"
              size="large"
              status={fieldErrors.email ? 'error' : undefined}
              prefix={<MailOutlined />}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            <FieldError>{fieldErrors.email}</FieldError>
          </div>

          <div className="apply-job-field">
            <label htmlFor="apply-phone">Phone Number <span className="required">*</span></label>
            <Input
              id="apply-phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              size="large"
              status={fieldErrors.phone ? 'error' : undefined}
              prefix={<PhoneOutlined />}
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={handleChange('phone')}
              onBlur={handleBlur('phone')}
            />
            <FieldError>{fieldErrors.phone}</FieldError>
          </div>

          <div className="apply-job-field">
            <label>Resume <span className="required">*</span></label>
            <Upload.Dragger {...uploadProps} className="apply-job-modal__dragger">
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Click or drag your resume to upload</p>
              <p className="ant-upload-hint">PDF or Word document, up to 5MB</p>
            </Upload.Dragger>
            <FieldError>{fieldErrors.resume}</FieldError>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Application →'}
          </button>
        </form>
      )}
    </Modal>
  )
}

export default ApplyJobModal
