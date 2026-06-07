import { useEffect, useRef, useState } from 'react'
import './ComingSoon.css'

const BG_IMAGE = 'https://de1wwae7728z6.cloudfront.net/images/mike-grail/shoe.jpg'
const BASE_TEXT = 'COMING SOON'
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LETTER_COUNT = BASE_TEXT.replace(/ /g, '').length
const SPEED = 40
const SCRAMBLE_TARGETS = Array.from({ length: LETTER_COUNT }, (_, i) => 3 + (i % 3))

function caesar(char, offset) {
  const i = ALPHA.indexOf(char)
  if (i === -1) return char
  return ALPHA[((i + Math.round(offset)) % 26 + 26) % 26]
}

function applyOffsets(text, offsets) {
  let oi = 0
  return text.split('').map(c => c === ' ' ? ' ' : caesar(c, offsets[oi++])).join('')
}

function ComingSoon() {
  const [displayText, setDisplayText] = useState(BASE_TEXT)
  const textRef = useRef(null)
  const rafRef = useRef(null)
  const isHoveringRef = useRef(false)
  const prevHoveringRef = useRef(false)
  const offsetsRef = useRef(Array.from({ length: LETTER_COUNT }, () => 0))
  const targetOffsetsRef = useRef(Array.from({ length: LETTER_COUNT }, () => 0))
  const lastTickRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    function onMouseMove(e) {
      if (!textRef.current) return
      const rect = textRef.current.getBoundingClientRect()
      const pad = 40
      isHoveringRef.current = (
        e.clientX >= rect.left - pad &&
        e.clientX <= rect.right + pad &&
        e.clientY >= rect.top - pad &&
        e.clientY <= rect.bottom + pad
      )
    }

    function tick(now) {
      const dt = lastTickRef.current ? (now - lastTickRef.current) / 1000 : 0
      lastTickRef.current = now

      const offsets = offsetsRef.current
      const targets = targetOffsetsRef.current
      const hovering = isHoveringRef.current
      const wasHovering = prevHoveringRef.current

      // On hover enter: assign deterministic scramble targets
      if (hovering && !wasHovering) {
        for (let i = 0; i < targets.length; i++) {
          targets[i] = SCRAMBLE_TARGETS[i]
        }
      }

      // On hover exit: ensure we unscramble back to 0
      if (!hovering && wasHovering) {
        for (let i = 0; i < targets.length; i++) targets[i] = 0
      }

      // Always animate offsets toward their targets
      let allAtTarget = true
      for (let i = 0; i < offsets.length; i++) {
        if (offsets[i] < targets[i]) {
          offsets[i] = Math.min(targets[i], offsets[i] + SPEED * dt)
          allAtTarget = false
        } else if (offsets[i] > targets[i]) {
          offsets[i] = Math.max(targets[i], offsets[i] - SPEED * dt)
          allAtTarget = false
        }
      }

      // Once fully scrambled up, switch targets to 0 to trigger unscramble
      if (allAtTarget && targets[0] > 0) {
        for (let i = 0; i < targets.length; i++) targets[i] = 0
      }

      prevHoveringRef.current = hovering
      setDisplayText(applyOffsets(BASE_TEXT, offsets))
      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMouseMove)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

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
