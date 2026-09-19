import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Input } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { resetPassword } from '../api/auth.js'
import { useFeedback } from '../hooks/useFeedback.jsx'
import FieldError from '../components/FieldError.jsx'
import { collectErrors, validatePassword, validatePasswordConfirm } from '../utils/validation.js'
import './Register.css'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const { toastSuccess, toastError, toastValidationError } = useFeedback()

  const fieldMessage = (field) => {
    if (field === 'password') return validatePassword(password)
    if (field === 'confirmPassword') return validatePasswordConfirm(password, confirmPassword)
    return undefined
  }

  const validate = () => collectErrors({
    password: fieldMessage('password'),
    confirmPassword: fieldMessage('confirmPassword'),
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
      await resetPassword(token, password)
      toastSuccess('Password reset', 'You can now log in with your new password.')
      navigate('/login', { state: { reset: true } })
    } catch (err) {
      toastError(err, 'This reset link is invalid or has expired.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-body register-body--single">
        <div className="register-form-wrap">
          <div className="register-form-card">
            <span className="register-form-card__eyebrow">
              <span className="register-panel__dash register-panel__dash--dark" aria-hidden="true" /> Password Reset
            </span>
            <h2>Set a New Password</h2>
            <p>Choose a new password for your company account.</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="register-field">
                <label htmlFor="password">New Password</label>
                <Input.Password
                  id="password"
                  size="large"
                  status={fieldErrors.password ? 'error' : undefined}
                  prefix={<LockOutlined />}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setFieldErrors((f) => (f.password ? { ...f, password: undefined } : f))
                  }}
                  onBlur={() => {
                    const message = fieldMessage('password')
                    setFieldErrors((f) => ({
                      ...f,
                      password: message,
                      confirmPassword: confirmPassword ? validatePasswordConfirm(password, confirmPassword) : f.confirmPassword,
                    }))
                  }}
                />
                <FieldError>{fieldErrors.password}</FieldError>
              </div>

              <div className="register-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Input.Password
                  id="confirmPassword"
                  size="large"
                  status={fieldErrors.confirmPassword ? 'error' : undefined}
                  prefix={<LockOutlined />}
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setFieldErrors((f) => (f.confirmPassword ? { ...f, confirmPassword: undefined } : f))
                  }}
                  onBlur={() => {
                    const message = fieldMessage('confirmPassword')
                    setFieldErrors((f) => (f.confirmPassword === message ? f : { ...f, confirmPassword: message }))
                  }}
                />
                <FieldError>{fieldErrors.confirmPassword}</FieldError>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? 'Saving…' : 'Reset Password →'}
              </button>
            </form>

            <p className="register-form-card__footer">
              <Link to="/login">← Back to Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
