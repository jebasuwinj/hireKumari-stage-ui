import Skeleton from './Skeleton.jsx'

function StatsSkeleton({ count = 4, admin = false }) {
  return (
    <div className={`sk-stats ${admin ? 'sk-stats--admin' : ''}`} aria-busy="true" aria-label="Loading statistics">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="sk-stats__card">
          <Skeleton circle width={46} height={46} />
          <div className="sk-stats__text">
            <Skeleton width="40%" height={22} />
            <Skeleton width="70%" height={12} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsSkeleton
