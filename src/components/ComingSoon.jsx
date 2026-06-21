import { useScramble } from '../hooks/useScramble'
import './ComingSoon.css'

const BG_IMAGE = 'https://de1wwae7728z6.cloudfront.net/images/mike-grail/s3/coming_soon_background.jpg'

function ComingSoon() {
  const { displayText, textRef } = useScramble('COMING SOON')

  return (
    <div className="coming-soon">
      <img
        className="coming-soon__bg"
        src={BG_IMAGE}
        alt=""
        aria-hidden="true"
        fetchpriority="high"
      />
      <span ref={textRef} className="coming-soon__text">{displayText}</span>
      <footer className="coming-soon__footer">
        <a
          href="https://s2.mike-grail.com"
          className="coming-soon__footer-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          ← LAST SEASON
        </a>
      </footer>
    </div>
  )
}

export default ComingSoon
