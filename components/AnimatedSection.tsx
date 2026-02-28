import React, { ReactNode } from 'react'
import { useScrollAnimation, useScrollAnimationStagger, useCustomScrollAnimation, AnimationConfig } from '@/hooks/useScrollAnimation'
import '@/styles/animations.css'

/**
 * AnimatedSection Component
 * Wraps content with automatic fade-in-up animation on scroll
 *
 * @example
 * <AnimatedSection>
 *   <h1>Welcome</h1>
 *   <p>This section animates in</p>
 * </AnimatedSection>
 */
interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'fast' | 'with-scale' | 'gentle'
  threshold?: number
  rootMargin?: string
  delay?: number
  as?: keyof JSX.IntrinsicElements
}

export const AnimatedSection = React.forwardRef<
  HTMLElement,
  AnimatedSectionProps
>(({
  children,
  className = '',
  variant = 'default',
  threshold = 0.1,
  rootMargin = '0px 0px -100px 0px',
  delay = 0,
  as: Component = 'div'
}, ref) => {
  const defaultRef = React.useRef<HTMLElement>(null)
  const elementRef = (ref || defaultRef) as React.RefObject<HTMLElement>

  React.useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            const animationClass = variant === 'default' 
              ? 'animate-on-scroll' 
              : `animate-on-scroll ${variant}`
            entry.target.classList.add(animationClass, 'is-visible')
          }, delay)
          observer.unobserve(element)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [variant, delay, threshold, rootMargin])

  const variantClasses = {
    default: 'animate-on-scroll',
    fast: 'animate-on-scroll gentle',
    'with-scale': 'animate-on-scroll with-scale',
    gentle: 'animate-on-scroll gentle'
  }

  return React.createElement(
    Component as any,
    {
      ref: elementRef,
      className: `${variantClasses[variant]} ${className}`,
      style: delay > 0 ? { animationDelay: `${delay}ms` } : undefined
    },
    children
  )
})

AnimatedSection.displayName = 'AnimatedSection'

/**
 * AnimatedContainer Component
 * Animates child elements with stagger effect
 *
 * @example
 * <AnimatedContainer>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </AnimatedContainer>
 */
interface AnimatedContainerProps {
  children: ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  delay?: number
  as?: keyof JSX.IntrinsicElements
}

export const AnimatedContainer = React.forwardRef<
  HTMLElement,
  AnimatedContainerProps
>(({
  children,
  className = '',
  threshold = 0.1,
  rootMargin = '0px 0px -100px 0px',
  delay = 0,
  as: Component = 'div'
}, ref) => {
  const defaultRef = React.useRef<HTMLElement>(null)
  const elementRef = (ref || defaultRef) as React.RefObject<HTMLElement>

  React.useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate-stagger-children', 'is-visible')
          }, delay)
          observer.unobserve(element)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [delay, threshold, rootMargin])

  return React.createElement(
    Component as any,
    {
      ref: elementRef,
      className: `animate-stagger-children ${className}`,
      style: delay > 0 ? { animationDelay: `${delay}ms` } : undefined
    },
    children
  )
})

AnimatedContainer.displayName = 'AnimatedContainer'

/**
 * AnimatedGrid Component
 * Animates grid items with individual delays
 *
 * @example
 * <AnimatedGrid columns={3}>
 *   <GridItem>1</GridItem>
 *   <GridItem>2</GridItem>
 *   <GridItem>3</GridItem>
 * </AnimatedGrid>
 */
interface AnimatedGridProps {
  children: ReactNode
  className?: string
  columns?: number
  gap?: string
  threshold?: number
  rootMargin?: string
  itemDelay?: number
  as?: keyof JSX.IntrinsicElements
}

export const AnimatedGrid = React.forwardRef<
  HTMLElement,
  AnimatedGridProps
>(({
  children,
  className = '',
  columns = 3,
  gap = '1rem',
  threshold = 0.1,
  rootMargin = '0px 0px -100px 0px',
  itemDelay = 100,
  as: Component = 'div'
}, ref) => {
  const defaultRef = React.useRef<HTMLElement>(null)
  const elementRef = (ref || defaultRef) as React.RefObject<HTMLElement>

  React.useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('[data-grid-item]')
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('animate-on-scroll', 'is-visible')
            }, index * itemDelay)
          })
          observer.unobserve(element)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [itemDelay, threshold, rootMargin])

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
    gap: gap
  } as React.CSSProperties

  return React.createElement(
    Component as any,
    {
      ref: elementRef,
      className: className,
      style: gridStyle
    },
    React.Children.map(children, (child) =>
      React.isValidElement(child)
        ? React.cloneElement(child as React.ReactElement<any>, {
            'data-grid-item': true,
            className: `${child.props.className || ''} animate-on-scroll`
          })
        : child
    )
  )
})

AnimatedGrid.displayName = 'AnimatedGrid'

/**
 * useAnimatedElement Hook Component
 * For programmatic animation control
 *
 * @example
 * const MyComponent = () => {
 *   const ref = useAnimatedElement()
 *   return <div ref={ref}>Content</div>
 * }
 */
export const useAnimatedElement = (config?: AnimationConfig) => {
  return useCustomScrollAnimation({
    animationClass: 'animate-on-scroll',
    triggerOnce: true,
    ...config
  })
}
