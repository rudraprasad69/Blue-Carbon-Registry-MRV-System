/**
 * INTERACTIVE HOVER EFFECTS HOOK
 * Advanced hover state management with visual effects
 */

'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

/**
 * Hook for managing interactive hover effects
 * Provides mouse tracking, glow effects, and particle animations
 */
export function useInteractiveHover(options?: {
  enableGlow?: boolean
  enableParticles?: boolean
  glowColor?: string
  glowIntensity?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 })

  const {
    enableGlow = true,
    enableParticles = false,
    glowColor = 'rgba(16, 185, 129, 0.3)',
    glowIntensity = 1,
  } = options || {}

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    setGlowPos({ x: 0, y: 0 })
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setMousePos({ x, y })

      if (enableGlow) {
        setGlowPos({
          x: (x / rect.width) * 100,
          y: (y / rect.height) * 100,
        })

        // Apply glow effect
        if (ref.current) {
          ref.current.style.setProperty(
            '--glow-x',
            `${(x / rect.width) * 100}%`
          )
          ref.current.style.setProperty(
            '--glow-y',
            `${(y / rect.height) * 100}%`
          )
          ref.current.style.setProperty(
            '--glow-color',
            glowColor
          )
          ref.current.style.setProperty(
            '--glow-intensity',
            String(glowIntensity)
          )
        }
      }
    },
    [enableGlow, glowColor, glowIntensity]
  )

  useEffect(() => {
    const element = ref.current
    if (!element) return

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
    element.addEventListener('mousemove', handleMouseMove as EventListener)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.removeEventListener('mousemove', handleMouseMove as EventListener)
    }
  }, [handleMouseEnter, handleMouseLeave, handleMouseMove])

  return { ref, isHovering, mousePos, glowPos }
}

/**
 * Hook for particle effects on hover
 */
export function useParticleEffect(options?: {
  particleCount?: number
  particleColor?: string
  particleSize?: number
  particleLifetime?: number
  particleSpread?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = useState<Array<{
    id: string
    x: number
    y: number
    vx: number
    vy: number
    opacity: number
  }>>([])

  const {
    particleCount = 8,
    particleColor = 'rgba(16, 185, 129, 0.6)',
    particleSize = 4,
    particleLifetime = 800,
    particleSpread = 100,
  } = options || {}

  const handleMouseEnter = useCallback((e: MouseEvent) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newParticles = Array.from({ length: particleCount }).map(
      (_, i) => {
        const angle = (Math.PI * 2 * i) / particleCount
        const velocity = 2 + Math.random() * 2

        return {
          id: `${Date.now()}-${i}`,
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          opacity: 1,
        }
      }
    )

    setParticles((prev) => [...prev, ...newParticles])

    // Remove particles after lifetime
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter(
          (p) => !newParticles.find((np) => np.id === p.id)
        )
      )
    }, particleLifetime)
  }, [particleCount, particleLifetime])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    element.addEventListener('mouseenter', handleMouseEnter as EventListener)
    return () => {
      element.removeEventListener(
        'mouseenter',
        handleMouseEnter as EventListener
      )
    }
  }, [handleMouseEnter])

  return { ref, particles, particleColor, particleSize }
}

/**
 * Hook for smooth scroll animation tracking
 */
export function useScrollDirection() {
  const [direction, setDirection] = useState<'up' | 'down'>('down')
  const [scrollProgress, setScrollProgress] = useState(0)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine direction
      if (currentScrollY > lastScrollY.current) {
        setDirection('down')
      } else {
        setDirection('up')
      }
      lastScrollY.current = currentScrollY

      // Calculate scroll progress
      const windowHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const progress =
        windowHeight > 0
          ? (currentScrollY / windowHeight) * 100
          : 0
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { direction, scrollProgress }
}

/**
 * Hook for element focus/blur effects
 */
export function useFocusEffect(options?: {
  focusColor?: string
  blurColor?: string
  enableTransition?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const {
    focusColor = 'rgba(16, 185, 129, 0.4)',
    blurColor = 'rgba(99, 102, 241, 0.2)',
    enableTransition = true,
  } = options || {}

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleFocus = () => {
      setIsFocused(true)
      if (element instanceof HTMLElement) {
        element.style.setProperty('--focus-color', focusColor)
        if (enableTransition) {
          element.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }
      }
    }

    const handleBlur = () => {
      setIsFocused(false)
      if (element instanceof HTMLElement) {
        element.style.setProperty('--focus-color', blurColor)
      }
    }

    element.addEventListener('focus', handleFocus, true)
    element.addEventListener('blur', handleBlur, true)

    return () => {
      element.removeEventListener('focus', handleFocus, true)
      element.removeEventListener('blur', handleBlur, true)
    }
  }, [focusColor, blurColor, enableTransition])

  return { ref, isFocused }
}

/**
 * Hook for click ripple effects
 */
export function useClickRipple() {
  const ref = useRef<HTMLElement>(null)
  const [ripples, setRipples] = useState<Array<{
    id: string
    x: number
    y: number
  }>>([])

  const handleClick = useCallback((e: MouseEvent) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = `${Date.now()}-${Math.random()}`

    setRipples((prev) => [...prev, { id, x, y }])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    element.addEventListener('click', handleClick as EventListener)
    return () => {
      element.removeEventListener('click', handleClick as EventListener)
    }
  }, [handleClick])

  return { ref, ripples }
}

/**
 * Hook for magnetic cursor effect
 */
export function useMagneticCursor() {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const animationRef = useRef<number>()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const elementCenterX = rect.left + rect.width / 2
      const elementCenterY = rect.top + rect.height / 2

      const distance = 150 // Distance threshold
      const dx = e.clientX - elementCenterX
      const dy = e.clientY - elementCenterY
      const distance_value = Math.sqrt(dx * dx + dy * dy)

      if (distance_value < distance) {
        const angle = Math.atan2(dy, dx)
        const pull = (distance - distance_value) / distance

        const newX = Math.cos(angle) * pull * 20
        const newY = Math.sin(angle) * pull * 20

        setOffset({ x: newX, y: newY })
      }
    }

    const handleMouseLeave = () => {
      setOffset({ x: 0, y: 0 })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translate(${offset.x}px, ${offset.y}px)`
      ref.current.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }
  }, [offset])

  return { ref, offset }
}

/**
 * Hook for 3D tilt effect
 */
export function useTiltEffect(maxTilt = 25) {
  const ref = useRef<HTMLElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const xPercent = (x / rect.width) * 2 - 1
      const yPercent = (y / rect.height) * 2 - 1

      setRotation({
        x: yPercent * maxTilt * -1,
        y: xPercent * maxTilt,
      })
    }

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [maxTilt])

  return {
    ref,
    style: {
      transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      transition: 'transform 0.1s ease-out',
    },
  }
}
