import { Link, useOutletContext } from 'react-router-dom'
import { Area, Bar, Line, Pie } from '@ant-design/plots'
import PageState from '../../components/PageState.jsx'
import ChartCard from '../../components/ChartCard.jsx'
import { DashboardSkeleton } from '../../components/skeletons'
import { useAuth } from '../../context/AuthContext.jsx'
import { useAsync } from '../../hooks/useAsync.js'
import { timeAgo } from '../../utils/format.js'
import { getMyDashboard } from '../../api/companies.js'
import { getDashboard as getAdminDashboard } from '../../api/admin.js'
import './AdminDashboard.css'

const STATUS_COLORS = {
  new: '#0454c2',
  placed: '#0b6b3a',
}

const STATUS_LABELS = {
  new: 'New',
  placed: 'Placed',
}

const ACTIVE_STATUSES = ['new', 'placed']

/** Last-30-days charts: show MM-DD labels every other day to avoid crowding. */
const timeSeriesXAxis = {
  labelFormatter: (v) => String(v).slice(5),
  tickFilter: (_datum, index) => index % 2 === 0,
  labelAutoRotate: false,
  labelAutoHide: true,
}

const chartAxis = {
  x: { title: false, labelAutoRotate: false, labelAutoHide: true },
  y: { title: false, labelAutoRotate: false },
}

function statusPieConfig(byStatus) {
  const data = byStatus
    .filter((s) => ACTIVE_STATUSES.includes(s.status) && s.count > 0)
    .map((s) => ({
      status: STATUS_LABELS[s.status] ?? s.status,
      count: s.count,
      key: s.status,
    }))

  return {
    data,
    angleField: 'count',
    colorField: 'status',
    innerRadius: 0.62,
    height: 220,
    autoFit: true,
    label: false,
    legend: false,
    scale: {
      color: { range: data.map((d) => STATUS_COLORS[d.key] ?? '#6b7280') },
    },
    tooltip: {
      title: (d) => d.status,
      items: [{ field: 'count', name: 'Applications' }],
    },
    interaction: { elementHighlight: false },
  }
}

