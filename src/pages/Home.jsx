import { useRef } from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import VisionInitiative from '../components/VisionInitiative'
// import CollectorSpotlight from '../components/CollectorSpotlight'
import SectorCards from '../components/SectorCards'
import JobCard from '../components/JobCard'
import JobFairSection from '../components/JobFairSection'
import PageState from '../components/PageState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { CardGridSkeleton } from '../components/skeletons'
import { useLanguage } from '../context/LanguageContext.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { listJobs } from '../api/jobs.js'
import { listCompanies } from '../api/companies.js'
import './Home.css'

function Home() {
  const trackRef = useRef(null)
  const { t } = useLanguage()

  const { data: latestJobs, loading: jobsLoading, error: jobsError } = useAsync(
    () => listJobs({ sort: 'latest', limit: 4 }).then((r) => r.data),
    [],
  )
  const { data: companies, loading: companiesLoading, error: companiesError } = useAsync(
    () => listCompanies({ limit: 12 }).then((r) => r.data),
    [],
  )

  const scrollCompanies = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  const companyList = companies ?? []
  const showCompanies = companiesLoading || (!companiesError && companyList.length > 0)

  return (
    <>
      <HeroSection />
      <StatsSection />
      <VisionInitiative />
      {/* <CollectorSpotlight /> */}
      <SectorCards />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t('home.latestJobs.title')}</h2>
              <p>{t('home.latestJobs.subtitle')}</p>
            </div>
            <Link to="/jobs" className="section-link">{t('home.viewAllJobs')}</Link>
          </div>

          <PageState
            loading={jobsLoading}
            error={jobsError}
            skeleton={<CardGridSkeleton count={4} />}
          >
            {(latestJobs ?? []).length ? (
              <div className="job-grid">
                {(latestJobs ?? []).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <EmptyState icon="💼" title={t('home.noJobs.title')} description={t('home.noJobs.desc')} />
            )}
          </PageState>
        </div>
      </section>

      {showCompanies && (
        <section className="section companies-section">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>{t('home.companiesHiring.title')}</h2>
                <p>
                  {companiesLoading
                    ? t('home.loadingEmployers')
                    : `${companyList.length}+ ${t('home.companiesRegisteredSuffix')}`}
                </p>
              </div>
              <Link to="/employers" className="section-link">{t('home.viewAllCompanies')}</Link>
            </div>

            <PageState
              loading={companiesLoading}
              error={companiesError}
              skeleton={<CardGridSkeleton count={4} />}
            >
              <div className="companies-carousel">
                <button type="button" className="companies-carousel__nav" onClick={() => scrollCompanies(-1)} aria-label="Scroll left">
                  ‹
                </button>
                <div className="companies-carousel__track" ref={trackRef}>
                  {companyList.map((c) => (
                    <Link
                      key={c.id}
                      to={`/jobs?q=${encodeURIComponent(c.name)}`}
                      className="company-product-card"
                      style={{ '--company-color': c.color || 'var(--color-primary)' }}
                    >
                      <span className="company-product-card__media">
                        {c.logoUrl ? (
                          <img src={c.logoUrl} alt="" />
                        ) : (
                          <span className="company-product-card__initials" style={{ color: c.color, background: `${c.color || '#0454c2'}14` }}>
                            {c.initials}
                          </span>
                        )}
                      </span>
                      <span className="company-product-card__body">
                        <strong className="company-product-card__name">{c.name}</strong>
                        <small className="company-product-card__meta">
                          {c.openings} {c.openings === 1 ? t('employersPage.openingSingle') : t('employersPage.openingPlural')}
                        </small>
                        <span className="company-product-card__cta">{t('employersPage.viewJobs')} →</span>
                      </span>
                    </Link>
                  ))}
                </div>
                <button type="button" className="companies-carousel__nav" onClick={() => scrollCompanies(1)} aria-label="Scroll right">
                  ›
                </button>
              </div>
            </PageState>
          </div>
        </section>
      )}

      <JobFairSection />
    </>
  )
}

export default Home
