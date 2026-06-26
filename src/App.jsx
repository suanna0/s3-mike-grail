import ComingSoon from './components/ComingSoon'
import Site from './components/Site'

const LAUNCH_DATE = new Date('2026-07-06T17:00:00Z')

function App() {
  const isLaunched = new Date() >= LAUNCH_DATE
  const isPreview = new URLSearchParams(window.location.search).has('preview')

  return isLaunched || isPreview ? <Site /> : <ComingSoon />
}

export default App
