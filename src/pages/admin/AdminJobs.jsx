import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import PageState from '../../components/PageState.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { ListRowsSkeleton } from '../../components/skeletons'
import { useAuth } from '../../context/AuthContext.jsx'
import { useAsync } from '../../hooks/useAsync.js'
import { useFeedback } from '../../hooks/useFeedback.jsx'
import { deleteJob, listJobsForAdmin, listMyJobs, updateJobStatus, updateJobStatusAsAdmin } from '../../api/jobs.js'
import './AdminJobs.css'

const STATUS_COLORS = {
  active: '#1f9d55',
  draft: '#f2a12b',
  closed: '#6b7280',
}
const STATUS_LABEL = { active: 'Active', draft: 'Draft', closed: 'Closed' }

function CompanyJobs() {
  const { openPostJob, openEditJob } = useOutletContext()
  const [reloadKey, setReloadKey] = useState(0)
  const { data: jobs, loading, error } = useAsync(() => listMyJobs().then((r) => r.data), [reloadKey])
  const reload = () => setReloadKey((k) => k + 1)
  const { toastSuccess, toastError, confirmAction } = useFeedback()

  const handleDelete = (job) => {
    confirmAction({
      title: 'Delete this job posting?',
      description: `"${job.title}" will be permanently removed and no longer visible to job seekers. This cannot be undone.`,
      okText: 'Delete',
      danger: true,
      onConfirm: async () => {
        try {
          await deleteJob(job.id)
          toastSuccess('Job deleted', `"${job.title}" has been removed.`)
          reload()
        } catch (err) {
          toastError(err, 'Could not delete this job.')
          throw err
        }
      },
    })
  }

  const handleStatusChange = (job, status) => {
    const verb = status === 'active' ? (job.status === 'draft' ? 'Publish' : 'Reopen') : 'Close'
    confirmAction({
      title: `${verb} "${job.title}"?`,
      description:
        status === 'active'
          ? 'This job will become visible to job seekers on the public site.'
          : 'This job will be hidden from job seekers until you reopen it.',
      okText: verb,
      danger: status === 'closed',
      onConfirm: async () => {
        try {
          await updateJobStatus(job.id, status)
          toastSuccess('Job status updated', `"${job.title}" is now ${STATUS_LABEL[status].toLowerCase()}.`)
          reload()
        } catch (err) {
          toastError(err, 'Could not update job status.')
          throw err
        }
      },
    })
  }

  const list = jobs ?? []

  return (
    <div className="admin-jobs">
      <div className="admin-page-head">
        <div>
          <h1>My Job Postings</h1>
          <p>{list.length} job{list.length === 1 ? '' : 's'} posted by your company</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => openPostJob(reload)}>+ Post a New Job</button>
      </div>

      <PageState
        loading={loading}
        error={error}
        skeleton={<ListRowsSkeleton count={5} />}
      >
        {list.length > 0 ? (
          <div className="admin-jobs-list">
            {list.map((j) => (
              <div key={j.id} className="admin-job-card">
                <div className="admin-job-card__main">
                  <div className="admin-job-card__title">
                    <strong>{j.title}</strong>
                    <span className="tag" style={{ background: `${STATUS_COLORS[j.status]}1f`, color: STATUS_COLORS[j.status] }}>
                      {STATUS_LABEL[j.status]}
                    </span>
                  </div>
                  <p>📍 {j.taluk} &nbsp;•&nbsp; {j.type} &nbsp;•&nbsp; Posted {j.postedDays === 1 ? '1 day ago' : j.postedDays === 0 ? 'Today' : `${j.postedDays} days ago`}</p>
                </div>

                <div className="admin-job-card__stats">
                  <div>
                    <strong>{j.vacancies}</strong>
                    <small>Vacancies</small>
                  </div>
                  <div>
                    <strong>{j.applicantsCount}</strong>
                    <small>Applicants</small>
                  </div>
                  <div>
                    <strong>{j.placedCount}</strong>
                    <small>Placed</small>
                  </div>
                </div>

                <div className="admin-job-card__actions">
                  <Link to={`/admin/applications?jobId=${j.id}`} className="btn btn-outline btn-sm">View Applicants</Link>
                  {j.status === 'draft' && (
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => handleStatusChange(j, 'active')}>Publish</button>
                  )}
                  {j.status === 'active' && (
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => handleStatusChange(j, 'closed')}>Close</button>
                  )}
                  {j.status === 'closed' && (
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => handleStatusChange(j, 'active')}>Reopen</button>
                  )}
                  <button type="button" className="admin-job-card__edit" onClick={() => openEditJob(j, reload)} aria-label={`Edit ${j.title}`}>
                    ✏️
                  </button>
                  <button type="button" className="admin-job-card__delete" onClick={() => handleDelete(j)} aria-label={`Delete ${j.title}`}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="💼"
            title="You haven't posted any jobs yet"
            description="Post your first job to start reaching job seekers across the district."
            action={<button type="button" className="btn btn-primary" onClick={() => openPostJob(reload)}>+ Post Your First Job</button>}
          />
        )}
      </PageState>
    </div>
  )
}

