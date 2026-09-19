import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Select } from 'antd'
import SearchJobs from '../components/SearchJobs'
import JobCard from '../components/JobCard'
import PageState from '../components/PageState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { CardGridSkeleton } from '../components/skeletons'
import { SectorIcon } from '../components/SectorCards'
import { useCategories } from '../hooks/useCategories.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { listJobs } from '../api/jobs.js'
import './Jobs.css'

const PAGE_SIZE = 10

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { categories } = useCategories()
  const { t } = useLanguage()

  const SORT_OPTIONS = [
    { value: 'latest', label: t('jobsPage.sortLatest') },
    { value: 'salary-high', label: t('jobsPage.sortSalaryHigh') },
    { value: 'salary-low', label: t('jobsPage.sortSalaryLow') },
  ]
  const [activeSector, setActiveSector] = useState(searchParams.get('sector') || 'All')
  const [sortBy, setSortBy] = useState('latest')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ items: [], meta: { total: 0, totalPages: 1 } })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filters = {
    keyword: searchParams.get('q') || '',
    taluk: searchParams.get('taluk') || 'All Taluks',
    sector: searchParams.get('sector') || 'All Sectors',
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    listJobs({
      q: filters.keyword || undefined,
      taluk: filters.taluk !== 'All Taluks' ? filters.taluk : undefined,
      sector: filters.sector !== 'All Sectors' ? filters.sector : undefined,
      sort: sortBy,
      page,
      limit: PAGE_SIZE,
    })
      .then(({ data, meta }) => {
        if (!cancelled) setResult({ items: data, meta })
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.keyword, filters.taluk, filters.sector, sortBy, page])

  const handleSearch = (values) => {
    const params = new URLSearchParams()
    if (values.keyword) params.set('q', values.keyword)
    if (values.taluk && values.taluk !== 'All Taluks') params.set('taluk', values.taluk)
    if (values.sector && values.sector !== 'All Sectors') params.set('sector', values.sector)
    setActiveSector(values.sector === 'All Sectors' ? 'All' : values.sector)
    setSearchParams(params)
    setPage(1)
  }

  const handleSectorChip = (name) => {
    setActiveSector(name)
    const params = new URLSearchParams(searchParams)
    if (name === 'All') {
      params.delete('sector')
    } else {
      params.set('sector', name)
    }
    setSearchParams(params)
    setPage(1)
  }

  const { items: pageJobs, meta } = result
  const totalPages = meta.totalPages || 1
  const isLastPage = page === totalPages

  return (
    <>
      <div className="page-hero jobs-hero">
        <div className="container jobs-hero__inner">
          <span className="jobs-hero__eyebrow">
            <span aria-hidden="true">🧭</span> {t('jobsPage.eyebrow')}
          </span>
          <h1>{t('jobsPage.titleLine1')} <span>{t('jobsPage.titleLine2')}</span></h1>
          <p>{t('jobsPage.subtitle')}</p>
          <div className="jobs-search-wrap">
            <SearchJobs variant="compact" initialValues={filters} onSearch={handleSearch} />
          </div>

          {/* <p className="jobs-hero__handwritten">
            Kanyakumari
            <small>Where Opportunities Meet New Horizons</small>
          </p> */}
        </div>
      </div>

      <div className="container">
        <div className="jobs-sector-bar">
          <button
            type="button"
            className={`jobs-sector-bar__all ${activeSector === 'All' ? 'is-active' : ''}`}
            onClick={() => handleSectorChip('All')}
          >
            <span className="jobs-sector-bar__icon" aria-hidden="true">🗂️</span>
            <span>
              <strong>{t('jobsPage.allJobs')}</strong>
              <small>{t('jobsPage.viewAllOpenings')}</small>
            </span>
          </button>

          {categories.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`jobs-sector-bar__pill ${activeSector === s.name ? 'is-active' : ''}`}
              onClick={() => handleSectorChip(s.name)}
              style={activeSector === s.name ? { borderColor: s.color, color: s.color } : undefined}
            >
              <span style={{ color: s.color }}><SectorIcon icon={s.icon} /></span>
              {s.displayName}
            </button>
          ))}
        </div>
      </div>

      <section className="section jobs-results-section">
        <div className="container">
          <div className="jobs-results__head">
            <div>
              <h2>{t('jobsPage.latestOpenings')}</h2>
              <p>{t('jobsPage.discoverNext')}</p>
            </div>
            <div className="jobs-results__controls">
              <Select
                value={sortBy}
                onChange={(v) => {
                  setSortBy(v)
                  setPage(1)
                }}
                options={SORT_OPTIONS}
                popupMatchSelectWidth={false}
              />
              <span className="jobs-results__count">{meta.total ?? 0} {t('jobsPage.jobsFound')}</span>
            </div>
          </div>

          <PageState
            loading={loading}
            error={error}
            skeleton={<CardGridSkeleton count={8} />}
          >
            {pageJobs.length > 0 ? (
              <div className="job-grid">
                {pageJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}

                {isLastPage && (
                  <div className="job-promo-card">
                    <div className="job-promo-card__text">
                      <span className="job-promo-card__eyebrow">{t('jobsPage.promo.eyebrow')}</span>
                      <h3>{t('jobsPage.promo.title')}</h3>
                      <ul>
                        <li>{t('jobsPage.promo.point1')}</li>
                        <li>{t('jobsPage.promo.point2')}</li>
                        <li>{t('jobsPage.promo.point3')}</li>
                        <li>{t('jobsPage.promo.point4')}</li>
                      </ul>
                      <Link to="/register" className="btn btn-primary">{t('jobsPage.promo.cta')}</Link>
                    </div>
                    <div className="job-promo-card__figure">
                      <span className="job-promo-card__avatar" aria-hidden="true">🧑‍🎓</span>
                      <p className="job-promo-card__note">{t('jobsPage.promo.note').split('\n').map((line, i) => (
                        <span key={i}>{line}{i === 0 && <br />}</span>
                      ))}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                icon="🔍"
                title={t('jobsPage.noMatch.title')}
                description={t('jobsPage.noMatch.desc')}
              />
            )}

            {totalPages > 1 && (
              <div className="jobs-pagination">
                <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button key={n} type="button" className={n === page ? 'is-active' : ''} onClick={() => setPage(n)}>
                    {n}
                  </button>
                ))}
                <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} aria-label="Next page">›</button>
              </div>
            )}
          </PageState>
        </div>
      </section>
    </>
  )
}

export default Jobs
