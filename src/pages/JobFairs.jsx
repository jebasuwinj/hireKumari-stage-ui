import { useState } from 'react'
import PageState from '../components/PageState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import JobFairDetailsModal from '../components/JobFairDetailsModal.jsx'
import { ListRowsSkeleton } from '../components/skeletons'
import { useAsync } from '../hooks/useAsync.js'
import { useStats } from '../hooks/useStats.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { listJobFairs } from '../api/jobFairs.js'
import { jobFairStatusMeta } from '../utils/jobFairStatus.js'
import './JobFairs.css'

const FAIR_ICONS = {
  people: '👥',
  chart: '📊',
  monument: '🏛️',
}

function JobFairs() {
  const { stats } = useStats()
  const { t } = useLanguage()
  const { data: jobFairs, loading, error } = useAsync(() => listJobFairs().then((r) => r.data), [])
  const [selectedFair, setSelectedFair] = useState(null)
  const fairs = jobFairs ?? []

  return (
    <>
      <div className="page-hero job-fairs-hero">
        <div className="container job-fairs-hero__inner">
          <span className="job-fairs-hero__eyebrow">
            <span aria-hidden="true">📅</span> {t('jobFairsPage.eyebrow')}
          </span>
          <h1>{t('jobFairsPage.title')} <span>{t('jobFairsPage.titleHighlight')}</span></h1>
          <p>{t('jobFairsPage.subtitle')}</p>
        </div>
      </div>

      <div className="container">
        <div className="job-fairs-stats-bar">
          <div className="job-fairs-stats-bar__item">
            <span style={{ background: '#1f9d551f', color: '#1f9d55' }}>📅</span>
            <span>
              <strong>{fairs.length}</strong>
              <small>{t('jobFairsPage.upcomingEvents')}</small>
            </span>
          </div>
          <div className="job-fairs-stats-bar__item">
            <span style={{ background: '#9b4fd61f', color: '#9b4fd6' }}>🎟️</span>
            <span>
              <strong>{stats.jobFairs}</strong>
              <small>{t('jobFairsPage.eventsThisYear')}</small>
            </span>
          </div>
          <div className="job-fairs-stats-bar__item">
            <span style={{ background: '#2b8fd61f', color: '#2b8fd6' }}>📍</span>
            <span>
              <strong>9</strong>
              <small>{t('jobFairsPage.taluksCovered')}</small>
            </span>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t('jobFairsPage.upcomingJobFairs')}</h2>
              <p>{t('jobFairsPage.registerAdvance')}</p>
            </div>
          </div>

          <PageState
            loading={loading}
            error={error}
            skeleton={<ListRowsSkeleton count={4} withActions={false} />}
          >
            {fairs.length > 0 ? (
              <div className="fairs-list">
                {fairs.map((fair) => (
                  <div key={fair.id} className="fairs-list__item">
                    <span className="fairs-list__icon" style={{ background: `${fair.color}1f`, color: fair.color }}>
                      {FAIR_ICONS[fair.icon]}
                    </span>
                    <div className="fairs-list__date" style={{ background: `${fair.color}1f`, color: fair.color }}>
                      <span>{fair.month}</span>
                      <strong>{fair.day}</strong>
                    </div>
                    <div className="fairs-list__body">
                      <h3>
                        {fair.title}{' '}
                        <span
                          className="tag"
                          style={{ background: `${jobFairStatusMeta(fair.status).color}1f`, color: jobFairStatusMeta(fair.status).color }}
                        >
                          {t(jobFairStatusMeta(fair.status).labelKey)}
                        </span>
                      </h3>
                      <p>📍 {fair.venue}</p>
                      <p>🕒 {fair.time}</p>
                    </div>
                    <div className="fairs-list__actions">
                      <button type="button" className="btn btn-outline" onClick={() => setSelectedFair(fair)}>{t('jobFairsPage.viewDetails')}</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="📅"
                title={t('jobFairsPage.noneScheduled.title')}
                description={t('jobFairsPage.noneScheduled.desc')}
              />
            )}
          </PageState>
        </div>
      </section>

      <JobFairDetailsModal
        fair={selectedFair}
        open={!!selectedFair}
        onClose={() => setSelectedFair(null)}
      />
    </>
  )
}

export default JobFairs