function SuperAdminJobs() {
  const [reloadKey, setReloadKey] = useState(0)
  const { data, loading, error } = useAsync(
    () => listJobsForAdmin({ page: 1, limit: 100 }).then((r) => r.data),
    [reloadKey],
  )
  const reload = () => setReloadKey((k) => k + 1)
  const list = data ?? []
  const { toastSuccess, toastError, confirmAction } = useFeedback()

  const handleStatusChange = (job, status) => {
    const verb = status === 'active' ? 'Reopen' : 'Close'
    confirmAction({
      title: `${verb} "${job.title}"?`,
      description:
        status === 'active'
          ? 'This job will become visible to job seekers again.'
          : 'This job will be hidden from job seekers on the public site.',
      okText: verb,
      danger: status === 'closed',
      onConfirm: async () => {
        try {
          await updateJobStatusAsAdmin(job.id, status)
          toastSuccess('Job status updated', `"${job.title}" is now ${STATUS_LABEL[status].toLowerCase()}.`)
          reload()
        } catch (err) {
          toastError(err, 'Could not update job status.')
          throw err
        }
      },
    })
  }

  return (
    <div className="admin-jobs">
      <div className="admin-page-head">
        <div>
          <h1>All Job Postings</h1>
          <p>{list.length} job{list.length === 1 ? '' : 's'} across every registered company</p>
        </div>
      </div>

      <PageState
        loading={loading}
        error={error}
        skeleton={<ListRowsSkeleton count={5} />}
      >
        {list.length > 0 ? (
          <div className="admin-jobs-list">
            {list.map((j) => (
              <div key={j.id} className="admin-job-card">
                <div className="admin-job-card__main">
                  <div className="admin-job-card__title">
                    <strong>{j.title}</strong>
                    <span className="tag" style={{ background: `${STATUS_COLORS[j.status]}1f`, color: STATUS_COLORS[j.status] }}>
                      {STATUS_LABEL[j.status]}
                    </span>
                  </div>
                  <p>🏢 {j.companyName} &nbsp;•&nbsp; 📍 {j.taluk} &nbsp;•&nbsp; {j.type}</p>
                </div>

                <div className="admin-job-card__stats">
                  <div>
                    <strong>{j.vacancies}</strong>
                    <small>Vacancies</small>
                  </div>
                  <div>
                    <strong>{j.applicantsCount}</strong>
                    <small>Applicants</small>
                  </div>
                  <div>
                    <strong>{j.placedCount}</strong>
                    <small>Placed</small>
                  </div>
                </div>

                <div className="admin-job-card__actions">
                  {j.status !== 'closed' ? (
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => handleStatusChange(j, 'closed')}>Close</button>
                  ) : (
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => handleStatusChange(j, 'active')}>Reopen</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="💼"
            title="No jobs have been posted yet"
            description="Jobs posted by any registered company will show up here."
          />
        )}
      </PageState>
    </div>
  )
}

function AdminJobs() {
  const { role } = useAuth()
  return role === 'SUPER_ADMIN' ? <SuperAdminJobs /> : <CompanyJobs />
}

export default AdminJobs
