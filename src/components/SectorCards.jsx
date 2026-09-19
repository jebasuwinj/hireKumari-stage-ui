import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCategories } from '../hooks/useCategories.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { CardGridSkeleton } from './skeletons'
import './SectorCards.css'

const SECTOR_ICONS = {
  gear: '⚙️',
  heart: '❤️',
  cap: '🎓',
  store: '🏬',
  bell: '🔔',
  code: '🖥️',
  gov: '🏛️',
  dots: '⋯',
}

export function SectorIcon({ icon }) {
  return <span aria-hidden="true">{SECTOR_ICONS[icon] ?? '⋯'}</span>
}

function SectorCards({ limit }) {
  const { categories, loading } = useCategories()
  const { t } = useLanguage()
  const list = limit ? categories.slice(0, limit) : categories
  const trackRef = useRef(null)

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' })
  }

  if (!loading && list.length === 0) return null

  return (
    <section className="section sector-section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>{t('sectors.title')}</h2>
            <p>{t('sectors.subtitle')}</p>
          </div>
          <div className="section-head__actions">
            <Link to="/jobs" className="section-link">{t('sectors.viewAll')}</Link>
            <div className="sector-section__nav">
              <button type="button" onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>
              <button type="button" onClick={() => scroll(1)} aria-label="Scroll right">›</button>
            </div>
          </div>
        </div>

        {loading ? (
          <CardGridSkeleton count={8} variant="sector" />
        ) : (
          <div className="sector-grid" ref={trackRef}>
            {list.map((sector) => (
              <Link
                key={sector.id}
                to={`/jobs?sector=${encodeURIComponent(sector.name)}`}
                className="sector-card"
                style={{ background: `${sector.color}14`, borderColor: `${sector.color}33` }}
              >
                <span className="sector-card__icon" style={{ background: `${sector.color}26`, color: sector.color }}>
                  <SectorIcon icon={sector.icon} />
                </span>
                <strong>{sector.displayName}</strong>
                <small>{sector.count} {t('sectors.jobsSuffix')}</small>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default SectorCards
