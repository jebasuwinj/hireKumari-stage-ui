import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ConfigProvider, App as AntApp } from 'antd'
import { AuthProvider } from './context/AuthContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import JobDetails from './pages/JobDetails'
import Employers from './pages/Employers'
import JobFairs from './pages/JobFairs'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminJobs from './pages/admin/AdminJobs'
import AdminApplications from './pages/admin/AdminApplications'
import AdminJobFairs from './pages/admin/AdminJobFairs'
import AdminCategories from './pages/admin/AdminCategories'
import AdminProfile from './pages/admin/AdminProfile'
import SuperAdminCompanies from './pages/admin/SuperAdminCompanies'
import SuperAdminMessages from './pages/admin/SuperAdminMessages'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function ComingSoon() {
  return (
    <div className="section container empty-state">
      <h2 style={{ marginBottom: 8, color: 'var(--color-text)' }}>Coming Soon</h2>
      <p>This page is being built. Please check back shortly.</p>
    </div>
  )
}

function Layout({ children }) {
  const { pathname } = useLocation()
  const hideChrome =
    pathname === '/register' ||
    pathname === '/login' ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/admin')

  return (
    <>
      {!hideChrome && <Header />}
      <main style={{ flex: 1 }}>{children}</main>
      {!hideChrome && <Footer />}
    </>
  )
}

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0454c2',
          colorLink: '#0454c2',
          borderRadius: 8,
          fontFamily: 'Inter, "Segoe UI", sans-serif',
        },
      }}
      modal={{
        centered: true,
        styles: {
          content: {
            maxHeight: 'min(60vh, 520px)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
          body: {
            overflowY: 'auto',
            overflowX: 'hidden',
            minHeight: 0,
          },
        },
      }}
    >
      {/* antd's <App> wires up context for the message / notification / Modal.confirm
          static-style APIs so toasts and confirm dialogs pick up the theme above. */}
      <AntApp>
        <BrowserRouter>
          <LanguageProvider>
          <AuthProvider>
            <ScrollToTop />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:slug" element={<JobDetails />} />
                <Route path="/employers" element={<Employers />} />
                <Route path="/job-fairs" element={<JobFairs />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="jobs" element={<AdminJobs />} />
                  <Route
                    path="applications"
                    element={
                      <ProtectedRoute allowedRoles={['COMPANY']}>
                        <AdminApplications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute allowedRoles={['COMPANY']}>
                        <AdminProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="companies"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                        <SuperAdminCompanies />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="job-fairs"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                        <AdminJobFairs />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="categories"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                        <AdminCategories />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="messages"
                    element={
                      <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                        <SuperAdminMessages />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                <Route path="*" element={<ComingSoon />} />
              </Routes>
            </Layout>
          </AuthProvider>
          </LanguageProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  )
}

export default App
