import { useState } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useFeedback } from '../../hooks/useFeedback.jsx'
import PostJobModal from './PostJobModal'
import './AdminLayout.css'

const COMPANY_NAV = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/jobs', label: 'My Jobs', icon: '💼', extraActive: ['/admin/applications'] },
  { to: '/admin/profile', label: 'Company Profile', icon: '🏢' },
]

const SUPER_ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/companies', label: 'Companies', icon: '🏢' },
  { to: '/admin/jobs', label: 'All Jobs', icon: '💼' },
  { to: '/admin/job-fairs', label: 'Job Fairs', icon: '📅' },
  { to: '/admin/categories', label: 'Categories', icon: '🗂️' },
  { to: '/admin/messages', label: 'Messages', icon: '✉️' },
]

function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [postJobOpen, setPostJobOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [onJobSaved, setOnJobSaved] = useState(null)
  const location = useLocation()
  const { user, company, logout } = useAuth()
  const { confirmAction, toastSuccess } = useFeedback()

  const isSuperAdmin = user?.role === 'SUPER_ADMIN'
  const navLinks = isSuperAdmin ? SUPER_ADMIN_NAV : COMPANY_NAV
  const brandName = isSuperAdmin ? 'District Administration' : (company?.name || 'Your Company')
  const initials = isSuperAdmin ? 'KK' : (company?.initials || 'CO')

  const openPostJob = (onSaved) => {
    setEditingJob(null)
    setOnJobSaved(() => onSaved)
    setPostJobOpen(true)
  }

  const openEditJob = (job, onSaved) => {
    setEditingJob(job)
    setOnJobSaved(() => onSaved)
    setPostJobOpen(true)
  }

  const handleLogout = () => {
    confirmAction({
      title: 'Log out?',
      description: "You'll need to log in again to access your dashboard.",
      okText: 'Log Out',
      danger: true,
      onConfirm: () => {
        // Don't also navigate('/') here: clearing the user makes ProtectedRoute
        // redirect to /login on its own, and racing an explicit navigate against
        // that redirect makes the landing page unpredictable.
        logout()
        toastSuccess('Logged out', 'You have been logged out successfully.')
      },
    })
  }

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <Link to="/admin" className="admin-sidebar__brand">
          <span className="admin-sidebar__logo" aria-hidden="true">KK</span>
          <div>
            <strong>Kanniyakumari District</strong>
            <small>{isSuperAdmin ? 'Admin Dashboard' : 'Employer Dashboard'}</small>
          </div>
        </Link>

        <nav className="admin-sidebar__nav">
          {navLinks.map((link) => {
            const forcedActive = link.extraActive?.some((path) => location.pathname.startsWith(path))
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive || forcedActive ? 'is-active' : '')}
              >
                <span aria-hidden="true">{link.icon}</span>
                {link.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-sidebar__exit">
            <span aria-hidden="true">←</span> Exit to Website
          </Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-topbar__menu"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            ☰
          </button>
          <div className="admin-topbar__welcome">
            <strong>Welcome back, {brandName}</strong>
            <small>{isSuperAdmin ? 'Manage companies, jobs and portal-wide settings' : 'Manage your job postings and applications'}</small>
          </div>
          <div className="admin-topbar__avatar" aria-hidden="true">{initials}</div>
          <button type="button" className="admin-topbar__logout" onClick={handleLogout} aria-label="Log out" title="Log out">
            <span aria-hidden="true">⏻</span>
          </button>
        </header>

        <main className="admin-content">
          <Outlet context={{ openPostJob, openEditJob }} />
        </main>
      </div>

      {!isSuperAdmin && (
        <PostJobModal
          open={postJobOpen}
          onClose={() => setPostJobOpen(false)}
          job={editingJob}
          onSaved={onJobSaved}
        />
      )}
    </div>
  )
}

export default AdminLayout
