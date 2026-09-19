import { Link } from 'react-router-dom'
import { useStats } from '../hooks/useStats.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import './About.css'

const STAT_TILES = [
  { id: 'jobs', key: 'stats.jobOpenings', suffix: '+' },
  { id: 'companies', key: 'stats.companiesHiring', suffix: '+' },
  { id: 'jobFairs', key: 'stats.upcomingJobFairs', suffix: '' },
]

const VALUES = [
  { icon: '🛡️', color: '#0454c2', titleKey: 'about.value1.title', textKey: 'about.value1.text' },
  { icon: '🆓', color: '#2b8fd6', titleKey: 'about.value2.title', textKey: 'about.value2.text' },
  { icon: '📍', color: '#f2a12b', titleKey: 'about.value3.title', textKey: 'about.value3.text' },
  { icon: '🤝', color: '#9b4fd6', titleKey: 'about.value4.title', textKey: 'about.value4.text' },
]

function About() {
  const { stats } = useStats()
  const { t } = useLanguage()
  return (
    <>
      <div className="page-hero about-hero">
        <div className="container about-hero__inner">
          <span className="about-hero__eyebrow">
            <span aria-hidden="true">🏛️</span> {t('about.eyebrow')}
          </span>
          <h1>{t('about.titleLine1')} <span>{t('about.titleHighlight')}</span></h1>
          <p>{t('about.intro')}</p>
        </div>
      </div>

      <div className="container">
        <div className="about-stats-bar">
          {STAT_TILES.map((tile) => (
            <div key={tile.id} className="about-stats-bar__item">
              <strong>{stats[tile.id]}{tile.suffix}</strong>
              <small>{t(tile.key)}</small>
            </div>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container about-mission">
          <div className="about-mission__text">
            <span className="section-eyebrow">{t('about.ourMission')}</span>
            <h2>{t('about.missionTitle')}</h2>
            <p>{t('about.missionBody1')}</p>
            <p>{t('about.missionBody2')}</p>
            <Link to="/jobs" className="btn btn-primary">{t('about.exploreOpportunities')}</Link>
          </div>
          <div className="about-mission__figure">
            <span className="about-mission__badge" aria-hidden="true">🎯</span>
            <p className="about-mission__quote">
              {t('about.quote').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <section className="section about-values-section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>{t('about.whyPortal')}</h2>
              <p>{t('about.builtWith')}</p>
            </div>
          </div>

          <div className="about-values-grid">
            {VALUES.map((v) => (
              <div key={v.titleKey} className="about-value-card">
                <span className="about-value-card__icon" style={{ background: `${v.color}1f`, color: v.color }}>
                  {v.icon}
                </span>
                <strong>{t(v.titleKey)}</strong>
                <p>{t(v.textKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default About
