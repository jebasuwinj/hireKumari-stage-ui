import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Select, Checkbox, Upload, message } from 'antd'
import { BankOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, InboxOutlined } from '@ant-design/icons'
import { useStats } from '../hooks/useStats.js'
import { useCategories } from '../hooks/useCategories.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useFeedback } from '../hooks/useFeedback.jsx'
import FieldError from '../components/FieldError.jsx'
import { register } from '../api/auth.js'
import {
  collectErrors,
  digitsOnly,
  minLength,
  required,
  validateEmail,
  validateMobile,
  validatePan,
} from '../utils/validation.js'
import './Register.css'

const FEATURE_KEYS = [
  { icon: '👥', titleKey: 'register.feature1.title', textKey: 'register.feature1.text' },
  { icon: '🛡️', titleKey: 'register.feature2.title', textKey: 'register.feature2.text' },
  { icon: '📊', titleKey: 'register.feature3.title', textKey: 'register.feature3.text' },
  { icon: '⚙️', titleKey: 'register.feature4.title', textKey: 'register.feature4.text' },
]

const LOGO_MAX_BYTES = 2 * 1024 * 1024

function Register() {
  const navigate = useNavigate()
  const { stats } = useStats()
  const { categories } = useCategories()
  const { t } = useLanguage()
  const sectorOptions = categories.map((c) => ({ value: c.id, label: c.name }))

  const [form, setForm] = useState({
    companyName: '',
    categoryId: undefined,
    address: '',
    email: '',
    phone: '',
    pan: '',
  })
  const [agreed, setAgreed] = useState(false)
  const [logoList, setLogoList] = useState([])
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const { toastSuccess, toastError, toastValidationError } = useFeedback()

  const fieldMessage = (field, nextForm = form, nextAgreed = agreed) => {
    switch (field) {
      case 'companyName':
        return required(nextForm.companyName, 'Company name is required.')
          || minLength(nextForm.companyName, 2, 'Company name must be at least 2 characters.')
      case 'email':
        return validateEmail(nextForm.email)
      case 'categoryId':
        return nextForm.categoryId ? undefined : 'Please select a business sector.'
      case 'address':
        return required(nextForm.address, 'Company address is required.')
          || minLength(nextForm.address, 5, 'Address must be at least 5 characters.')
      case 'phone':
        return validateMobile(nextForm.phone)
      case 'pan':
        return validatePan(nextForm.pan)
      case 'terms':
        return nextAgreed ? undefined : 'Please accept the Terms of Use and Privacy Policy.'
      default:
        return undefined
    }
  }

  const handleChange = (field) => (eOrValue) => {
    let value = eOrValue?.target ? eOrValue.target.value : eOrValue
    if (field === 'phone') value = digitsOnly(value, 10)
    if (field === 'pan') value = String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)

    const nextForm = { ...form, [field]: value }
    setForm(nextForm)

    setFieldErrors((errs) => {
      // Before first blur: only clear an existing error, don't invent new ones while typing.
      if (!touched[field]) {
        return errs[field] ? { ...errs, [field]: undefined } : errs
      }
      const message = fieldMessage(field, nextForm)
      return errs[field] === message ? errs : { ...errs, [field]: message }
    })
  }

  const handleBlur = (field) => () => {
    setTouched((t) => (t[field] ? t : { ...t, [field]: true }))
    const message = fieldMessage(field)
    setFieldErrors((f) => (f[field] === message ? f : { ...f, [field]: message }))
  }

  const logoUploadProps = {
    fileList: logoList,
    multiple: false,
    accept: '.png,.jpg,.jpeg,.svg,.webp',
    beforeUpload: (file) => {
      if (!file.type.startsWith('image/')) {
        message.error('Please upload a PNG, JPG or SVG image.')
        return Upload.LIST_IGNORE
      }
      if (file.size > LOGO_MAX_BYTES) {
        message.error('Logo must be 2MB or smaller.')
        return Upload.LIST_IGNORE
      }
      setLogoList([file])
      return false
    },
    onRemove: () => setLogoList([]),
  }

  const validate = () => collectErrors({
    companyName: fieldMessage('companyName'),
    email: fieldMessage('email'),
    categoryId: fieldMessage('categoryId'),
    address: fieldMessage('address'),
    phone: fieldMessage('phone'),
    pan: fieldMessage('pan'),
    terms: fieldMessage('terms'),
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

    const formData = new FormData()
    formData.append('companyName', form.companyName.trim())
    formData.append('email', form.email.trim().toLowerCase())
    formData.append('phone', form.phone.trim())
    formData.append('address', form.address.trim())
    formData.append('pan', form.pan.trim().toUpperCase())
    if (form.categoryId) formData.append('categoryId', form.categoryId)
    if (logoList[0]) formData.append('logo', logoList[0])

    setSubmitting(true)
    try {
      await register(formData)
      toastSuccess('Registration successful', `We've emailed your login password to ${form.email}.`)
      navigate('/login', { state: { registered: true, email: form.email.trim().toLowerCase() } })
    } catch (err) {
      const msg = err?.message || 'Registration failed. Please check your details and try again.'
      if (/already exists|reserved for the portal administrator/i.test(msg)) {
        setFieldErrors((f) => ({ ...f, email: msg }))
      }
      toastError(err, msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-body">
        <div className="register-panel">
          <Link to="/" className="register-back-link">
            <span aria-hidden="true">←</span> {t('common.backToHome')}
          </Link>

          <span className="register-panel__eyebrow">
            <span className="register-panel__dash" aria-hidden="true" /> {t('register.joinTomorrow')}
          </span>
          <h1>{t('register.titleLine1')} <span>{t('register.titleLine2')}</span></h1>
          <p>{t('register.subtitle')}</p>

          <ul className="register-panel__features">
            {FEATURE_KEYS.map((f) => (
              <li key={f.titleKey}>
                <span className="register-panel__icon" aria-hidden="true">{f.icon}</span>
                <span>
                  <strong>{t(f.titleKey)}</strong>
                  <small>{t(f.textKey)}</small>
                </span>
              </li>
            ))}
          </ul>

          {/* <div className="register-panel__stats">
            <div>
              <span aria-hidden="true">👥</span>
              <span>
                <strong>{stats.companies}+</strong>
                <small>{t('register.verifiedEmployers')}</small>
              </span>
            </div>
            <div className="register-panel__stats-divider" aria-hidden="true" />
            <div>
              <span aria-hidden="true">💼</span>
              <span>
                <strong>{stats.seekers}+</strong>
                <small>{t('register.registeredSeekers')}</small>
              </span>
            </div>
          </div> */}
        </div>

        <div className="register-form-wrap">
          <div className="register-form-card">
            <span className="register-form-card__eyebrow">
              <span className="register-panel__dash register-panel__dash--dark" aria-hidden="true" /> {t('register.companyRegistration')}
            </span>
            <h2>{t('register.createAccount')}</h2>
            <p>{t('register.getStarted')}</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="register-field-row">
                <div className="register-field">
                  <label htmlFor="companyName">{t('register.companyName')} <span className="required">*</span></label>
                  <Input
                    id="companyName"
                    size="large"
                    status={fieldErrors.companyName ? 'error' : undefined}
                    prefix={<BankOutlined />}
                    placeholder={t('register.companyNamePlaceholder')}
                    value={form.companyName}
                    onChange={handleChange('companyName')}
                    onBlur={handleBlur('companyName')}
                  />
                  <FieldError>{fieldErrors.companyName}</FieldError>
                </div>

                <div className="register-field">
                  <label htmlFor="email">{t('register.emailAddress')} <span className="required">*</span></label>
                  <Input
                    id="email"
                    type="email"
                    size="large"
                    status={fieldErrors.email ? 'error' : undefined}
                    prefix={<MailOutlined />}
                    placeholder="company@example.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />
                  <FieldError>{fieldErrors.email}</FieldError>
                </div>
              </div>

              <div className="register-field">
                <label htmlFor="sector">{t('register.businessSector')} <span className="required">*</span></label>
                <Select
                  id="sector"
                  size="large"
                  status={fieldErrors.categoryId ? 'error' : undefined}
                  placeholder={t('register.selectSector')}
                  value={form.categoryId}
                  onChange={(value) => {
                    handleChange('categoryId')(value)
                    setFieldErrors((f) => ({ ...f, categoryId: value ? undefined : 'Please select a business sector.' }))
                  }}
                  options={sectorOptions}
                  style={{ width: '100%' }}
                />
                <FieldError>{fieldErrors.categoryId}</FieldError>
              </div>

              <div className="register-field">
                <label htmlFor="address">{t('register.companyAddress')} <span className="required">*</span></label>
                <div className="register-textarea-wrap">
                  <EnvironmentOutlined className="register-textarea-wrap__icon" />
                  <Input.TextArea
                    id="address"
                    rows={2}
                    status={fieldErrors.address ? 'error' : undefined}
                    placeholder={t('register.addressPlaceholder')}
                    value={form.address}
                    onChange={handleChange('address')}
                    onBlur={handleBlur('address')}
                  />
                </div>
                <FieldError>{fieldErrors.address}</FieldError>
              </div>

              <div className="register-field-row">
                <div className="register-field">
                  <label htmlFor="phone">{t('register.mobileNumber')} <span className="required">*</span></label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    size="large"
                    status={fieldErrors.phone ? 'error' : undefined}
                    prefix={<PhoneOutlined />}
                    placeholder={t('register.mobilePlaceholder')}
                    value={form.phone}
                    onChange={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                  />
                  <FieldError>{fieldErrors.phone}</FieldError>
                </div>

                <div className="register-field">
                  <label htmlFor="pan">{t('register.panNumber')} <span className="required">*</span></label>
                  <Input
                    id="pan"
                    size="large"
                    maxLength={10}
                    status={fieldErrors.pan ? 'error' : undefined}
                    prefix={<IdcardOutlined />}
                    placeholder="ABCDE1234F"
                    value={form.pan}
                    onChange={handleChange('pan')}
                    onBlur={handleBlur('pan')}
                  />
                  <FieldError>{fieldErrors.pan}</FieldError>
                </div>
              </div>

              <div className="register-field">
                <label>{t('register.companyLogo')}</label>
                <Upload.Dragger {...logoUploadProps} className="register-logo-dragger">
                  <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                  <p className="ant-upload-text">{t('register.uploadPrompt')}</p>
                  <p className="ant-upload-hint">{t('register.uploadHint')}</p>
                </Upload.Dragger>
              </div>

              <Checkbox
                className="register-terms"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked)
                  setFieldErrors((f) => ({
                    ...f,
                    terms: e.target.checked ? undefined : f.terms,
                  }))
                }}
              >
                {t('register.agreeTerms')} <Link to="/terms">{t('footer.termsOfUse')}</Link> {t('register.and')} <Link to="/privacy">{t('footer.privacyPolicy')}</Link>
              </Checkbox>
              <FieldError>{fieldErrors.terms}</FieldError>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? t('register.registering') : t('register.cta')}
              </button>

              <p className="register-form-card__footer">
                {t('register.alreadyHaveAccount')} <Link to="/login">{t('nav.login')}</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
