import { useEffect, useRef, useState } from 'react'

/**
 * Hook for triggering animations when an element enters the viewport
 * Uses Intersection Observer API with animation triggered only once per element
 *
 * @param options - Intersection Observer options
 * @param animationClass - CSS class to apply when visible
 * @returns ref - React ref to attach to element
 */
export const useScrollAnimation = (
  options?: IntersectionObserverInit,
  animationClass: string = 'is-visible'
) => {
  const ref = useRef<HTMLElement>(null)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || isAnimated) return

    const defaultOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
      ...options
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isAnimated) {
        entry.target.classList.add(animationClass)
        setIsAnimated(true)
        observer.unobserve(element)
      }
    }, defaultOptions)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [isAnimated, animationClass])

  return ref
}

/**
 * Hook for animating multiple child elements with stagger effect
 * Each child gets animated in sequence with delay
 *
 * @param options - Intersection Observer options
 * @returns ref - React ref to attach to parent container
 */
export const useScrollAnimationStagger = (
  options?: IntersectionObserverInit
) => {
  const ref = useRef<HTMLElement>(null)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || isAnimated) return

    const defaultOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
      ...options
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isAnimated) {
        entry.target.classList.add('is-visible')
        setIsAnimated(true)
        observer.unobserve(element)
      }
    }, defaultOptions)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [isAnimated])

  return ref
}

/**
 * Hook for batch animating multiple elements with custom delays
 * Useful for grid layouts or card collections
 *
 * @param itemCount - Number of items to animate
 * @param delayMs - Delay between each item animation (default: 100ms)
 * @param options - Intersection Observer options
 * @returns ref - React ref to attach to parent container
 */
export const useScrollAnimationBatch = (
  itemCount: number = 0,
  delayMs: number = 100,
  options?: IntersectionObserverInit
) => {
  const ref = useRef<HTMLElement>(null)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || isAnimated) return

    const defaultOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
      ...options
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isAnimated) {
        const children = element.querySelectorAll('[data-animate-item]')
        children.forEach((child, index) => {
          const delay = index * delayMs
          setTimeout(() => {
            child.classList.add('is-visible')
          }, delay)
        })
        setIsAnimated(true)
        observer.unobserve(element)
      }
    }, defaultOptions)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [isAnimated, itemCount, delayMs])

  return ref
}

/**
 * Hook for custom animation timing and configuration
 * Allows granular control over animation behavior
 *
 * @param config - Custom animation configuration
 * @returns ref - React ref to attach to element
 */
interface AnimationConfig {
  threshold?: number | number[]
  rootMargin?: string
  animationClass?: string
  onVisible?: (element: HTMLElement) => void
  triggerOnce?: boolean
}

export const useCustomScrollAnimation = (config: AnimationConfig) => {
  const ref = useRef<HTMLElement>(null)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || (config.triggerOnce && isAnimated)) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const targetElement = entry.target as HTMLElement
        if (config.animationClass) {
          targetElement.classList.add(config.animationClass)
        }
        if (config.onVisible) {
          config.onVisible(targetElement)
        }
        setIsAnimated(true)

        if (config.triggerOnce !== false) {
          observer.unobserve(element)
        }
      } else {
        // Reset animation if not triggering once
        if (!config.triggerOnce) {
          const targetElement = entry.target as HTMLElement
          if (config.animationClass) {
            targetElement.classList.remove(config.animationClass)
          }
          setIsAnimated(false)
        }
      }
    }, {
      threshold: config.threshold || 0.1,
      rootMargin: config.rootMargin || '0px 0px -100px 0px'
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [config, isAnimated])

  return ref
}

/**
 * Hook to get observer status without applying animations
 * Useful for triggering custom logic on viewport entry
 *
 * @param options - Intersection Observer options
 * @returns isVisible - Boolean state indicating if element is in viewport
 */
export const useViewportDetection = (
  options?: IntersectionObserverInit
) => {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const defaultOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
      ...options
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, defaultOptions)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return { ref, isVisible }
}
