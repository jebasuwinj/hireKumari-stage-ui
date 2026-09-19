import { useState } from 'react'
import { Input } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { submitContact } from '../api/contact.js'
import { useFeedback } from '../hooks/useFeedback.jsx'
import FieldError from '../components/FieldError.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import {
  collectErrors,
  digitsOnly,
  minLength,
  required,
  validateEmail,
  validateMobile,
} from '../utils/validation.js'
import './Contact.css'

const CONTACT_CARDS = [
  {
    icon: '📍',
    color: '#0454c2',
    titleKey: 'contact.card1.title',
    lines: ['District Employment Office', 'Collectorate Complex, Nagercoil, KK District'],
  },
  {
    icon: '📞',
    color: '#2b8fd6',
    titleKey: 'contact.card2.title',
    lines: ['+91 4652 123 456', 'Mon - Sat, 10 AM - 5 PM'],
  },
  {
    icon: '✉️',
    color: '#f2a12b',
    titleKey: 'contact.card3.title',
    lines: ['support@kkjobportal.gov.in', 'employers@kkjobportal.gov.in'],
  },
  {
    icon: '🕒',
    color: '#9b4fd6',
    titleKey: 'contact.card4.title',
    lines: ['Monday - Saturday', '10:00 AM - 5:00 PM'],
  },
]

const FAQ_KEYS = [
  { qKey: 'contact.faq1.q', aKey: 'contact.faq1.a' },
  { qKey: 'contact.faq2.q', aKey: 'contact.faq2.a' },
  { qKey: 'contact.faq3.q', aKey: 'contact.faq3.a' },
]

function Contact() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const { toastSuccess, toastError, toastValidationError } = useFeedback()

  const fieldMessage = (field, next = form) => {
    switch (field) {
      case 'name':
        return required(next.name, 'Full name is required.')
          || minLength(next.name, 2, 'Name must be at least 2 characters.')
      case 'email':
        return validateEmail(next.email)
      case 'phone':
        return validateMobile(next.phone, { required: false })
      case 'message':
        return required(next.message, 'Please enter a message.')
          || minLength(next.message, 5, 'Message must be at least 5 characters.')
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
    message: fieldMessage('message'),
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
      await submitContact(form)
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', message: '' })
      toastSuccess('Message sent', "Thanks for reaching out — we'll get back to you shortly.")
    } catch (err) {
      toastError(err, 'Could not send your message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="page-hero contact-hero">
        <div className="container contact-hero__inner">
          <span className="contact-hero__eyebrow">
            <span aria-hidden="true">💬</span> {t('contact.eyebrow')}
          </span>
          <h1>{t('contact.title')} <span>{t('contact.titleHighlight')}</span></h1>
          <p>{t('contact.subtitle')}</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-cards-bar">
          {CONTACT_CARDS.map((c) => (
            <div key={c.titleKey} className="contact-card">
              <span className="contact-card__icon" style={{ background: `${c.color}1f`, color: c.color }}>
                {c.icon}
              </span>
              <strong>{t(c.titleKey)}</strong>
              {c.lines.map((line) => (
                <small key={line}>{line}</small>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container contact-layout">
          <div className="contact-form-card">
            <h2>{t('contact.sendMessage')}</h2>
            <p>{t('contact.responseTime')}</p>

            {submitted ? (
              <div className="contact-form-success">
                <span aria-hidden="true">✔</span>
                <div>
                  <strong>{t('contact.success.title')}</strong>
                  <p>{t('contact.success.desc')}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="contact-form__row">
                  <div className="contact-field">
                    <label htmlFor="name">{t('contact.fullName')} <span className="required">*</span></label>
                    <Input
                      id="name"
                      size="large"
                      status={fieldErrors.name ? 'error' : undefined}
                      prefix={<UserOutlined />}
                      placeholder={t('contact.namePlaceholder')}
                      value={form.name}
                      onChange={handleChange('name')}
                      onBlur={handleBlur('name')}
                    />
                    <FieldError>{fieldErrors.name}</FieldError>
                  </div>
                  <div className="contact-field">
                    <label htmlFor="phone">{t('contact.phoneNumber')}</label>
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      size="large"
                      status={fieldErrors.phone ? 'error' : undefined}
                      prefix={<PhoneOutlined />}
                      placeholder={t('contact.phonePlaceholder')}
                      value={form.phone}
                      onChange={handleChange('phone')}
                      onBlur={handleBlur('phone')}
                    />
                    <FieldError>{fieldErrors.phone}</FieldError>
                  </div>
                </div>

                <div className="contact-field">
                  <label htmlFor="email">{t('contact.emailAddress')} <span className="required">*</span></label>
                  <Input
                    id="email"
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

                <div className="contact-field">
                  <label htmlFor="message">{t('contact.message')} <span className="required">*</span></label>
                  <Input.TextArea
                    id="message"
                    rows={5}
                    status={fieldErrors.message ? 'error' : undefined}
                    placeholder={t('contact.messagePlaceholder')}
                    value={form.message}
                    onChange={handleChange('message')}
                    onBlur={handleBlur('message')}
                  />
                  <FieldError>{fieldErrors.message}</FieldError>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                  {submitting ? t('contact.sending') : t('contact.sendCta')}
                </button>
              </form>
            )}
          </div>

          <aside className="contact-side">
            <div className="contact-side__card">
              <h3>{t('contact.faqTitle')}</h3>
              <div className="contact-faq">
                {FAQ_KEYS.map((f) => (
                  <details key={f.qKey} className="contact-faq__item">
                    <summary>{t(f.qKey)}</summary>
                    <p>{t(f.aKey)}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="contact-side__map">
              <iframe
                title="Kanniyakumari District Collector Office location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.2345617423603!2d77.4239578!3d8.1791095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04f1207ece5ebb%3A0x9a58a7f7f7951bb!2sKanniyakumari%20District%20Collector%20Office!5e0!3m2!1sen!2sin!4v1789564689418!5m2!1sen!2sin"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

export default Contact
