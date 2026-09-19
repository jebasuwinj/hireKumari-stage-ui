import { Modal } from 'antd'
import StructuredText from './StructuredText.jsx'
import { jobFairStatusMeta } from '../utils/jobFairStatus.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import './JobFairDetailsModal.css'

/** Shared view-only modal for admin and public job fair details. */
function JobFairDetailsModal({ fair, open, onClose }) {
  const { t } = useLanguage()
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width="min(560px, 92vw)"
      title={fair?.title}
      destroyOnHidden
    >
      {fair && (
        <div className="fair-details">
          <p className="fair-details__row">
            <span
              className="tag"
              style={{ background: `${jobFairStatusMeta(fair.status).color}1f`, color: jobFairStatusMeta(fair.status).color }}
            >
              {t(jobFairStatusMeta(fair.status).labelKey)}
            </span>
          </p>
          <p className="fair-details__row">
            <span aria-hidden="true">📅</span>
            <span>{fair.month} {fair.day}</span>
          </p>
          <p className="fair-details__row">
            <span aria-hidden="true">📍</span>
            <span>{fair.venue}</span>
          </p>
          <p className="fair-details__row">
            <span aria-hidden="true">🕒</span>
            <span>{fair.time}</span>
          </p>
          {fair.description?.trim() && (
            <div className="fair-details__description">
              <span className="fair-details__description-label">{t('jobFairs.description')}</span>
              <StructuredText text={fair.description} />
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}

export default JobFairDetailsModal
