import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)
import OptimizedImage from './OptimizedImage'
import './Site.css'
import LABELS from '../data/labels'
import PRODUCT_IMAGES from '../data/products/index.js'

const ABOUT_TEXT = `Hi, I'm Michael.

I have always had an eye for beautiful things - whether they be incredible moments of design history, laboriously handcrafted garments, extraordinary natural phenomena, or just plain everyday objects.

In a world of fast moving trends and overconsumption, I am working to be more intentional about what I collect, investing in lifelong pieces that I know I will cherish forever. Updating this website periodically not only is a small nod to this shift in attitude but also serves as a way to look back on the stories each piece holds.`

const COL_SIZE = 3
const LABEL_COLS = (() => {
  const cols = []
  for (let i = 0; i < LABELS.length; i += COL_SIZE) {
    cols.push(LABELS.slice(i, i + COL_SIZE))
  }
  return cols
})()


function ProductItem({ img, onMouseEnter, onMouseLeave }) {
  const multi = img.images.length > 1
  const aRef = useRef(null)
  const bRef = useRef(null)
  const stateRef = useRef({ front: 'a', index: 0 })
  const intervalRef = useRef(null)

  function cycle() {
    const { front, index } = stateRef.current
    const nextIndex = (index + 1) % img.images.length
    const frontEl = front === 'a' ? aRef.current : bRef.current
    const backEl  = front === 'a' ? bRef.current : aRef.current
    const nextSrc = img.images[nextIndex]

    function doFade() {
      backEl.onload = null
      gsap.to(frontEl, { opacity: 0, duration: 0.5, ease: 'none' })
      gsap.to(backEl,  { opacity: 1, duration: 0.5, ease: 'none' })
      stateRef.current = { front: front === 'a' ? 'b' : 'a', index: nextIndex }
    }

    backEl.src = nextSrc
    if (backEl.complete) {
      doFade()
    } else {
      backEl.onload = doFade
    }
  }

  function startCycling() {
    if (!multi) return
    cycle()
    intervalRef.current = setInterval(cycle, 2000)
  }

  function stopCycling() {
    if (!multi) return
    clearInterval(intervalRef.current)
    aRef.current.onload = null
    bRef.current.onload = null
    gsap.killTweensOf([aRef.current, bRef.current])
    const { front } = stateRef.current
    const frontEl = front === 'a' ? aRef.current : bRef.current
    const backEl  = front === 'a' ? bRef.current : aRef.current
    backEl.src = img.images[0]
    gsap.to(frontEl, { opacity: 0, duration: 0.5, ease: 'none' })
    gsap.to(backEl,  { opacity: 1, duration: 0.5, ease: 'none' })
    stateRef.current = { front: front === 'a' ? 'b' : 'a', index: 0 }
  }

  return (
    <figure
      className="products__item"
      onMouseEnter={() => { startCycling(); onMouseEnter() }}
      onMouseLeave={() => { stopCycling(); onMouseLeave() }}
    >
      {img.images.length > 0
        ? <div className="products__img-wrap">
            <img ref={bRef} className="products__img products__img--b" src={multi ? img.images[1] : img.images[0]} alt={img.alt} style={{ opacity: 0 }} />
            <img ref={aRef} className="products__img products__img--a" src={img.images[0]} alt={img.alt} />
          </div>
        : <div className="products__img-placeholder" aria-hidden="true" />
      }
    </figure>
  )
}

function Site() {
  const [hoverLabel, setHoverLabel] = useState('Hover on images')
  const [isHovering, setIsHovering] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [aboutHovered, setAboutHovered] = useState(false)
  const labelsHeightRef = useRef(0)

  const visibleProducts = selectedBrand
    ? PRODUCT_IMAGES.filter(p => p.brand === selectedBrand)
    : PRODUCT_IMAGES

  function toggleBrand(brand) {
    setSelectedBrand(prev => prev === brand ? null : brand)
  }

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
    labelsHeightRef.current = labelsHeight

    function onEnter() {
      const size = labels.children[0].offsetWidth
      gsap.to(labels, { opacity: 0, duration: 0.25, ease: 'none' })
      gsap.to(labels, { height: 0, duration: 0.4, delay: 0.25, ease: 'power2.inOut' })
      gsap.to(btn, { width: size, height: size, duration: 0.4, delay: 0.25, ease: 'power2.inOut' })
      gsap.to(label, { opacity: 0, duration: 0.25, delay: 0.25, ease: 'none' })
    }

    function onLeave() {
      gsap.to(btn, { width: 28, height: 28, duration: 0.4, ease: 'power2.inOut' })
      gsap.to(labels, { height: labelsHeightRef.current, duration: 0.4, ease: 'power2.inOut' })
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
        src="https://de1wwae7728z6.cloudfront.net/videos/mike-grail/s3/bw.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* ── Meta bar + Labels (sticky together) ─────── */}
      <div className="sticky-header">
        <div className="meta">
          <span className="caption mike-grail-label" onClick={() => setSelectedBrand(null)}>MIKE GRAIL</span>
          <button ref={aboutRef} className="meta__about" aria-label="About" onMouseEnter={() => { setAboutHovered(true); changeLabel(ABOUT_TEXT, true, 0.4, 0.25) }} onMouseLeave={() => changeLabel('Hover on images', false)}><span ref={aboutLabelRef} className={aboutHovered ? 'about-label--gone' : ''}>?</span></button>
          <div className="meta__hover-label">
            <span ref={hoverLabelRef} className={isHovering ? '' : 'caption'}>{hoverLabel}</span>
          </div>
        </div>
        <div ref={labelsRef} className="products__labels">
          {LABEL_COLS.map((col, ci) => (
            <div key={ci} className="products__label-col">
              {col.map(brand => (
                <p
                  key={brand}
                  className={selectedBrand === brand ? 'brand-label brand-label--selected' : selectedBrand ? 'brand-label brand-label--dim' : 'brand-label'}
                  onClick={() => toggleBrand(brand)}
                >{brand}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Product image grid ────────────────────── */}
      <div className="products__grid">
        {visibleProducts.map((img, i) => (
          <ProductItem
            key={i}
            img={img}
            onMouseEnter={() => { setHoverLabel(img.caption ? `${img.name}\n\n${img.caption}` : img.name); setIsHovering(true) }}
            onMouseLeave={() => { setHoverLabel('Hover on images'); setIsHovering(false) }}
          />
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
        >BACK TO TOP</a>
        <img src="https://de1wwae7728z6.cloudfront.net/images/mike-grail/s3/footer.jpg" alt="" className="footer__img" />
      </footer>

    </main>
  )
}

export default Site
