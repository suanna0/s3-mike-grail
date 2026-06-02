import ComingSoon from './components/ComingSoon'
import Site from './components/Site'

const LAUNCH_DATE = new Date('2026-07-01T00:00:00')

function App() {
  const isLaunched = new Date() >= LAUNCH_DATE

  return isLaunched ? <Site /> : <ComingSoon />
}

export default App
