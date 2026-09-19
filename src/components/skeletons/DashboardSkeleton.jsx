import Skeleton from './Skeleton.jsx'
import StatsSkeleton from './StatsSkeleton.jsx'

function ChartBlockSkeleton({ wide = false }) {
  return (
    <div className={`sk-chart-card ${wide ? 'sk-chart-card--wide' : ''}`}>
      <div className="sk-chart-card__head">
        <Skeleton width="40%" height={16} />
        <Skeleton width="55%" height={12} />
      </div>
      <Skeleton width="100%" height={wide ? 180 : 160} radius={12} style={{ flex: 1 }} />
    </div>
  )
}

function DashboardSkeleton({ statsCount = 7, withPanels = false }) {
  return (
    <div className="sk-dashboard" aria-busy="true" aria-label="Loading dashboard">
      <StatsSkeleton count={statsCount} admin />
      <div className="sk-charts">
        <ChartBlockSkeleton wide />
        <ChartBlockSkeleton />
        <ChartBlockSkeleton />
        {!withPanels && <ChartBlockSkeleton wide />}
      </div>
      {withPanels && (
        <div className="sk-dashboard__panels">
          {[0, 1].map((panel) => (
            <div key={panel} className="sk-panel">
              <Skeleton width="45%" height={16} />
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="sk-panel__row">
                  <Skeleton circle width={36} height={36} />
                  <div className="sk-panel__main">
                    <Skeleton width="60%" height={14} />
                    <Skeleton width="40%" height={11} />
                  </div>
                  <Skeleton width={56} height={22} radius={999} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { ChartBlockSkeleton }
export default DashboardSkeleton
