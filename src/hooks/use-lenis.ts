'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    // GSAP + Lenis ticker integration
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // ScrollTrigger sync
    lenis.on('scroll', ScrollTrigger.update)

    // RAF loop for Lenis
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const rafId = requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      lenisRef.current = null
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      cancelAnimationFrame(rafId)
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return lenisRef
}

// Optional: disable Lenis on mobile for raw scroll performance
export function useLenisWithMobileSupport() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mq480 = window.matchMedia('(max-width: 480px)')
    if (mq480.matches) {
      // Skip Lenis on mobile for better raw scroll performance
      return
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    lenis.on('scroll', ScrollTrigger.update)

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const rafId = requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      lenisRef.current = null
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      cancelAnimationFrame(rafId)
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return lenisRef
}