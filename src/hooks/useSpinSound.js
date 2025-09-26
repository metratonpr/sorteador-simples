import { useCallback, useEffect, useRef } from 'react'
import { Howl } from 'howler'

export const useSpinSound = () => {
  const soundRef = useRef(null)

  useEffect(() => {
    const spin = new Howl({
      src: ['/assets/sounds/spin.mp3'],
      preload: true,
      volume: 0.6,
      html5: true,
    })

    soundRef.current = spin

    return () => {
      spin.unload()
    }
  }, [])

  const play = useCallback(() => {
    if (!soundRef.current) return
    soundRef.current.stop()
    soundRef.current.play()
  }, [])

  const stop = useCallback(() => {
    if (!soundRef.current) return
    soundRef.current.stop()
  }, [])

  return { play, stop }
}