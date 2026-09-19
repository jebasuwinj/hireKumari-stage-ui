import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import JobCard from '../components/JobCard'
import ApplyJobModal from '../components/ApplyJobModal'
import PageState from '../components/PageState.jsx'
import { DetailSkeleton } from '../components/skeletons'
import { useAsync } from '../hooks/useAsync.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { getJob } from '../api/jobs.js'
import './JobDetails.css'

function JobDetails() {
  const { slug } = useParams()
  const [applyOpen, setApplyOpen] = useState(false)
  const { t } = useLanguage()

  const { data: job, loading, error } = useAsync(() => getJob(slug).then((r) => r.data), [slug])

  return (
    <PageState
      loading={loading}
      error={error && error.status !== 404 ? error : null}
      skeleton={
        <div className="section container">
          <DetailSkeleton />
        </div>
      }
    >
      {!job || error?.status === 404 ? (
        <div className="section container empty-state">
          <p>{t('jobDetails.notFound')}</p>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop: 16 }}>{t('jobDetails.backToJobs')}</Link>
        </div>
      ) : (
        <>
          <div className="page-hero job-details-hero">
            <div className="container job-details-hero__inner">
              <span className="job-details-hero__logo" style={{ background: 'rgba(255,255,255,0.18)' }}>
                {job.logoUrl ? <img src={job.logoUrl} alt={job.company?.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : job.logo}
              </span>
              <div>
                <h1>{job.title}</h1>
                <p>{job.company?.name} &bull; {job.location}</p>
              </div>
            </div>
          </div>

          <section className="section">
            <div className="container job-details-layout">
              <div className="job-details-main">
                <div className="card job-details-card">
                  <ul className="job-details-facts">
                    <li><span>{t('jobDetails.salary')}</span><strong>{job.salary}</strong></li>
                    <li><span>{t('jobDetails.qualification')}</span><strong>{job.qualification || t('jobDetails.notSpecified')}</strong></li>
                    <li><span>{t('jobDetails.vacancies')}</span><strong>{job.vacancies}</strong></li>
                    <li><span>{t('jobDetails.jobType')}</span><strong>{job.type}</strong></li>
                    <li><span>{t('jobDetails.sector')}</span><strong>{job.sector}</strong></li>
                    <li><span>{t('jobDetails.posted')}</span><strong>{job.posted}</strong></li>
                  </ul>
                </div>

                <div className="card job-details-card">
                  <h2>{t('jobDetails.jobDescription')}</h2>
                  <p className="job-details-description">{job.description}</p>
                </div>

                {job.responsibilities?.length > 0 && (
                  <div className="card job-details-card">
                    <h2>{t('jobDetails.keyResponsibilities')}</h2>
                    <ul className="job-details-list">
                      {job.responsibilities.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <aside className="job-details-side">
                <div className="card job-details-apply">
                  <h3>{t('jobDetails.interested')}</h3>
                  <p>{t('jobDetails.reviewedBy')} {job.company?.name}.</p>
                  <button type="button" className="btn btn-primary btn-block" onClick={() => setApplyOpen(true)}>
                    {t('jobDetails.applyNow')}
                  </button>
                </div>

                <div className="card job-details-company">
                  <h3>{t('jobDetails.aboutEmployer')}</h3>
                  <p><strong>{job.company?.name}</strong></p>
                  <p>{job.companyAddress || job.location}</p>
                  <Link to="/employers" className="section-link">{t('jobDetails.viewCompanyProfile')}</Link>
                </div>
              </aside>
            </div>

            {job.relatedJobs?.length > 0 && (
              <div className="container job-details-related">
                <div className="section-head">
                  <h2>{t('jobDetails.similarJobs')}</h2>
                </div>
                <div className="job-grid">
                  {job.relatedJobs.map((j) => (
                    <JobCard key={j.id} job={j} />
                  ))}
                </div>
              </div>
            )}
          </section>

          <ApplyJobModal
            open={applyOpen}
            onClose={() => setApplyOpen(false)}
            job={{ id: job.id, title: job.title, company: job.company?.name, location: job.location }}
          />
        </>
      )}
    </PageState>
  )
}

export default JobDetails
