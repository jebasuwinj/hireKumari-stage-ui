import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Input, Alert } from 'antd'
import { BankOutlined, LockOutlined } from '@ant-design/icons'
import { useStats } from '../hooks/useStats.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useFeedback } from '../hooks/useFeedback.jsx'
import FieldError from '../components/FieldError.jsx'
import { collectErrors, required, validateIdentifier } from '../utils/validation.js'
import './Register.css'

const FEATURE_KEYS = [
  { icon: '💼', titleKey: 'login.feature1.title', textKey: 'login.feature1.text' },
  { icon: '📄', titleKey: 'login.feature2.title', textKey: 'login.feature2.text' },
  { icon: '🛡️', titleKey: 'login.feature3.title', textKey: 'login.feature3.text' },
  { icon: '📊', titleKey: 'login.feature4.title', textKey: 'login.feature4.text' },
]

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { stats } = useStats()
  const { t } = useLanguage()
  const { toastSuccess, toastError, toastValidationError } = useFeedback()
  const [form, setForm] = useState({ identifier: location.state?.email || '', password: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const registeredNotice = location.state?.registered
    ? `Registration successful! We've emailed your login password${location.state.email ? ` to ${location.state.email}` : ''}.`
    : ''

  const fieldMessage = (field, next = form) => {
    if (field === 'identifier') return validateIdentifier(next.identifier)
    if (field === 'password') return required(next.password, 'Enter your password.')
    return undefined
  }

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setFieldErrors((f) => (f[field] ? { ...f, [field]: undefined } : f))
  }

  const handleBlur = (field) => () => {
    const message = fieldMessage(field)
    setFieldErrors((f) => (f[field] === message ? f : { ...f, [field]: message }))
  }

  const validate = () => collectErrors({
    identifier: fieldMessage('identifier'),
    password: fieldMessage('password'),
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
    setSubmitting(true)
    try {
      await login(form.identifier.trim(), form.password)
      toastSuccess('Login successful', 'Welcome back!')
      const redirectTo = location.state?.from?.pathname || '/admin'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your details and try again.'
      setFieldErrors({ identifier: 'Check your email or mobile number.', password: msg })
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
            <span className="register-panel__dash" aria-hidden="true" /> {t('login.welcomeBack')}
          </span>
          <h1>{t('login.titleLine1')}<br /><span>{t('login.titleLine2')}</span></h1>
          <p>{t('login.subtitle')}</p>

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
                <small>{t('login.verifiedEmployers')}</small>
              </span>
            </div>
            <div className="register-panel__stats-divider" aria-hidden="true" />
            <div>
              <span aria-hidden="true">💼</span>
              <span>
                <strong>{stats.jobs}+</strong>
                <small>{t('login.openListings')}</small>
              </span>
            </div>
          </div> */}
        </div>

        <div className="register-form-wrap">
          <div className="register-form-card">
            <span className="register-form-card__eyebrow">
              <span className="register-panel__dash register-panel__dash--dark" aria-hidden="true" /> {t('login.companyLogin')}
            </span>
            <h2>{t('login.welcomeBack')}</h2>
            <p>{t('login.enterDetails')}</p>

            {registeredNotice && (
              <Alert type="success" showIcon title={registeredNotice} style={{ marginBottom: 16 }} />
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="register-field">
                <label htmlFor="identifier">{t('login.identifierLabel')}</label>
                <Input
                  id="identifier"
                  size="large"
                  status={fieldErrors.identifier ? 'error' : undefined}
                  prefix={<BankOutlined />}
                  placeholder="company@example.com"
                  value={form.identifier}
                  onChange={handleChange('identifier')}
                  onBlur={handleBlur('identifier')}
                />
                <FieldError>{fieldErrors.identifier}</FieldError>
              </div>

              <div className="register-field">
                <label htmlFor="password">{t('login.passwordLabel')}</label>
                <Input.Password
                  id="password"
                  size="large"
                  status={fieldErrors.password ? 'error' : undefined}
                  prefix={<LockOutlined />}
                  placeholder={t('login.passwordPlaceholder')}
                  value={form.password}
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                <FieldError>{fieldErrors.password}</FieldError>
              </div>

              <p style={{ textAlign: 'right', marginTop: -8, marginBottom: 20 }}>
                <Link to="/forgot-password">{t('login.forgotPassword')}</Link>
              </p>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? t('login.loggingIn') : t('login.cta')}
              </button>

              <p className="register-form-card__footer">
                {t('login.noAccount')} <Link to="/register">{t('login.registerHere')}</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
