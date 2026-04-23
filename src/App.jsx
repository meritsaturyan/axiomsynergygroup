import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { translations } from './translations'

const publicUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const HydraModelViewer = lazy(() => import('./HydraModelViewer.jsx'))

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
            <p className="model-caption hydra-model-caption">{t.hydraModelCaption}</p>
            <Suspense
              fallback={
                <div className="hydra-model-viewer-wrap">
                  <div className="hydra-model-placeholder" aria-hidden />
                </div>
              }
            >
              <HydraModelViewer src={publicUrl('hydra-logic.glb')} alt={t.hydraModelAlt} />
            </Suspense>
            <p className="section-text hydra-section-text">{t.hydraText}</p>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="section-inner narrow">
            <h2 className="section-title">{t.contactTitle}</h2>
            <p className="section-text">{t.contactText}</p>
            <p className="contact-placeholder">
              <span className="muted">{t.emailLabel}:</span>{' '}
              <a href="mailto:info@axiomsynergy.example">info@axiomsynergy.example</a>
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <img src={publicUrl('axiomlogo.PNG')} alt="" className="footer-logo" />
        <p className="footer-copy">{t.footerRights}</p>
      </footer>
    </div>
  )
}

export default App
