import OptimizedImage from './OptimizedImage'
import './Site.css'

// Placeholder — replace with real content
function Site() {
  return (
    <main className="site">
      <h1>Mike Grail</h1>
      {/* Example usage of OptimizedImage — swap src/sizes as needed */}
      <OptimizedImage
        src="/images/hero.jpg"
        alt="Hero image"
        width={1440}
        height={900}
        priority
      />
    </main>
  )
}

export default Site
