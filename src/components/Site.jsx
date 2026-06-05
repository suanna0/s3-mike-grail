import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)
import OptimizedImage from './OptimizedImage'
import './Site.css'

const ABOUT_TEXT = `Hi, I'm Michael.

I have always had an eye for beautiful things - whether they be incredible moments of design history, laboriously handcrafted garments, extraordinary natural phenomena, or just plain everyday objects.

In a world of fast moving trends and overconsumption, I am working to be more intentional about what I collect, investing in lifelong pieces that I know I will cherish forever. Updating this website periodically not only is a small nod to this shift in attitude but also serves as a way to look back on the stories each piece holds.`

const LABELS = [
  'COMME des GARÇONS', 'Gentle Monster', 'Guidi', 'Kapital',
  'Little Tokyo Table Tennis', 'Maison Margiela', 'Needles', 'Suanna Zhong', 'Taiga Takahashi',
]

const COL_SIZE = 3
const LABEL_COLS = (() => {
  const cols = []
  for (let i = 0; i < LABELS.length; i += COL_SIZE) {
    cols.push(LABELS.slice(i, i + COL_SIZE))
  }
  return cols
})()

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
  const [hoverLabel, setHoverLabel] = useState('Hover on images')
  const [isHovering, setIsHovering] = useState(false)

  const aboutRef = useRef(null)
  const aboutLabelRef = useRef(null)
  const labelsRef = useRef(null)
  const hoverLabelRef = useRef(null)

  function changeLabel(text, hovering, fadeInDelay = 0, fadeInDuration = 0.15) {
    const el = hoverLabelRef.current
    gsap.to(el, {
      opacity: 0, duration: 0.15, ease: 'none',
      onComplete: () => {
        setHoverLabel(text)
        setIsHovering(hovering)
        gsap.to(el, { opacity: 1, duration: fadeInDuration, delay: fadeInDelay, ease: 'none' })
      }
    })
  }

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
      gsap.to(labels, { height: 0, duration: 0.4, delay: 0.25, ease: 'power2.inOut' })
      gsap.to(btn, { width: size, height: size, duration: 0.4, delay: 0.25, ease: 'power2.inOut' })
      gsap.to(label, { opacity: 0, duration: 0.25, delay: 0.25, ease: 'none' })
    }

    function onLeave() {
      // Phase 1: shrink rectangle + restore labels height simultaneously
      gsap.to(btn, { width: 28, height: 28, duration: 0.4, ease: 'power2.inOut' })
      gsap.to(labels, { height: labelsHeight, duration: 0.4, ease: 'power2.inOut' })
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

      {/* ── Feature video ────────────────────────── */}
      <video
        className="feature__video"
        src="https://de1wwae7728z6.cloudfront.net/videos/mike-grail/bw.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* ── Meta bar + Labels (sticky together) ─────── */}
      <div className="sticky-header">
        <div className="meta">
          <span className="caption">MIKE GRAIL</span>
          <button ref={aboutRef} className="meta__about" aria-label="About" onMouseEnter={() => changeLabel(ABOUT_TEXT, true, 0.4, 0.25)} onMouseLeave={() => changeLabel('Hover on images', false)}><span ref={aboutLabelRef}>?</span></button>
          <div className="meta__hover-label">
            <span ref={hoverLabelRef} className={isHovering ? '' : 'caption'}>{hoverLabel}</span>
          </div>
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
          <figure
            key={i}
            className="products__item"
            onMouseEnter={() => { setHoverLabel(img.label); setIsHovering(true) }}
            onMouseLeave={() => { setHoverLabel('Hover on images'); setIsHovering(false) }}
          >
            {img.src
              ? <OptimizedImage className="products__img" src={img.src} alt={img.alt} width={600} height={600} />
              : <div className="products__img-placeholder" aria-hidden="true" />
            }
          </figure>
        ))}
      </div>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="footer">
        <a
          className="footer__top caption"
          href="#top"
          onClick={e => {
            e.preventDefault()
            gsap.to(window, { scrollTo: 0, duration: 1, ease: 'power2.inOut' })
          }}
        >back to top</a>
        <div className="footer__img-placeholder" aria-hidden="true" />
      </footer>

    </main>
  )
}

export default Site
