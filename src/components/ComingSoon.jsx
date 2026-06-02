import './ComingSoon.css'

const BG_IMAGE = 'https://de1wwae7728z6.cloudfront.net/images/mike-grail/shoe.jpg'

function ComingSoon() {
  return (
    <div className="coming-soon">
      <img
        className="coming-soon__bg"
        src={BG_IMAGE}
        alt=""
        aria-hidden="true"
        fetchpriority="high"
      />
      <span className="coming-soon__text">COMING SOON</span>
    </div>
  )
}

export default ComingSoon
