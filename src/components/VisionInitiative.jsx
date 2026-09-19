import visionPhoto from '../assets/visionBanner.png'
import { useLanguage } from '../context/LanguageContext.jsx'
import './VisionInitiative.css'

function VisionInitiative() {
  const { t } = useLanguage()
  return (
    <section className="section vision-initiative">
      <div className="container">
        <div className="vision-initiative__card">
          <div className="vision-initiative__content">
            <h2>{t('vision.title')}</h2>
            <p className="vision-initiative__tagline">{t('vision.tagline')}</p>
            <p className="vision-initiative__body">
              {t('vision.body')}
            </p>
          </div>
          <div className="vision-initiative__media">
            <img
              src={visionPhoto}
              alt="Professionals meeting about local employment opportunities in Kanniyakumari"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default VisionInitiative
