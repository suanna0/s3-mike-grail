import { useEffect, useRef, useState } from 'react'

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const SPEED = 40

function caesar(char, offset) {
  const i = ALPHA.indexOf(char)
  if (i === -1) return char
  return ALPHA[((i + Math.round(offset)) % 26 + 26) % 26]
}

function applyOffsets(text, offsets) {
  let oi = 0
  return text.split('').map(c => c === ' ' ? ' ' : caesar(c, offsets[oi++])).join('')
}

export function useScramble(baseText) {
  const letterCount = baseText.replace(/ /g, '').length
  const scrambleTargets = Array.from({ length: letterCount }, (_, i) => 3 + (i % 3))

  const [displayText, setDisplayText] = useState(baseText)
  const textRef = useRef(null)
  const rafRef = useRef(null)
  const isHoveringRef = useRef(false)
  const prevHoveringRef = useRef(false)
  const offsetsRef = useRef(Array.from({ length: letterCount }, () => 0))
  const targetOffsetsRef = useRef(Array.from({ length: letterCount }, () => 0))
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

      if (hovering && !wasHovering) {
        for (let i = 0; i < targets.length; i++) targets[i] = scrambleTargets[i]
      }
      if (!hovering && wasHovering) {
        for (let i = 0; i < targets.length; i++) targets[i] = 0
      }

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

      if (allAtTarget && targets[0] > 0) {
        for (let i = 0; i < targets.length; i++) targets[i] = 0
      }

      prevHoveringRef.current = hovering
      setDisplayText(applyOffsets(baseText, offsets))
      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMouseMove)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { displayText, textRef }
}
