import OptimizedImage from './OptimizedImage'
import './Site.css'

const LABEL_COLS = [
  ['KAPITAL (3)', 'GENTLE MONSTER', 'COMME DES GARCONS', 'NEEDLES'],
  ['KAPITAL (3)', 'GENTLE MONSTER', 'COMME DES GARCONS', 'NEEDLES'],
  ['KAPITAL (3)', 'GENTLE MONSTER', 'COMME DES GARCONS', 'NEEDLES'],
]

// Placeholder product images — swap in real srcs when available
const PRODUCT_IMAGES = [
  { src: null, alt: 'Look 1' },
  { src: null, alt: 'Look 2' },
  { src: null, alt: 'Look 3' },
  { src: null, alt: 'Look 4' },
  { src: null, alt: 'Look 5' },
  { src: null, alt: 'Look 6' },
]

function Site() {
  return (
    <main className="site">

      {/* ── Hero ─────────────────────────────────── */}
      <section className="hero">
        <h1>Mike Grail</h1>
      </section>

      {/* ── Feature image ────────────────────────── */}
      <div className="feature">
        {/* swap src/width/height once asset is available */}
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
          <div className="meta__right">
            <button className="meta__help" aria-label="Help">?</button>
            <span className="caption">Hover on images</span>
          </div>
        </div>
        <div className="products__labels">
          {LABEL_COLS.map((col, ci) => (
            <div key={ci} className="products__label-col">
              {col.map(brand => <p key={brand}>{brand}</p>)}
            </div>
          ))}
        </div>
      </div>

      {/* ── Product image grid ────────────────────── */}
      <div className="products__grid">
        {PRODUCT_IMAGES.map((img, i) =>
          img.src
            ? <OptimizedImage key={i} className="products__img" src={img.src} alt={img.alt} width={600} height={600} />
            : <div key={i} className="products__img-placeholder" aria-label={img.alt} />
        )}
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
