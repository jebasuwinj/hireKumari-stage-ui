import Skeleton from './Skeleton.jsx'

function CardGridSkeleton({ count = 4, columns, variant = 'job' }) {
  if (variant === 'sector') {
    return (
      <div className="sk-card-grid sk-card-grid--sectors" aria-busy="true" aria-label="Loading sectors">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="sk-sector-card">
            <Skeleton circle width={48} height={48} />
            <Skeleton width="70%" height={14} />
            <Skeleton width="40%" height={12} />
          </div>
        ))}
      </div>
    )
  }

  const gridClass = columns === 3 ? 'sk-card-grid sk-card-grid--3' : 'sk-card-grid'

  return (
    <div className={gridClass} aria-busy="true" aria-label="Loading cards">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="sk-card">
          <div className="sk-card__top">
            <Skeleton width={44} height={44} radius={10} />
            <Skeleton width={64} height={22} radius={999} />
          </div>
          <div className="sk-card__lines">
            <Skeleton width="85%" height={16} />
            <Skeleton width="55%" height={12} />
            <Skeleton width="70%" height={12} />
          </div>
          <Skeleton width="100%" height={36} radius={8} style={{ marginTop: 8 }} />
        </div>
      ))}
    </div>
  )
}

export default CardGridSkeleton
