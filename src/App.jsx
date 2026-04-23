import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { translations } from './translations'

const publicUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const HydraScene = lazy(() => import('./HydraScene.jsx'))
const ChatBot = lazy(() => import('./ChatBot.jsx'))

const SKETCHFAB_EMBED =
  'https://sketchfab.com/models/7d81ec464bf1455aacfc9a19bca9f297/embed?autostart=1&ui_controls=1&ui_inspector=0&ui_watermark=0&ui_watermark_link=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=1&ui_stop=0&scrollwheel=1&transparent=0&ui_animations=0&ui_hint=0&dnt=1&ui_header=0&ui_infos=0'

const LANG_KEY = 'axiom-lang'

function App() {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'hy'
    return localStorage.getItem(LANG_KEY) || 'hy'
  })
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang)
    document.documentElement.lang = lang === 'hy' ? 'hy' : 'en'
  }, [lang])

  useEffect(() => {
    if (!menuOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const t = useMemo(() => translations[lang], [lang])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <button type="button" className="brand" onClick={() => scrollTo('hero')} aria-label="Home">
            <img src={publicUrl('axiomlogo.PNG')} alt="Axiom Synergy Group" className="brand-logo" />
          </button>
          <nav
            className={`nav ${menuOpen ? 'nav--open' : ''}`}
            id="site-nav"
            aria-label="Main"
          >
            <button type="button" className="nav-link" onClick={() => scrollTo('about')}>
              {t.navAbout}
            </button>
            <button type="button" className="nav-link" onClick={() => scrollTo('workshop')}>
              {t.navWorkshop}
            </button>
            <button type="button" className="nav-link" onClick={() => scrollTo('solar')}>
              {t.navSolar}
            </button>
            <button type="button" className="nav-link" onClick={() => scrollTo('hydra')}>
              {t.navHydra}
            </button>
            <button type="button" className="nav-link" onClick={() => scrollTo('contact')}>
              {t.navContact}
            </button>
          </nav>
          <div className="header-trailing">
            <div className="lang" role="group" aria-label="Language">
              <button
                type="button"
                className={`lang-btn ${lang === 'hy' ? 'active' : ''}`}
                onClick={() => setLang('hy')}
              >
                {t.langHy}
              </button>
              <span className="lang-sep" aria-hidden>
                |
              </span>
              <button
                type="button"
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >
                {t.langEn}
              </button>
            </div>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="site-nav"
              aria-label={menuOpen ? t.menuClose : t.menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className={`menu-icon ${menuOpen ? 'menu-icon--open' : ''}`} aria-hidden>
                <span className="menu-icon-bar" />
                <span className="menu-icon-bar" />
                <span className="menu-icon-bar" />
              </span>
            </button>
          </div>
        </div>
        <button
          type="button"
          className={`nav-backdrop ${menuOpen ? 'nav-backdrop--visible' : ''}`}
          aria-hidden={!menuOpen}
          onClick={() => setMenuOpen(false)}
        />
      </header>

      <main>
        <section id="hero" className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <h1 className="hero-title">{t.heroTitle}</h1>
              <p className="hero-subtitle">{t.heroSubtitle}</p>
            </div>
          </div>
        </section>

        <section id="about" className="section building-section">
          <div className="section-inner narrow">
            <h2 className="section-title building-title">{t.buildingTitle}</h2>
            <p className="building-address">{t.buildingAddress}</p>
            <figure className="building-figure">
              <img
                src={publicUrl('1776184211349.png')}
                alt={t.buildingImageAlt}
                className="building-img"
              />
            </figure>
            <p className="section-text building-text">{t.buildingFunctions}</p>
            <p className="section-text building-text">{t.buildingHq}</p>
          </div>
        </section>

        <section id="workshop" className="section section-alt">
          <div className="section-inner narrow">
            <h2 className="section-title">{t.workshopSalesTitle}</h2>
            <p className="section-text building-text">{t.workshopDirectSales}</p>
            <h3 className="section-subtitle">{t.workshopFacilityTitle}</h3>
            <p className="building-address">{t.workshopAddress}</p>
            <figure className="building-figure">
              <img
                src={publicUrl('1776184547037-2.png')}
                alt={t.workshopImageAlt}
                className="building-img"
              />
            </figure>
            <p className="section-text building-text">{t.workshopFunctions}</p>
            <p className="section-text building-text">{t.workshopShowroom}</p>
            <p className="section-text building-text">{t.workshopConsult}</p>
          </div>
        </section>

        <section id="solar" className="section solar-section">
          <div className="section-inner narrow">
            <h2 className="section-title">{t.solarTitle}</h2>
            <div className="model-wrap solar-model-wrap">
              <p className="model-caption">{t.modelCaption}</p>
              <div className="sketchfab-embed">
                <iframe
                  title="Solar Panel 3D — Sketchfab"
                  src={SKETCHFAB_EMBED}
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                  loading="lazy"
                />
                <div className="sketchfab-ui-mask" aria-hidden />
              </div>
              <p className="sketchfab-credit">
                <a
                  href="https://skfb.ly/6WW8t"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Solar Panel
                </a>
                {' — Sketchfab (shrednector)'}
              </p>
            </div>
            <p className="section-text solar-section-text">{t.solarText}</p>
          </div>
        </section>

        <section id="hydra" className="section section-alt">
          <div className="section-inner narrow">
            <h2 className="section-title">{t.hydraTitle}</h2>
            <div className="model-wrap">
              <p className="model-caption">{t.hydraModelCaption}</p>
              <div className="hydra-stage" aria-label={t.hydraModelAlt}>
                <Suspense fallback={<div className="hydra-stage__loader" aria-hidden />}>
                  <HydraScene src={publicUrl('hydra-logic.glb')} />
                </Suspense>
              </div>
            </div>
            <p className="section-text hydra-section-text">{t.hydraText}</p>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="section-inner narrow">
            <h2 className="section-title">{t.contactTitle}</h2>
            <p className="section-text">{t.contactText}</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <img src={publicUrl('axiomlogo.PNG')} alt="" className="footer-logo" />
        <ul className="footer-contacts" aria-label="Contacts">
          <li>
            <a
              href="mailto:axiomsynergygroup@gmail.com"
              className="footer-contact"
              aria-label="Email"
            >
              <svg
                className="footer-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <span>axiomsynergygroup@gmail.com</span>
            </a>
          </li>
          <li>
            <a
              href="tel:+37477684594"
              className="footer-contact"
              aria-label="Phone"
            >
              <svg
                className="footer-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+374 77 684 594</span>
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/axiom_synergy"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-contact"
              aria-label="Instagram"
            >
              <svg
                className="footer-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              <span>@axiom_synergy</span>
            </a>
          </li>
        </ul>
        <p className="footer-copy">{t.footerRights}</p>
      </footer>

      <Suspense fallback={null}>
        <ChatBot t={t} lang={lang} />
      </Suspense>
    </div>
  )
}

export default App
