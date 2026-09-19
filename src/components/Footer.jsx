import { Link } from 'react-router-dom'
import { CodeOutlined } from '@ant-design/icons'
import { useLanguage } from '../context/LanguageContext.jsx'
import hireKumariLogoWhite from '../assets/hireKumariLogoWhite.png'
import './Footer.css'

const QUICK_LINKS = [
  { to: '/', key: 'nav.home' },
  { to: '/jobs', key: 'nav.jobs' },
  { to: '/employers', key: 'nav.employers' },
  { to: '/job-fairs', key: 'nav.jobFairs' },
]

const SUPPORT_LINKS = [
  { to: '/contact', key: 'footer.contactUs' },
  { to: '/help', key: 'footer.helpCentre' },
  { to: '/faqs', key: 'footer.faqs' },
]

const LEGAL_LINKS = [
  { to: '/terms', key: 'footer.termsOfUse' },
  { to: '/privacy', key: 'footer.privacyPolicy' },
]

function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="container site-footer__grid">
          <div className="site-footer__brand">
            <div className="site-footer__logo">
              <img src={hireKumariLogoWhite} alt="Hire Kumari" className="site-footer__logo-image" />
            </div>
          </div>

          <div className="site-footer__col site-footer__col--about">
            <h4>{t('footer.districtInitiative')}</h4>
            <ul className="site-footer__slogan">
              <li>{t('footer.strongerPeople')}</li>
              <li>{t('footer.strongerDistrict')}</li>
              <li>{t('footer.brighterFuture')}</li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h4>{t('footer.quickLinks')}</h4>
            <ul>
              {QUICK_LINKS.map((l) => (
                <li key={l.to}><Link to={l.to}>{t(l.key)}</Link></li>
              ))}
            </ul>
          </div>

          <div className="site-footer__col">
            <h4>{t('footer.support')}</h4>
            <ul>
              {SUPPORT_LINKS.map((l) => (
                <li key={l.to}><Link to={l.to}>{t(l.key)}</Link></li>
              ))}
            </ul>
          </div>

          <div className="site-footer__col">
            <h4>{t('footer.legal')}</h4>
            <ul>
              {LEGAL_LINKS.map((l) => (
                <li key={l.to}><Link to={l.to}>{t(l.key)}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* <div className="site-footer__decor" aria-hidden="true">
          <p className="site-footer__handwritten">
            Together for<br />a Brighter Tomorrow
          </p>
          <p className="site-footer__caption">
            Kanniyakumari
            <small>A Land of Opportunities</small>
          </p>
        </div> */}
      </div>

      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <span>{t('footer.copyright')}</span>
          <a
            href="https://aloinfotech.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer__credit"
          >
            <CodeOutlined /> {t('footer.credit')}
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
