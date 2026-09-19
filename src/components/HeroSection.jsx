import kkImage from '../assets/kkImage.jpg'
import { useLanguage } from '../context/LanguageContext.jsx'
import './HeroSection.css'

function HeroSection() {
  const { t } = useLanguage()
  return (
    <section className="hero">
      <div className="hero__bg">
        <img
          src={kkImage}
          alt="Sunset over the Vivekananda Rock Memorial and Thiruvalluvar Statue, Kanniyakumari"
          className="hero__bg-photo"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
        />
        <div className="hero__bg-overlay" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <span className="hero__eyebrow">{t('hero.eyebrow')}</span>
          <h1>
            {t('hero.titleLine1')} <br />
            <span>{t('hero.titleLine2')}</span>
          </h1>
          <p className="hero__subtext">
            {t('hero.subtext')}
          </p>
        </div>

        {/* <div className="hero__visual">
          <p className="hero__handwritten">
            <span className="hero__handwritten-word">Explore</span>
            <span className="hero__handwritten-place">Kanniyakumari</span>
            <small>Where Opportunities Meet a Better Life</small>
          </p>
        </div> */}
      </div>
    </section>
  )
}

export default HeroSection
