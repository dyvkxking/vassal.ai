'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Set global ScrollTrigger defaults per design system
ScrollTrigger.defaults({
  toggleActions: 'play none none reverse',
  fastScrollEnd: true,
  preventOverlaps: true,
})

interface UsePageHeaderAnimationsOptions {
  enabled?: boolean
}

export function usePageHeaderAnimations({ enabled = true }: UsePageHeaderAnimationsOptions = {}) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const triggersRef = useRef<ScrollTrigger[]>([])

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // ========================================
      // PAGE HEADER ENTRANCE ANIMATION
      // ========================================

      const headerTl = gsap.timeline({
        defaults: {
          ease: 'expo.out',
        },
      })

      // Staggered entrance for header elements
      headerTl
        .fromTo(
          '.pw-page-header-eyebrow',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          0
        )
        .fromTo(
          '.pw-page-header-title',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          0.1
        )
        .fromTo(
          '.pw-page-header-subtitle',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.25
        )
        .fromTo(
          '.pw-page-header-stats',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.35
        )

      timelineRef.current = headerTl

      // ========================================
      // TOOLBAR ANIMATION — Scroll-triggered
      // ========================================

      const toolbarTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.pw-page-header',
          start: 'top 80px',
          end: 'bottom top',
          toggleActions: 'play none none reverse',
        },
      })

      toolbarTl
        .fromTo(
          '.pw-toolbar-search',
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4 },
          0
        )
        .fromTo(
          '.pw-toolbar-sort',
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.4 },
          0.1
        )
        .fromTo(
          '.pw-filter-sheet-trigger',
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.3 },
          0.15
        )

      triggersRef.current.push(toolbarTl.scrollTrigger!)

      // ========================================
      // AGENT CARD ENTRANCE — Staggered scroll reveal
      // ========================================

      // Use batch for efficient staggered reveals
      ScrollTrigger.batch('.pw-agent-card', {
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'expo.out',
              stagger: 0.08,
            }
          )
        },
        start: 'top 85%',
        once: true,
      })

      // ========================================
      // ACTIVE FILTER TAGS — Slide in animation
      // ========================================

      gsap.fromTo(
        '.pw-filter-tag',
        { opacity: 0, scale: 0.9, x: -10 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.3,
          ease: 'back.out(1.7)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: '.pw-filter-tags-container',
            start: 'top 90%',
            once: true,
          },
        }
      )
    })

    return () => {
      ctx.revert()
      timelineRef.current = null
      triggersRef.current = []
    }
  }, [enabled])
}

// Parallax layer utility for potential WebGL backgrounds
export function useParallaxLayers(layers: { selector: string; velocity: number }[]) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      layers.forEach(({ selector, velocity }) => {
        const el = document.querySelector(selector)
        if (!el) return

        gsap.to(selector, {
          y: () => window.innerHeight * velocity * 0.5,
          ease: 'none',
          scrollTrigger: {
            trigger: '.pw-page-header',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [layers])
}

// Cleanup utility for unmount
export function cleanupAnimations() {
  ScrollTrigger.getAll().forEach((st) => st.kill())
  gsap.killTweensOf('*')
}