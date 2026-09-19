import Skeleton from './Skeleton.jsx'

function TableSkeleton({ rows = 6, compact = false }) {
  return (
    <div className={`sk-table ${compact ? 'sk-table--compact' : ''}`} aria-busy="true" aria-label="Loading table">
      <div className="sk-table__head">
        <Skeleton width="50%" height={12} />
        <Skeleton width="55%" height={12} />
        <Skeleton width="45%" height={12} />
        <Skeleton width="40%" height={12} />
        {!compact && <Skeleton width="50%" height={12} />}
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="sk-table__row">
          <Skeleton width="75%" height={14} />
          <Skeleton width="70%" height={14} />
          <Skeleton width="50%" height={14} />
          <Skeleton width={64} height={22} radius={999} />
          {!compact && <Skeleton width={88} height={30} radius={8} />}
        </div>
      ))}
    </div>
  )
}

export default TableSkeleton
