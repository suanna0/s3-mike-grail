import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import OptimizedImage from './OptimizedImage'
import './Site.css'

const LABEL_COLS = [
  ['KAPITAL (3)', 'GENTLE MONSTER', 'COMME DES GARCONS', 'NEEDLES'],
  ['KAPITAL (3)', 'GENTLE MONSTER', 'COMME DES GARCONS', 'NEEDLES'],
  ['KAPITAL (3)', 'GENTLE MONSTER', 'COMME DES GARCONS', 'NEEDLES'],
  ['KAPITAL (3)', 'GENTLE MONSTER', 'COMME DES GARCONS', 'NEEDLES'],
]

// Placeholder product images — swap in real srcs when available
const PRODUCT_IMAGES = [
  { src: null, alt: 'Look 1', label: 'Look 1' },
  { src: null, alt: 'Look 2', label: 'Look 2' },
  { src: null, alt: 'Look 3', label: 'Look 3' },
  { src: null, alt: 'Look 4', label: 'Look 4' },
  { src: null, alt: 'Look 5', label: 'Look 5' },
  { src: null, alt: 'Look 6', label: 'Look 6' },
]

function Site() {
  const aboutRef = useRef(null)
  const aboutLabelRef = useRef(null)
  const labelsRef = useRef(null)

  useEffect(() => {
    const btn = aboutRef.current
    const label = aboutLabelRef.current
    const labels = labelsRef.current

    const labelsHeight = labels.offsetHeight

    function onEnter() {
      const size = labels.children[0].offsetWidth
      // Phase 1: fade labels out (keep height so header stays at labels height)
      gsap.to(labels, { opacity: 0, duration: 0.25, ease: 'none' })
      // Phase 2: collapse labels height + expand rectangle simultaneously
      gsap.to(labels, { height: 0, duration: 0.25, delay: 0.25, ease: 'none' })
      gsap.to(btn, { width: size, height: size, duration: 0.25, delay: 0.25, ease: 'none' })
      gsap.to(label, { opacity: 0, duration: 0.25, delay: 0.25, ease: 'none' })
    }

    function onLeave() {
      // Phase 1: shrink rectangle + restore labels height simultaneously
      gsap.to(btn, { width: 28, height: 28, duration: 0.25, ease: 'none' })
      gsap.to(labels, { height: labelsHeight, duration: 0.25, ease: 'none' })
      // Phase 2: fade labels back in
      gsap.to(label, { opacity: 1, duration: 0.25, delay: 0.25, ease: 'none' })
      gsap.to(labels, { opacity: 1, duration: 0.25, delay: 0.25, ease: 'none' })
    }

    btn.addEventListener('mouseenter', onEnter)
    btn.addEventListener('mouseleave', onLeave)

    return () => {
      btn.removeEventListener('mouseenter', onEnter)
      btn.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <main className="site">

      {/* ── Hero ─────────────────────────────────── */}
      <section className="hero">
        <h1>Mike Grail</h1>
      </section>

      {/* ── Feature image ────────────────────────── */}
      <div className="feature">
        <div className="feature__img-placeholder" aria-hidden="true" />
        <div className="feature__overlay">
          <p>MYWWO NOC QKBBYXC</p>
          <p>NEEDLES</p>
          <p>QESNS</p>
        </div>
      </div>

      {/* ── Meta bar + Labels (sticky together) ─────── */}
      <div className="sticky-header">
        <div className="meta">
          <span className="caption">MIKE GRAIL</span>
          <button ref={aboutRef} className="meta__about" aria-label="About"><span ref={aboutLabelRef}>?</span></button>
          <span className="caption">Hover on images</span>
        </div>
        <div ref={labelsRef} className="products__labels">
          {LABEL_COLS.map((col, ci) => (
            <div key={ci} className="products__label-col">
              {col.map(brand => <p key={brand}>{brand}</p>)}
            </div>
          ))}
        </div>
      </div>

      {/* ── Product image grid ────────────────────── */}
      <div className="products__grid">
        {PRODUCT_IMAGES.map((img, i) => (
          <figure key={i} className="products__item">
            {img.src
              ? <OptimizedImage className="products__img" src={img.src} alt={img.alt} width={600} height={600} />
              : <div className="products__img-placeholder" aria-hidden="true" />
            }
            <figcaption className="caption">{img.label}</figcaption>
          </figure>
        ))}
      </div>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="footer">
        <a className="footer__top caption" href="#top">back to top</a>
        <div className="footer__img-placeholder" aria-hidden="true" />
      </footer>

    </main>
  )
}

export default Site
