import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)
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

const BRAND_COUNTS = PRODUCT_IMAGES.reduce((acc, p) => {
  acc[p.brand] = (acc[p.brand] || 0) + 1
  return acc
}, {})



function ProductItem({ img, gridColumn, onMouseEnter, onMouseLeave }) {
  const multi = img.images.length > 1
  const [mobileIndex, setMobileIndex] = useState(0)
  const aRef = useRef(null)
  const bRef = useRef(null)
  const stateRef = useRef({ front: 'a', index: 0 })
  const intervalRef = useRef(null)
  const hasCycledRef = useRef(false)

  function cycle() {
    const { front, index } = stateRef.current
    const nextIndex = (index + 1) % img.images.length
    const frontEl = front === 'a' ? aRef.current : bRef.current
    const backEl  = front === 'a' ? bRef.current : aRef.current
    const nextSrc = img.images[nextIndex]

    function doJump() {
      backEl.onload = null
      gsap.killTweensOf([frontEl, backEl])
      gsap.set(frontEl, { opacity: 0 })
      gsap.set(backEl,  { opacity: 1 })
      stateRef.current = { front: front === 'a' ? 'b' : 'a', index: nextIndex }
      hasCycledRef.current = true
      intervalRef.current = setTimeout(cycle, 650)
    }

    backEl.src = nextSrc
    if (backEl.complete) {
      doJump()
    } else {
      backEl.onload = doJump
    }
  }

  function startCycling() {
    if (!multi) return
    intervalRef.current = setTimeout(cycle, 650)
  }

  function stopCycling() {
    if (!multi) return
    clearTimeout(intervalRef.current)
    aRef.current.onload = null
    bRef.current.onload = null
    if (!hasCycledRef.current) return
    hasCycledRef.current = false
    gsap.killTweensOf([aRef.current, bRef.current])
    const { front, index } = stateRef.current
    if (index === 0) return
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
      style={{ gridColumn }}
      onMouseEnter={() => { if (window.innerWidth <= 768) return; startCycling(); onMouseEnter() }}
      onMouseLeave={() => { if (window.innerWidth <= 768) return; stopCycling(); onMouseLeave() }}
    >
      {img.images.length > 0
        ? <>
            <div className="products__img-wrap">
              <img ref={bRef} className="products__img products__img--b" src={multi ? img.images[1] : img.images[0]} alt={img.alt} style={{ opacity: 0 }} />
              <img ref={aRef} className="products__img products__img--a" src={img.images[0]} alt={img.alt} />
              <img className="products__img products__img--mobile" src={img.images[mobileIndex]} alt={img.alt} />
            </div>
            {multi && (
              <div className="carousel-nav">
                <button className="carousel-btn carousel-prev" onClick={() => setMobileIndex(i => (i - 1 + img.images.length) % img.images.length)}>{'←'}</button>
                <button className="carousel-btn carousel-next" onClick={() => setMobileIndex(i => (i + 1) % img.images.length)}>{'→'}</button>
              </div>
            )}
          </>
        : <div className="products__img-placeholder" aria-hidden="true" />
      }
      <figcaption className="products__item-caption">
        <span className="products__item-name">{img.name}</span>
        {img.caption && <span className="products__item-desc">{img.caption}</span>}
      </figcaption>
    </figure>
  )
}

