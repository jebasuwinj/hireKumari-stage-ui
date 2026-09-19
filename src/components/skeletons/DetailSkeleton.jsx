import Skeleton from './Skeleton.jsx'

function DetailSkeleton({ form = false }) {
  if (form) {
    return (
      <div className="sk-detail" aria-busy="true" aria-label="Loading form">
        <div className="sk-detail__block">
          <Skeleton width={120} height={120} radius={16} />
          <div className="sk-detail__form" style={{ marginTop: 16 }}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={`sk-detail__field ${i >= 4 ? 'sk-detail__field--full' : ''}`}>
                <Skeleton width="30%" height={12} />
                <Skeleton width="100%" height={40} radius={8} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sk-detail" aria-busy="true" aria-label="Loading details">
      <div className="sk-detail__hero">
        <Skeleton width="45%" height={28} />
        <Skeleton width="30%" height={14} />
        <Skeleton width="55%" height={14} />
      </div>
      <div className="sk-detail__facts">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="sk-detail__fact">
            <Skeleton width="40%" height={12} />
            <Skeleton width="70%" height={18} />
          </div>
        ))}
      </div>
      <div className="sk-detail__block">
        <Skeleton width="25%" height={16} />
        <Skeleton width="100%" height={12} />
        <Skeleton width="95%" height={12} />
        <Skeleton width="88%" height={12} />
        <Skeleton width="70%" height={12} />
      </div>
    </div>
  )
}

export default DetailSkeleton
