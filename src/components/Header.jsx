import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useFeedback } from '../hooks/useFeedback.jsx'
import hireKumariLogo from '../assets/hireKumariLogo.png'
import './Header.css'

const NAV_LINKS = [
  { to: '/', key: 'nav.home' },
  { to: '/jobs', key: 'nav.jobs' },
  { to: '/employers', key: 'nav.employers' },
  { to: '/job-fairs', key: 'nav.jobFairs' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, setLang, t } = useLanguage()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { confirmAction, toastSuccess } = useFeedback()

  const handleLogout = () => {
    confirmAction({
      title: 'Log out?',
      description: "You'll need to log in again to access your dashboard.",
      okText: 'Log Out',
      danger: true,
      onConfirm: () => {
        logout()
        toastSuccess('Logged out', 'You have been logged out successfully.')
        navigate('/')
      },
    })
  }

  return (
    <header className="site-header">
      <div className="main-bar">
        <div className="container main-bar__inner">
          <Link to="/" className="brand">
            <img src={hireKumariLogo} alt="Hire Kumari" className="brand__image" />
          </Link>

          <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? 'is-active' : '')}
                onClick={() => setMenuOpen(false)}
                end={link.to === '/'}
              >
                {t(link.key)}
              </NavLink>
            ))}
          </nav>

          <div className="main-bar__actions">
            {user ? (
              <>
                <Link to="/admin" className="btn btn-outline btn-sm">{t('nav.dashboard')}</Link>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleLogout}>{t('nav.logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">{t('nav.login')}</Link>
                <Link to="/register" className="btn btn-primary btn-sm">{t('nav.register')}</Link>
              </>
            )}
            <span className="main-bar__divider" aria-hidden="true" />
            <div className="lang-toggle" role="group" aria-label="Switch language">
              <span className={`lang-toggle__thumb ${lang === 'ta' ? 'lang-toggle__thumb--ta' : ''}`} aria-hidden="true" />
              <button
                type="button"
                className={`lang-toggle__option ${lang === 'en' ? 'is-active' : ''}`}
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
              >
                EN
              </button>
              <button
                type="button"
                className={`lang-toggle__option ${lang === 'ta' ? 'is-active' : ''}`}
                onClick={() => setLang('ta')}
                aria-pressed={lang === 'ta'}
              >
                தமிழ்
              </button>
            </div>
            <button
              type="button"
              className="hamburger"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
