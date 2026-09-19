import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import './JobCard.css'

function JobCard({ job, layout = 'grid' }) {
  const { t } = useLanguage()
  const sectorColor = job.sectorColor || '#6b7280'
  const companyName = typeof job.company === 'string' ? job.company : job.company?.name

  return (
    <div className={`job-card ${layout === 'list' ? 'job-card--list' : ''}`}>
      <div className="job-card__top">
        <span className="job-card__logo" style={{ background: `${job.logoColor}26`, color: job.logoColor }}>
          {job.logoUrl ? <img src={job.logoUrl} alt={companyName} /> : job.logo}
        </span>
        {layout !== 'list' && <span className="job-card__posted">{job.posted}</span>}
      </div>

      <div className="job-card__body">
        <div className="job-card__heading">
          <Link to={`/jobs/${job.slug}`} className="job-card__title">{job.title}</Link>
          <p className="job-card__company">{companyName}</p>
        </div>

        <ul className="job-card__meta">
          <li><span aria-hidden="true">📍</span><span>{job.location}</span></li>
          <li><span aria-hidden="true">💰</span><span>{job.salary}</span></li>
          <li><span aria-hidden="true">🎓</span><span>{job.qualification}</span></li>
          <li><span aria-hidden="true">👥</span><span>{job.vacancies} {t('jobCard.vacancies')}</span></li>
        </ul>

        <div className="job-card__tags">
          <span className="tag" style={{ background: `${sectorColor}1f`, color: sectorColor }}>{job.sector}</span>
          <span className="tag tag--muted">{job.type}</span>
        </div>
      </div>

      <div className="job-card__footer">
        {layout === 'list' && <span className="job-card__posted">{job.posted}</span>}
        <Link to={`/jobs/${job.slug}`} className={`btn btn-primary btn-sm ${layout !== 'list' ? 'btn-block' : ''}`}>
          {t('jobCard.applyNow')}
        </Link>
      </div>
    </div>
  )
}

export default JobCard