function StatusPieChart({ byStatus }) {
  const config = statusPieConfig(byStatus)
  if (!config.data.length) {
    return <p className="admin-table__empty">No applications yet.</p>
  }

  return (
    <div className="status-pie">
      <Pie {...config} />
      <ul className="status-pie__legend">
        {config.data.map((d) => (
          <li key={d.key}>
            <span className="status-pie__swatch" style={{ background: STATUS_COLORS[d.key] }} />
            <span className="status-pie__name">{d.status}</span>
            <span className="status-pie__count">{d.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function horizontalBarHeight(rows, rowPx = 42, min = 220) {
  return Math.max(min, (rows?.length || 0) * rowPx + 48)
}

function CompanyDashboard() {
  const { openPostJob } = useOutletContext()
  const { data, loading, error } = useAsync(() => getMyDashboard().then((r) => r.data), [])

  const tiles = data
    ? [
        { id: 'active-jobs', label: 'Active Job Postings', value: data.stats.activeJobPostings, icon: 'briefcase', color: '#0b6b3a' },
        { id: 'applications', label: 'Total Applications', value: data.stats.totalApplications, icon: 'docs', color: '#0454c2' },
        { id: 'profile-views', label: 'Profile Views', value: data.stats.profileViews, icon: 'eye', color: '#c47a12' },
        { id: 'vacancies', label: 'Open Vacancies', value: data.stats.openVacancies, icon: 'slots', color: '#6d3bb8' },
      ]
    : []

  return (
    <div className="admin-dashboard">
      <div className="admin-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Here&apos;s what&apos;s happening with your job postings today.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => openPostJob()}>+ Post a New Job</button>
      </div>

      <PageState
        loading={loading}
        error={error}
        skeleton={<DashboardSkeleton statsCount={4} withPanels />}
      >
        <div className="admin-stats-grid">
          {tiles.map((s) => (
            <div key={s.id} className="admin-stat-card" style={{ '--stat-color': s.color }}>
              <span className={`admin-stat-card__icon admin-stat-card__icon--${s.icon}`} aria-hidden="true" />
              <span>
                <strong>{s.value}</strong>
                <small>{s.label}</small>
              </span>
            </div>
          ))}
        </div>

        {data && (
          <div className="charts-grid">
            <ChartCard title="Applications, Last 30 Days" subtitle="Daily applications received across all your jobs" span={2}>
              <Area
                data={data.charts.applicationsOverTime}
                xField="date"
                yField="applications"
                height={260}
                smooth
                style={{ fill: 'linear-gradient(-90deg, rgba(4,84,194,0.04) 0%, rgba(4,84,194,0.32) 100%)' }}
                line={{ style: { stroke: '#0454c2', lineWidth: 2.5 } }}
                axis={{ x: timeSeriesXAxis, y: { title: false, grid: true } }}
              />
            </ChartCard>

            <ChartCard title="Applications by Status" subtitle="New applications vs candidates placed">
              <StatusPieChart byStatus={data.charts.applicationsByStatus} />
            </ChartCard>

            <ChartCard title="Applicants per Job" subtitle="Which of your postings are attracting candidates">
              {data.charts.applicantsPerJob.length > 0 ? (
                <Bar
                  data={data.charts.applicantsPerJob}
                  xField="title"
                  yField="count"
                  height={horizontalBarHeight(data.charts.applicantsPerJob)}
                  style={{ fill: '#0454c2', radius: 6 }}
                  axis={{
                    ...chartAxis,
                    x: {
                      ...chartAxis.x,
                      labelFormatter: (v) => (String(v).length > 22 ? `${String(v).slice(0, 22)}…` : v),
                    },
                  }}
                  tooltip={{ items: [{ field: 'count', name: 'Applicants' }] }}
                />
              ) : (
                <p className="admin-table__empty">Post a job to see applicant comparisons here.</p>
              )}
            </ChartCard>
          </div>
        )}

        <div className="admin-dashboard__grid">
          <div className="admin-panel">
            <div className="admin-panel__head">
              <h2>Recent Applications</h2>
              <Link to="/admin/applications" className="section-link">View All →</Link>
            </div>
            <div className="admin-table">
              {data?.recentApplications.length ? (
                data.recentApplications.map((a) => (
                  <div key={a.id} className="admin-table__row">
                    <span className="admin-table__avatar" aria-hidden="true">{a.name.charAt(0)}</span>
                    <span className="admin-table__main">
                      <strong>{a.name}</strong>
                      <small>{a.jobTitle}</small>
                    </span>
                    <span className="admin-table__meta">{timeAgo(a.createdAt)}</span>
                    <span
                      className="tag"
                      style={{
                        background: `${STATUS_COLORS[a.status] ?? '#6b7280'}1f`,
                        color: STATUS_COLORS[a.status] ?? '#6b7280',
                      }}
                    >
                      {STATUS_LABELS[a.status] ?? a.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="admin-table__empty">No applications yet.</p>
              )}
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel__head">
              <h2>Active Job Postings</h2>
              <Link to="/admin/jobs" className="section-link">View All →</Link>
            </div>
            <div className="admin-table">
              {data?.activeJobs.length ? (
                data.activeJobs.map((j) => (
                  <div key={j.id} className="admin-table__row">
                    <span className="admin-table__main">
                      <strong>{j.title}</strong>
                      <small>{j.taluk}</small>
                    </span>
                    <span className="admin-table__meta">{j.applicantsCount} applicants</span>
                    <span className="tag tag--muted">{j.vacancies} openings</span>
                  </div>
                ))
              ) : (
                <p className="admin-table__empty">No active jobs yet.</p>
              )}
            </div>
          </div>
        </div>
      </PageState>
    </div>
  )
}

function SuperAdminDashboard() {
  const { data, loading, error } = useAsync(() => getAdminDashboard().then((r) => r.data), [])

  const tiles = data
    ? [
        { id: 'companies', label: 'Active Companies', value: data.companies, icon: 'building', color: '#0b6b3a', to: '/admin/companies' },
        { id: 'active-jobs', label: 'Active Jobs', value: data.activeJobs, icon: 'briefcase', color: '#0454c2', to: '/admin/jobs' },
        { id: 'total-jobs', label: 'Total Jobs Posted', value: data.totalJobs, icon: 'clipboard', color: '#c47a12', to: '/admin/jobs' },
        { id: 'applications', label: 'Total Applications', value: data.totalApplications, icon: 'docs', color: '#6d3bb8' },
        { id: 'placed', label: 'Candidates Placed', value: data.placedApplications, icon: 'check', color: '#1f9d55' },
        { id: 'job-fairs', label: 'Upcoming Job Fairs', value: data.upcomingJobFairs, icon: 'calendar', color: '#c45c28', to: '/admin/job-fairs' },
        { id: 'messages', label: 'New Contact Messages', value: data.newContactMessages, icon: 'mail', color: '#c0392b', to: '/admin/messages' },
      ]
    : []

  const growthLong = data
    ? data.charts.growth.flatMap((d) => [
        { date: d.date, type: 'Companies', value: d.companies },
        { date: d.date, type: 'Jobs', value: d.jobs },
      ])
    : []

  return (
    <div className="admin-dashboard">
      <div className="admin-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Portal-wide overview for the Kanniyakumari District Job Portal.</p>
        </div>
      </div>

      <PageState
        loading={loading}
        error={error}
        skeleton={<DashboardSkeleton statsCount={7} />}
      >
        <div className="admin-stats-grid admin-stats-grid--wide">
          {tiles.map((s) => {
            const Tile = (
              <div className="admin-stat-card" style={{ '--stat-color': s.color }}>
                <span className={`admin-stat-card__icon admin-stat-card__icon--${s.icon}`} aria-hidden="true" />
                <span>
                  <strong>{s.value}</strong>
                  <small>{s.label}</small>
                </span>
              </div>
            )
            return s.to ? (
              <Link key={s.id} to={s.to} className="admin-stat-card__link">
                {Tile}
              </Link>
            ) : (
              <div key={s.id}>{Tile}</div>
            )
          })}
        </div>

        {data && (
          <div className="charts-grid">
            <ChartCard title="Portal Growth, Last 30 Days" subtitle="New companies registered and jobs posted per day" span={2}>
              <Line
                data={growthLong}
                xField="date"
                yField="value"
                colorField="type"
                height={280}
                style={{ lineWidth: 2.5 }}
                scale={{ color: { range: ['#0b6b3a', '#0454c2'] } }}
                legend={{ color: { position: 'top', layout: { justifyContent: 'flex-end' } } }}
                axis={{
                  x: timeSeriesXAxis,
                  y: { title: false, grid: true },
                }}
              />
            </ChartCard>

            <ChartCard title="Applications by Status" subtitle="New applications vs candidates placed">
              <StatusPieChart byStatus={data.charts.applicationsByStatus} />
            </ChartCard>

            <ChartCard title="Jobs by Sector" subtitle="Active and past postings per category">
              {data.charts.jobsBySector.length > 0 ? (
                <Bar
                  data={data.charts.jobsBySector}
                  xField="name"
                  yField="count"
                  height={horizontalBarHeight(data.charts.jobsBySector)}
                  colorField="name"
                  legend={false}
                  scale={{
                    color: {
                      range: data.charts.jobsBySector.map((d) => d.color ?? '#0454c2'),
                    },
                  }}
                  style={{ radius: 6 }}
                  axis={chartAxis}
                  tooltip={{ items: [{ field: 'count', name: 'Jobs' }] }}
                />
              ) : (
                <p className="admin-table__empty">No jobs posted yet.</p>
              )}
            </ChartCard>

            <ChartCard title="Top Companies" subtitle="Ranked by applications received" span={2}>
              {data.charts.topCompanies.length > 0 ? (
                <Bar
                  data={data.charts.topCompanies}
                  xField="name"
                  yField="count"
                  height={horizontalBarHeight(data.charts.topCompanies, 48, 240)}
                  style={{ fill: 'linear-gradient(90deg, #6d3bb8 0%, #9b6fd4 100%)', radius: 6 }}
                  axis={{
                    ...chartAxis,
                    x: {
                      ...chartAxis.x,
                      labelFormatter: (v) => (String(v).length > 28 ? `${String(v).slice(0, 28)}…` : v),
                    },
                  }}
                  tooltip={{ items: [{ field: 'count', name: 'Applications' }] }}
                />
              ) : (
                <p className="admin-table__empty">No applications yet.</p>
              )}
            </ChartCard>
          </div>
        )}
      </PageState>
    </div>
  )
}

function AdminDashboard() {
  const { role } = useAuth()
  return role === 'SUPER_ADMIN' ? <SuperAdminDashboard /> : <CompanyDashboard />
}

export default AdminDashboard
