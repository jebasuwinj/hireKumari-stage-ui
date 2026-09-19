import { Link } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { listJobFairs } from '../api/jobFairs.js'
import { ListRowsSkeleton } from './skeletons'
import './JobFairSection.css'

const FAIR_ICONS = {
  people: '👥',
  chart: '📊',
  monument: '🏛️',
}

function JobFairSection() {
  const { data, loading } = useAsync(() => listJobFairs().then((r) => r.data), [])
  const { t } = useLanguage()
  const fairs = (data ?? []).slice(0, 3)

  if (!loading && fairs.length === 0) return null

  return (
    <section className="section job-fair-section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>{t('jobFairs.section.title')}</h2>
            <p>{t('jobFairs.section.subtitle')}</p>
          </div>
          <Link to="/job-fairs" className="section-link">{t('jobFairs.viewAllEvents')}</Link>
        </div>

        {loading ? (
          <ListRowsSkeleton count={3} withActions={false} />
        ) : (
          <div className="job-fair-grid">
            {fairs.map((fair) => (
              <Link key={fair.id} to="/job-fairs" className="job-fair-card">
                <span className="job-fair-card__badge" style={{ background: `${fair.color}1f`, color: fair.color }}>
                  {FAIR_ICONS[fair.icon]}
                </span>
                <div className="job-fair-card__date" style={{ background: `${fair.color}1f`, color: fair.color }}>
                  <span>{fair.month}</span>
                  <strong>{fair.day}</strong>
                </div>
                <div className="job-fair-card__body">
                  <h3>{fair.title}</h3>
                  <p>📍 {fair.venue}</p>
                  <p>🕒 {fair.time}</p>
                </div>
                <span className="job-fair-card__arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default JobFairSection
