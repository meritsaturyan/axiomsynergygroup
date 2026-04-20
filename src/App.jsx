import { useEffect, useMemo, useState } from 'react'
import { translations } from './translations'

const SKETCHFAB_EMBED =
  'https://sketchfab.com/models/7d81ec464bf1455aacfc9a19bca9f297/embed?autostart=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_watermark=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=1&ui_stop=0&scrollwheel=1&transparent=0&ui_animations=0&ui_hint=0&dnt=1'

const LANG_KEY = 'axiom-lang'

function App() {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'hy'
    return localStorage.getItem(LANG_KEY) || 'hy'
  })

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang)
    document.documentElement.lang = lang === 'hy' ? 'hy' : 'en'
  }, [lang])

  const t = useMemo(() => translations[lang], [lang])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <button type="button" className="brand" onClick={() => scrollTo('hero')} aria-label="Home">
            <img src="/axiomlogo.PNG" alt="Axiom Synergy Group" className="brand-logo" />
          </button>
          <nav className="nav" aria-label="Main">
            <button type="button" className="nav-link" onClick={() => scrollTo('about')}>
              {t.navAbout}
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
        </div>
      </header>

      <main>
        <section id="hero" className="hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <h1 className="hero-title">{t.heroTitle}</h1>
              <p className="hero-subtitle">{t.heroSubtitle}</p>
            </div>
            <div className="model-wrap">
              <p className="model-caption">{t.modelCaption}</p>
              <div className="sketchfab-embed">
                <iframe
                  title="Solar Panel 3D — Sketchfab"
                  src={SKETCHFAB_EMBED}
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                  loading="lazy"
                />
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
          </div>
        </section>

        <section id="about" className="section building-section">
          <div className="section-inner">
            <figure className="building-figure">
              <img src="/axiomshenq.PNG" alt="" className="building-img" />
              <figcaption className="building-caption">{t.buildingCaption}</figcaption>
            </figure>
          </div>
        </section>

        <section id="solar" className="section">
          <div className="section-inner narrow">
            <h2 className="section-title">{t.solarTitle}</h2>
            <p className="section-text">{t.solarText}</p>
          </div>
        </section>

        <section id="hydra" className="section section-alt">
          <div className="section-inner narrow">
            <h2 className="section-title">{t.hydraTitle}</h2>
            <p className="section-text">{t.hydraText}</p>
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
        <img src="/axiomlogo.PNG" alt="" className="footer-logo" />
        <p className="footer-copy">{t.footerRights}</p>
      </footer>
    </div>
  )
}

export default App
