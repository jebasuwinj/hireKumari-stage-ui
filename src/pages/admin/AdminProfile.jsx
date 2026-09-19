import { useEffect, useState } from 'react'
import { Input, Upload } from 'antd'
import { BankOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons'
import PageState from '../../components/PageState.jsx'
import FieldError from '../../components/FieldError.jsx'
import { DetailSkeleton } from '../../components/skeletons'
import { useAuth } from '../../context/AuthContext.jsx'
import { useAsync } from '../../hooks/useAsync.js'
import { useFeedback } from '../../hooks/useFeedback.jsx'
import { getMyProfile, updateMyLogo, updateMyProfile } from '../../api/companies.js'
import { changePassword } from '../../api/auth.js'
import {
  collectErrors,
  digitsOnly,
  minLength,
  required,
  validateEmail,
  validateMobile,
  validatePan,
  validatePassword,
  validatePasswordConfirm,
} from '../../utils/validation.js'
import './AdminProfile.css'

function AdminProfile() {
  const { refreshCompany } = useAuth()
  const { data: profile, loading, error, refetch } = useProfile()
  const { toastSuccess, toastError, toastValidationError } = useFeedback()

  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [logoUploading, setLogoUploading] = useState(false)

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [pwFieldErrors, setPwFieldErrors] = useState({})

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        address: profile.address,
        email: profile.email,
        phone: profile.phone,
        pan: profile.pan,
      })
    }
  }, [profile])

  const profileFieldMessage = (field, next = form) => {
    if (!next) return undefined
    switch (field) {
      case 'name':
        return required(next.name, 'Company name is required.')
          || minLength(next.name, 2, 'Company name must be at least 2 characters.')
      case 'address':
        return required(next.address, 'Company address is required.')
          || minLength(next.address, 5, 'Address must be at least 5 characters.')
      case 'email':
        return validateEmail(next.email)
      case 'phone':
        return validateMobile(next.phone)
      case 'pan':
        return validatePan(next.pan)
      default:
        return undefined
    }
  }

  const handleChange = (field) => (e) => {
    let value = e.target.value
    if (field === 'phone') value = digitsOnly(value, 10)
    if (field === 'pan') value = String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
    setForm((f) => ({ ...f, [field]: value }))
    setSaved(false)
    setFieldErrors((f) => (f[field] ? { ...f, [field]: undefined } : f))
  }

  const handleBlur = (field) => () => {
    const message = profileFieldMessage(field)
    setFieldErrors((f) => (f[field] === message ? f : { ...f, [field]: message }))
  }

  const validateProfile = () => collectErrors({
    name: profileFieldMessage('name'),
    address: profileFieldMessage('address'),
    email: profileFieldMessage('email'),
    phone: profileFieldMessage('phone'),
    pan: profileFieldMessage('pan'),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateProfile()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      toastValidationError()
      return
    }
    setFieldErrors({})
    setSaving(true)
    try {
      await updateMyProfile({
        ...form,
        name: form.name.trim(),
        address: form.address.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        pan: form.pan.trim().toUpperCase(),
      })
      await refreshCompany()
      setSaved(true)
      refetch()
      toastSuccess('Profile updated', 'Your company profile has been saved.')
    } catch (err) {
      toastError(err, 'Could not save your profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (file) => {
    setLogoUploading(true)
    try {
      await updateMyLogo(file)
      await refreshCompany()
      refetch()
      toastSuccess('Logo updated', 'Your new company logo is now live.')
    } catch (err) {
      toastError(err, 'Could not upload the logo.')
    } finally {
      setLogoUploading(false)
    }
    return false
  }

  const handlePasswordChange = (field) => (e) => {
    setPwForm((f) => ({ ...f, [field]: e.target.value }))
    setPwSaved(false)
    setPwFieldErrors((f) => (f[field] ? { ...f, [field]: undefined } : f))
  }

  const passwordFieldMessage = (field, next = pwForm) => {
    if (field === 'currentPassword') return required(next.currentPassword, 'Enter your current password.')
    if (field === 'newPassword') return validatePassword(next.newPassword)
    if (field === 'confirmPassword') return validatePasswordConfirm(next.newPassword, next.confirmPassword)
    return undefined
  }

  const handlePasswordBlur = (field) => () => {
    const message = passwordFieldMessage(field)
    setPwFieldErrors((f) => {
      const next = { ...f, [field]: message }
      if (field === 'newPassword' && pwForm.confirmPassword) {
        next.confirmPassword = passwordFieldMessage('confirmPassword')
      }
      return next
    })
  }

  const validatePasswordForm = () => collectErrors({
    currentPassword: passwordFieldMessage('currentPassword'),
    newPassword: passwordFieldMessage('newPassword'),
    confirmPassword: passwordFieldMessage('confirmPassword'),
  })

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    const errors = validatePasswordForm()
    if (Object.keys(errors).length > 0) {
      setPwFieldErrors(errors)
      toastValidationError()
      return
    }
    setPwFieldErrors({})

    setPwSaving(true)
    try {
      await changePassword(pwForm.currentPassword, pwForm.newPassword)
      setPwSaved(true)
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toastSuccess('Password changed', 'Use your new password next time you log in.')
    } catch (err) {
      toastError(err, 'Could not change your password.')
    } finally {
      setPwSaving(false)
    }
  }

  return (
    <div className="admin-profile">
      <div className="admin-page-head">
        <div>
          <h1>Company Profile</h1>
          <p>Keep your company details up to date for job seekers and the district administration.</p>
        </div>
      </div>

      <PageState
        loading={loading}
        error={error}
        skeleton={<DetailSkeleton form />}
      >
        {form && (
          <div className="admin-profile__layout">
            <form className="admin-post-job__card" onSubmit={handleSubmit} noValidate>
              <div className="admin-profile__badge">
                <div className="admin-profile__badge-main">
                  <span aria-hidden="true" style={{ overflow: 'hidden' }}>
                    {profile.logoUrl ? (
                      <img src={profile.logoUrl} alt={form.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      profile.initials
                    )}
                  </span>
                  <div className="admin-profile__badge-text">
                    <strong>{form.name}</strong>
                    <small>✔ Verified Employer</small>
                  </div>
                </div>
                <Upload
                  className="admin-profile__logo-upload"
                  accept=".png,.jpg,.jpeg,.svg,.webp"
                  showUploadList={false}
                  beforeUpload={handleLogoUpload}
                >
                  <button
                    type="button"
                    className="admin-profile__logo-btn"
                    disabled={logoUploading}
                    aria-label={logoUploading ? 'Uploading logo' : 'Change company logo'}
                  >
                    <span className="admin-profile__logo-btn-icon" aria-hidden="true">
                      <UploadOutlined />
                    </span>
                    <span className="admin-profile__logo-btn-label">
                      {logoUploading ? 'Uploading…' : 'Change Logo'}
                    </span>
                  </button>
                </Upload>
              </div>

              <div className="admin-field">
                <label htmlFor="name">Company Name</label>
                <Input
                  id="name"
                  size="large"
                  status={fieldErrors.name ? 'error' : undefined}
                  prefix={<BankOutlined />}
                  value={form.name}
                  onChange={handleChange('name')}
                  onBlur={handleBlur('name')}
                />
                <FieldError>{fieldErrors.name}</FieldError>
              </div>

              <div className="admin-field">
                <label htmlFor="address">Company Address</label>
                <Input.TextArea
                  id="address"
                  rows={2}
                  status={fieldErrors.address ? 'error' : undefined}
                  value={form.address}
                  onChange={handleChange('address')}
                  onBlur={handleBlur('address')}
                />
                <FieldError>{fieldErrors.address}</FieldError>
              </div>

              <div className="admin-field-row">
                <div className="admin-field">
                  <label htmlFor="email">Email Address</label>
                  <Input
                    id="email"
                    type="email"
                    size="large"
                    status={fieldErrors.email ? 'error' : undefined}
                    prefix={<MailOutlined />}
                    value={form.email}
                    onChange={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />
                  <FieldError>{fieldErrors.email}</FieldError>
                </div>

                <div className="admin-field">
                  <label htmlFor="phone">Mobile Number</label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    size="large"
                    status={fieldErrors.phone ? 'error' : undefined}
                    prefix={<PhoneOutlined />}
                    value={form.phone}
                    onChange={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                  />
                  <FieldError>{fieldErrors.phone}</FieldError>
                </div>
              </div>

              <div className="admin-field">
                <label htmlFor="pan">PAN Number</label>
                <Input
                  id="pan"
                  size="large"
                  maxLength={10}
                  status={fieldErrors.pan ? 'error' : undefined}
                  prefix={<IdcardOutlined />}
                  value={form.pan}
                  onChange={handleChange('pan')}
                  onBlur={handleBlur('pan')}
                />
                <FieldError>{fieldErrors.pan}</FieldError>
              </div>

              <div className="admin-post-job__actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
                {saved && <span className="admin-profile__saved">✔ Changes saved</span>}
              </div>
            </form>

            <aside className="admin-profile__side">
              <div className="admin-panel admin-profile__overview">
                <h2>Account Overview</h2>
                <div className="admin-profile__overview-row">
                  <span>Status</span>
                  <span className="tag" style={{ background: '#1f9d551f', color: '#1f9d55' }}>✔ Verified</span>
                </div>
                <div className="admin-profile__overview-row">
                  <span>Member Since</span>
                  <strong>{new Date(profile.memberSince).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</strong>
                </div>
                <div className="admin-profile__overview-row">
                  <span>Sector</span>
                  <strong>{profile.categoryName || '—'}</strong>
                </div>
              </div>

              <form className="admin-panel" onSubmit={handlePasswordSubmit} noValidate>
                <h2>🔒 Change Password</h2>

                <div className="admin-field">
                  <label htmlFor="currentPassword">Current Password</label>
                  <Input.Password
                    id="currentPassword"
                    status={pwFieldErrors.currentPassword ? 'error' : undefined}
                    prefix={<LockOutlined />}
                    value={pwForm.currentPassword}
                    onChange={handlePasswordChange('currentPassword')}
                    onBlur={handlePasswordBlur('currentPassword')}
                  />
                  <FieldError>{pwFieldErrors.currentPassword}</FieldError>
                </div>
                <div className="admin-field">
                  <label htmlFor="newPassword">New Password</label>
                  <Input.Password
                    id="newPassword"
                    status={pwFieldErrors.newPassword ? 'error' : undefined}
                    prefix={<LockOutlined />}
                    value={pwForm.newPassword}
                    onChange={handlePasswordChange('newPassword')}
                    onBlur={handlePasswordBlur('newPassword')}
                  />
                  <FieldError>{pwFieldErrors.newPassword}</FieldError>
                </div>
                <div className="admin-field">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <Input.Password
                    id="confirmPassword"
                    status={pwFieldErrors.confirmPassword ? 'error' : undefined}
                    prefix={<LockOutlined />}
                    value={pwForm.confirmPassword}
                    onChange={handlePasswordChange('confirmPassword')}
                    onBlur={handlePasswordBlur('confirmPassword')}
                  />
                  <FieldError>{pwFieldErrors.confirmPassword}</FieldError>
                </div>
                <div className="admin-post-job__actions">
                  <button type="submit" className="btn btn-outline" disabled={pwSaving}>
                    {pwSaving ? 'Saving…' : 'Update Password'}
                  </button>
                  {pwSaved && <span className="admin-profile__saved">✔ Password changed</span>}
                </div>
              </form>

              <div className="admin-panel admin-profile__tip">
                <h2>💡 Tip</h2>
                <p>Companies with a complete profile get up to 3x more visibility with job seekers.</p>
              </div>
            </aside>
          </div>
        )}
      </PageState>
    </div>
  )
}

function useProfile() {
  const [version, setVersion] = useState(0)
  const { data, loading, error } = useAsync(() => getMyProfile().then((r) => r.data), [version])
  return { data, loading, error, refetch: () => setVersion((v) => v + 1) }
}

export default AdminProfile
