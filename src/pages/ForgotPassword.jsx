import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Alert } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { forgotPassword } from '../api/auth.js'
import { useFeedback } from '../hooks/useFeedback.jsx'
import FieldError from '../components/FieldError.jsx'
import { validateEmail } from '../utils/validation.js'
import './Register.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const { toastSuccess, toastError, toastValidationError } = useFeedback()

  const handleChange = (e) => {
    setEmail(e.target.value)
    if (fieldError) setFieldError('')
  }

  const handleBlur = () => {
    setFieldError(validateEmail(email) || '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const error = validateEmail(email)
    if (error) {
      setFieldError(error)
      toastValidationError()
      return
    }
    setFieldError('')

    setSubmitting(true)
    try {
      await forgotPassword(email.trim().toLowerCase())
      setSent(true)
      toastSuccess('Reset link sent', 'Check your email — the link expires in 30 minutes.')
    } catch (err) {
      toastError(err, 'Something went wrong. Please try again.')
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
            <h2>Forgot Password?</h2>
            <p>Enter the email address on your company account and we&apos;ll send you a reset link.</p>

            {sent ? (
              <Alert
                type="success"
                showIcon
                title="Check your email"
                description="If an account exists for this email, a reset link has been sent. It expires in 30 minutes."
              />
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="register-field">
                  <label htmlFor="email">Email Address</label>
                  <Input
                    id="email"
                    type="email"
                    size="large"
                    status={fieldError ? 'error' : undefined}
                    prefix={<MailOutlined />}
                    placeholder="company@example.com"
                    value={email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FieldError>{fieldError}</FieldError>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send Reset Link →'}
                </button>
              </form>
            )}

            <p className="register-form-card__footer">
              <Link to="/login">← Back to Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
