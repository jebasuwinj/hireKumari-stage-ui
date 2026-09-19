import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import PageState from '../components/PageState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { CardGridSkeleton } from '../components/skeletons'
import { useStats } from '../hooks/useStats.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { listCompanies } from '../api/companies.js'
import './Employers.css'

function Employers() {
  const { stats } = useStats()
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const timer = setTimeout(() => {
      listCompanies({ q: query || undefined, limit: 50 })
        .then(({ data }) => {
          if (!cancelled) setCompanies(data)
        })
        .catch((err) => {
          if (!cancelled) setError(err)
        })
        .finally(() => {
          if (!cancelled) setLoading(false)
        })
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  return (
    <>
      <div className="page-hero employers-hero">
        <div className="container employers-hero__inner">
          <span className="employers-hero__eyebrow">
            <span aria-hidden="true">🤝</span> {t('employersPage.eyebrow')}
          </span>
          <h1>{t('employersPage.title')} <span>{t('employersPage.titleHighlight')}</span></h1>
          <p>{stats.companies}+ {t('employersPage.subtitle')}</p>
          <Link to="/register" className="btn btn-primary">{t('employersPage.registerCta')}</Link>
        </div>
      </div>

      <div className="container">
        <div className="employers-stats-bar">
          <div className="employers-stats-bar__item">
            <span style={{ background: '#0b6b3a1f', color: '#0b6b3a' }}>🏢</span>
            <span>
              <strong>{stats.companies}</strong>
              <small>{t('employersPage.companiesHiring')}</small>
            </span>
          </div>
          <div className="employers-stats-bar__item">
            <span style={{ background: '#2b8fd61f', color: '#2b8fd6' }}>💼</span>
            <span>
              <strong>{stats.jobs}+</strong>
              <small>{t('employersPage.openPositions')}</small>
            </span>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t('employersPage.hiringNow')}</h2>
              <p>{t('employersPage.browseVerified')}</p>
            </div>
            <Input
              className="employers-search"
              size="large"
              allowClear
              prefix={<SearchOutlined />}
              placeholder={t('employersPage.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <PageState
            loading={loading}
            error={error}
            skeleton={<CardGridSkeleton count={8} columns={3} />}
          >
            {companies.length > 0 ? (
              <div className="employer-grid">
                {companies.map((c) => (
                  <div key={c.id} className="employer-card">
                    <span className="employer-card__logo" style={{ background: `${c.color}1a`, color: c.color }}>
                      {c.logoUrl ? <img src={c.logoUrl} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : c.initials}
                    </span>
                    <span className="employer-card__badge">{t('employersPage.verified')}</span>
                    <strong>{c.name}</strong>
                    <small>{c.openings} {c.openings === 1 ? t('employersPage.openingSingle') : t('employersPage.openingPlural')}</small>
                    <Link to={`/jobs?q=${encodeURIComponent(c.name)}`} className="btn btn-outline btn-sm">
                      {t('employersPage.viewJobs')}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="🏢"
                title={query ? `${t('employersPage.noneFound')} "${query}"` : t('employersPage.noneYet.title')}
                description={query ? t('employersPage.tryDifferent') : t('employersPage.noneYet.desc')}
              />
            )}
          </PageState>
        </div>
      </section>
    </>
  )
}

export default Employers