function Site() {
  const [hoverLabel, setHoverLabel] = useState('Hover on images')
  const [isHovering, setIsHovering] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [aboutHovered, setAboutHovered] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem('mg_intro_seen'))
  const [mobileCollapsed, setMobileCollapsed] = useState(false)
  const labelsHeightRef = useRef(0)
  const introRef = useRef(null)
  const mobileCollapsedRef = useRef(false)
  const mobileManualRef = useRef(false)

  const visibleProducts = selectedBrand
    ? PRODUCT_IMAGES.filter(p => p.brand === selectedBrand)
    : PRODUCT_IMAGES

  function toggleBrand(brand) {
    setSelectedBrand(prev => prev === brand ? null : brand)
  }

  const aboutRef = useRef(null)
  const aboutLabelRef = useRef(null)
  const aboutImgRef = useRef(null)
  const labelsRef = useRef(null)
  const hoverLabelRef = useRef(null)
  const bioRef = useRef(null)
  const aboutImgMobileRef = useRef(null)
  const aboutImgMobileWrapRef = useRef(null)

  function collapseLabels() {
    if (mobileCollapsedRef.current) return
    mobileCollapsedRef.current = true
    setMobileCollapsed(true)
    gsap.killTweensOf(labelsRef.current)
    gsap.to(labelsRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut' })
    gsap.killTweensOf(bioRef.current)
    gsap.to(bioRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut' })
    const cols = labelsRef.current.querySelectorAll('.products__label-col')
    gsap.to(cols, { opacity: 1, duration: 0.2 })
    gsap.to(aboutImgMobileRef.current, { opacity: 0, duration: 0.15 })
    gsap.to(aboutImgMobileWrapRef.current, { width: 28, height: 28, duration: 0.4, delay: 0.1, ease: 'power2.inOut' })
    gsap.to(aboutImgMobileWrapRef.current, { opacity: 0, duration: 0.15, delay: 0.5 })
    setAboutOpen(false)
  }

  function expandLabels() {
    if (!mobileCollapsedRef.current) return
    mobileCollapsedRef.current = false
    setMobileCollapsed(false)
    gsap.killTweensOf(labelsRef.current)
    gsap.to(labelsRef.current, {
      height: labelsHeightRef.current, opacity: 1, duration: 0.3, ease: 'power2.out',
      onComplete: () => gsap.set(labelsRef.current, { clearProps: 'height' })
    })
  }

  function toggleAbout() {
    const el = bioRef.current
    const cols = labelsRef.current.querySelectorAll('.products__label-col')
    const img = aboutImgMobileRef.current
    const wrap = aboutImgMobileWrapRef.current
    if (aboutOpen) {
      gsap.to(img, { opacity: 0, duration: 0.15 })
      gsap.to(wrap, { width: 28, height: 28, duration: 0.4, delay: 0.1, ease: 'power2.inOut' })
      gsap.to(wrap, { opacity: 0, duration: 0.15, delay: 0.5 })
      gsap.to(cols, { opacity: 1, duration: 0.25, delay: 0.5 })
      gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut' })
      setAboutOpen(false)
    } else {
      const targetHeight = labelsRef.current.offsetHeight
      const targetWidth = img.naturalWidth && img.naturalHeight
        ? Math.round(targetHeight * img.naturalWidth / img.naturalHeight)
        : targetHeight
      gsap.to(cols, { opacity: 0, duration: 0.25 })
      gsap.set(wrap, { width: 28, height: 28, opacity: 1 })
      gsap.to(wrap, { width: targetWidth, height: targetHeight, duration: 0.4, delay: 0.1, ease: 'power2.inOut' })
      gsap.to(img, { opacity: 1, duration: 0.2, delay: 0.25 })
      gsap.to(el, { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.inOut' })
      setAboutOpen(true)
    }
  }

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
    if (!showIntro) return
    const overlay = introRef.current
    gsap.to(overlay, { y: '-100%', duration: 0.7, ease: 'power2.inOut', delay: 1.5,
      onComplete: () => {
        localStorage.setItem('mg_intro_seen', '1')
        setShowIntro(false)
      }
    })
  }, [])

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
      gsap.to(aboutImgRef.current, { opacity: 1, duration: 0.1, delay: 0.25, ease: 'none' })
    }

    function onLeave() {
      gsap.to(aboutImgRef.current, { opacity: 0, duration: 0.2, ease: 'none' })
      gsap.to(btn, { width: 28, height: 28, duration: 0.4, delay: 0.1, ease: 'power2.inOut', onComplete: () => gsap.set(btn, { clearProps: 'width,height' }) })
      gsap.to(labels, { height: labelsHeightRef.current, duration: 0.4, delay: 0.1, ease: 'power2.inOut', onComplete: () => gsap.set(labels, { clearProps: 'height' }) })
      gsap.to(label, { opacity: 1, duration: 0.25, delay: 0.35, ease: 'none' })
      gsap.to(labels, { opacity: 1, duration: 0.25, delay: 0.35, ease: 'none' })
    }

    btn.addEventListener('mouseenter', onEnter)
    btn.addEventListener('mouseleave', onLeave)

    return () => {
      btn.removeEventListener('mouseenter', onEnter)
      btn.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  useEffect(() => {
    function handleScroll() {
      if (window.innerWidth > 768) return
      if (window.scrollY > 80) {
        if (!mobileManualRef.current) collapseLabels()
      } else {
        mobileManualRef.current = false
        expandLabels()
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="site">

      {/* ── Intro overlay ────────────────────────── */}
      {showIntro && (
        <div ref={introRef} className="intro">
          <p>Mike Grail</p>
        </div>
      )}

      {/* ── Feature video ────────────────────────── */}
      <div className="feature__container">
        <video
          className="feature__video"
          src="https://de1wwae7728z6.cloudfront.net/videos/mike-grail/s3/feature.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>

      {/* ── Meta bar + Labels (sticky together) ─────── */}
      <div className="sticky-header">
        <div className="meta">
          <span className="caption mike-grail-label" onClick={() => setSelectedBrand(null)}>MIKE GRAIL</span>
          <button ref={aboutRef} className="meta__about" aria-label="About" onMouseEnter={() => { setAboutHovered(true); changeLabel(ABOUT_TEXT, true, 0.4, 0.25) }} onMouseLeave={() => changeLabel('Hover on images', false)}><span ref={aboutLabelRef} className={aboutHovered ? 'about-label--gone' : ''}>?</span><img ref={aboutImgRef} src="https://de1wwae7728z6.cloudfront.net/images/mike-grail/s3/about.jpg" alt="" className="meta__about-img" style={{ opacity: 0 }} /></button>
          <div className="meta__hover-label">
            <span ref={hoverLabelRef} className={isHovering ? '' : 'caption'}>{hoverLabel}</span>
          </div>
          <button
            className="meta__mobile-toggle"
            aria-label={mobileCollapsed ? 'Expand brands' : 'Collapse brands'}
            onClick={() => {
              if (mobileCollapsedRef.current) {
                mobileManualRef.current = true
                expandLabels()
              } else {
                mobileManualRef.current = false
                collapseLabels()
              }
            }}
          >{mobileCollapsed ? '+' : '−'}</button>
        </div>
        <div ref={labelsRef} className="products__labels">
          {LABEL_COLS.map((col, ci) => (
            <div key={ci} className="products__label-col">
              {col.map(brand => (
                <p
                  key={brand}
                  className={selectedBrand === brand ? 'brand-label brand-label--selected' : selectedBrand ? 'brand-label brand-label--dim' : 'brand-label'}
                  onClick={() => { if (!aboutOpen) toggleBrand(brand) }}
                >{brand}{selectedBrand === brand ? ` (${BRAND_COUNTS[brand] ?? 0})` : ''}</p>
              ))}
            </div>
          ))}
          <div ref={aboutImgMobileWrapRef} className="labels__about-img-wrap" style={{ width: 28, height: 28, opacity: 0 }}>
            <img
              ref={aboutImgMobileRef}
              src="https://de1wwae7728z6.cloudfront.net/images/mike-grail/s3/about.jpg"
              alt=""
              className="labels__about-img"
              style={{ opacity: 0 }}
            />
          </div>
          <p
            className={`labels__about${aboutOpen ? ' labels__about--open' : ''}`}
            onClick={toggleAbout}
          >ABOUT</p>
        </div>
        <div ref={bioRef} className="about-bio" style={{ height: 0, opacity: 0, overflow: 'hidden' }}>
          {ABOUT_TEXT.split('\n\n').map((para, i) => (
            <p key={i} className="about-bio__para">{para}</p>
          ))}
        </div>
      </div>

      {/* ── Product image grid ────────────────────── */}
      <div className="products__grid">
        {(() => {
          let col = 0
          return visibleProducts.map((img, i) => {
            let gridColumn
            if (img.orientation === 'horizontal') {
              gridColumn = '1 / span 4'
              col = 0
            } else {
              gridColumn = col === 0 ? '1 / span 2' : '3 / span 2'
              col = col === 0 ? 1 : 0
            }
            return (
              <ProductItem
                key={i}
                img={img}
                gridColumn={gridColumn}
                onMouseEnter={() => { setHoverLabel(img.caption ? `${img.name}\n\n${img.caption}` : img.name); setIsHovering(true) }}
                onMouseLeave={() => { setHoverLabel('Hover on images'); setIsHovering(false) }}
              />
            )
          })
        })()}
      </div>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="footer">
        <div className="footer__nav">
          <a
            className="footer__top caption"
            href="#top"
            onClick={e => {
              e.preventDefault()
              gsap.to(window, { scrollTo: 0, duration: 1, ease: 'power2.inOut' })
            }}
          >BACK TO TOP ↑</a>
          <div className="footer__nav-bottom">
            <a
              href="https://s2.mike-grail.com"
              className="footer__last-season caption"
              target="_blank"
              rel="noopener noreferrer"
            >← LAST SEASON</a>
            <a
              href="https://www.instagram.com/michael__ry_/"
              className="footer__instagram caption"
              target="_blank"
              rel="noopener noreferrer"
            >INSTAGRAM →</a>
          </div>
        </div>
        <img src="https://de1wwae7728z6.cloudfront.net/images/mike-grail/s3/footer.jpg" alt="" className="footer__img" />
      </footer>

    </main>
  )
}

export default Site
