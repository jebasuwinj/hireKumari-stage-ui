import Skeleton from './Skeleton.jsx'

function ListRowsSkeleton({ count = 4, withActions = true, compact = false }) {
  return (
    <div className="sk-list" aria-busy="true" aria-label="Loading list">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="sk-list__row">
          <Skeleton width={compact ? 40 : 44} height={compact ? 40 : 44} radius={12} />
          <Skeleton width={60} height={60} radius={8} />
          <div className="sk-list__main">
            <Skeleton width="55%" height={16} />
            <Skeleton width="40%" height={12} />
            <Skeleton width="35%" height={12} />
          </div>
          {withActions && (
            <div className="sk-list__actions">
              <Skeleton circle width={36} height={36} />
              <Skeleton circle width={36} height={36} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ListRowsSkeleton
