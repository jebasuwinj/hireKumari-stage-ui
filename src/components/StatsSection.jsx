import { Link } from 'react-router-dom'
import { useStats } from '../hooks/useStats.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { Skeleton } from './skeletons'
import './StatsSection.css'

const TILES = [
  { id: 'jobs', key: 'stats.jobOpenings', icon: 'briefcase', color: '#0b6b3a', suffix: '+' },
  { id: 'companies', key: 'stats.companiesHiring', icon: 'building', color: '#f2a12b', suffix: '+' },
  { id: 'jobFairs', key: 'stats.upcomingJobFairs', icon: 'calendar', color: '#9b4fd6', suffix: '' },
]

const ICONS = {
  briefcase: '💼',
  people: '👥',
  building: '🏢',
  calendar: '📅',
}

function StatsSection() {
  const { stats, loading } = useStats()
  const { t } = useLanguage()

  return (
    <section className="stats-section">
      <div className="container stats-section__grid">
        {loading ? (
          <>
            {TILES.map((tile) => (
              <div key={tile.id} className="stats-card">
                <Skeleton circle width={46} height={46} />
                <span className="stats-card__text">
                  <Skeleton width="48%" height={20} style={{ marginBottom: 8 }} />
                  <Skeleton width="72%" height={12} />
                </span>
              </div>
            ))}
            <div className="stats-card stats-card--accent" style={{ background: '#fff', color: 'inherit' }}>
              <Skeleton circle width={46} height={46} />
              <span className="stats-card__text">
                <Skeleton width="60%" height={18} style={{ marginBottom: 8 }} />
                <Skeleton width="80%" height={12} />
              </span>
            </div>
          </>
        ) : (
          <>
            {TILES.map((tile) => (
              <div key={tile.id} className="stats-card">
                <span className="stats-card__icon" style={{ background: `${tile.color}1f`, color: tile.color }}>
                  {ICONS[tile.icon]}
                </span>
                <span className="stats-card__text">
                  <strong>{`${stats[tile.id]}${tile.suffix}`}</strong>
                  <small>{t(tile.key)}</small>
                </span>
              </div>
            ))}

            <Link to="/jobs" className="stats-card stats-card--accent">
              <span className="stats-card__icon stats-card__icon--accent" aria-hidden="true">🗺️</span>
              <span className="stats-card__text">
                <strong>{t('stats.kanniyakumari')}</strong>
                <small>{t('stats.landOfOpportunities')}</small>
              </span>
              <span className="stats-card__arrow" aria-hidden="true">→</span>
            </Link>
          </>
        )}
      </div>
    </section>
  )
}

export default StatsSection
