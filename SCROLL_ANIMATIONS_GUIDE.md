# Scroll Animation System Documentation

## Overview

The scroll animation system provides smooth fade-in and upward slide animations for page sections as they enter the viewport. Built with the Intersection Observer API, animations trigger only once per section and respect user accessibility preferences.

---

## Features

✅ **Fade-in + Upward Slide** - Smooth entrance animations  
✅ **Intersection Observer** - Efficient viewport detection  
✅ **Trigger Once** - Animations play only on first viewport entry  
✅ **Stagger Effect** - Sequential child animations  
✅ **Multiple Variants** - Default, fast, with-scale options  
✅ **Accessibility** - Respects `prefers-reduced-motion`  
✅ **Zero Configuration** - Works out-of-the-box  
✅ **TypeScript Support** - Full type safety  

---

## Installation

### 1. Import CSS Animations
```tsx
import '@/styles/animations.css'
```

### 2. Import Components or Hooks
```tsx
// Components
import { AnimatedSection, AnimatedContainer, AnimatedGrid } from '@/components/AnimatedSection'

// Hooks
import { useScrollAnimation, useScrollAnimationStagger } from '@/hooks/useScrollAnimation'
```

---

## Usage Examples

### Basic Animated Section

```tsx
import { AnimatedSection } from '@/components/AnimatedSection'

export default function Page() {
  return (
    <div>
      <AnimatedSection>
        <h1>Welcome to Our Platform</h1>
        <p>This section fades in and slides up when scrolled into view</p>
      </AnimatedSection>

      <AnimatedSection variant="fast">
        <p>This section uses a faster animation</p>
      </AnimatedSection>

      <AnimatedSection variant="with-scale">
        <p>This section adds a slight scale effect</p>
      </AnimatedSection>
    </div>
  )
}
```

### Animated Container with Stagger

```tsx
import { AnimatedContainer } from '@/components/AnimatedSection'

export default function CardGrid() {
  return (
    <AnimatedContainer>
      <Card>Feature 1</Card>
      <Card>Feature 2</Card>
      <Card>Feature 3</Card>
    </AnimatedContainer>
  )
}
```

Each card animates in sequence with 100ms delay between them.

### Animated Grid Layout

```tsx
import { AnimatedGrid } from '@/components/AnimatedSection'

export default function Dashboard() {
  return (
    <AnimatedGrid columns={4} gap="2rem" itemDelay={150}>
      <div data-grid-item>Card 1</div>
      <div data-grid-item>Card 2</div>
      <div data-grid-item>Card 3</div>
      <div data-grid-item>Card 4</div>
    </AnimatedGrid>
  )
}
```

### Using Hooks

```tsx
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function Component() {
  const ref = useScrollAnimation()

  return (
    <div ref={ref} className="animate-on-scroll">
      <h2>Content animated with hook</h2>
    </div>
  )
}
```

### Stagger Animation Hook

```tsx
import { useScrollAnimationStagger } from '@/hooks/useScrollAnimation'

export default function List() {
  const ref = useScrollAnimationStagger()

  return (
    <ul ref={ref} className="animate-stagger-children">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  )
}
```

### Custom Animation Configuration

```tsx
import { useCustomScrollAnimation } from '@/hooks/useScrollAnimation'

export default function CustomAnimation() {
  const ref = useCustomScrollAnimation({
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px',
    animationClass: 'animate-on-scroll',
    triggerOnce: true,
    onVisible: (element) => {
      console.log('Element is visible!', element)
    }
  })

  return <div ref={ref} className="animate-on-scroll">Animated content</div>
}
```

### Viewport Detection Without Animation

```tsx
import { useViewportDetection } from '@/hooks/useScrollAnimation'

export default function ConditionalRender() {
  const { ref, isVisible } = useViewportDetection()

  return (
    <div ref={ref}>
      {isVisible && <ExpensiveComponent />}
    </div>
  )
}
```

---

## Animation Variants

### Default
- Duration: 0.8s
- Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- Transform: translateY(40px) fade-in

```tsx
<AnimatedSection>Content</AnimatedSection>
```

### Fast
- Duration: 0.6s
- Lighter upward movement (30px)
- Faster easing

```tsx
<AnimatedSection variant="fast">Content</AnimatedSection>
```

### With Scale
- Duration: 0.8s
- Combines fade-in, slide-up, and scale (0.95 → 1)
- Smooth easing

```tsx
<AnimatedSection variant="with-scale">Content</AnimatedSection>
```

### Gentle
- Same as "fast" but labeled for semantic clarity

```tsx
<AnimatedSection variant="gentle">Content</AnimatedSection>
```

---

## CSS Classes

### Direct CSS Class Usage

```tsx
// Apply animation directly
<div className="animate-fade-in-up">Animated</div>

// With delay
<div className="animate-fade-in-up animate-delay-200">Delayed animation</div>

// On scroll (with intersection observer)
<div className="animate-on-scroll">Will animate on scroll</div>

// Staggered children
<div className="animate-stagger-children">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### CSS Class Reference

| Class | Effect |
|-------|--------|
| `animate-fade-in-up` | Fade-in + upward slide (0.8s) |
| `animate-fade-in-up-fast` | Fade-in + upward slide (0.6s) |
| `animate-fade-in-up-scale` | With scale effect (0.8s) |
| `animate-on-scroll` | Ready for intersection observer |
| `animate-on-scroll.is-visible` | Triggered animation |
| `animate-stagger-children` | Parent for staggered child animation |
| `animate-delay-100` | 100ms delay |
| `animate-delay-200` | 200ms delay |
| `animate-delay-300` | 300ms delay |
| `animate-delay-400` | 400ms delay |
| `animate-delay-500` | 500ms delay |

---

## Component Props

### AnimatedSection

```typescript
interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'fast' | 'with-scale' | 'gentle'
  threshold?: number // Intersection Observer threshold (0-1)
  rootMargin?: string // Intersection Observer rootMargin
  delay?: number // Animation delay in ms
  as?: keyof JSX.IntrinsicElements // HTML element type
}
```

**Example:**
```tsx
<AnimatedSection
  variant="with-scale"
  threshold={0.2}
  delay={100}
  as="section"
  className="my-custom-class"
>
  Content
</AnimatedSection>
```

### AnimatedContainer

```typescript
interface AnimatedContainerProps {
  children: ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  delay?: number
  as?: keyof JSX.IntrinsicElements
}
```

**Example:**
```tsx
<AnimatedContainer
  as="div"
  className="flex gap-4"
>
  <Card>1</Card>
  <Card>2</Card>
  <Card>3</Card>
</AnimatedContainer>
```

### AnimatedGrid

```typescript
interface AnimatedGridProps {
  children: ReactNode
  className?: string
  columns?: number // Auto-fit grid columns
  gap?: string // CSS gap value
  threshold?: number
  rootMargin?: string
  itemDelay?: number // Delay between items
  as?: keyof JSX.IntrinsicElements
}
```

**Example:**
```tsx
<AnimatedGrid
  columns={4}
  gap="2rem"
  itemDelay={150}
>
  <div data-grid-item>1</div>
  <div data-grid-item>2</div>
  <div data-grid-item>3</div>
</AnimatedGrid>
```

---

## Hook Reference

### useScrollAnimation

Attaches animation to an element, triggers once on viewport entry.

```typescript
const ref = useScrollAnimation(
  options?: IntersectionObserverInit,
  animationClass?: string
)
```

**Options:**
- `threshold`: 0-1 or [0-1] array (default: 0.1)
- `rootMargin`: CSS margin string (default: '0px 0px -100px 0px')
- `animationClass`: CSS class to apply (default: 'is-visible')

### useScrollAnimationStagger

Animates children elements with stagger effect.

```typescript
const ref = useScrollAnimationStagger(
  options?: IntersectionObserverInit
)
```

### useScrollAnimationBatch

Batch animates multiple elements with custom delays.

```typescript
const ref = useScrollAnimationBatch(
  itemCount?: number,
  delayMs?: number,
  options?: IntersectionObserverInit
)
```

### useCustomScrollAnimation

Full control over animation configuration.

```typescript
const ref = useCustomScrollAnimation(config: {
  threshold?: number | number[]
  rootMargin?: string
  animationClass?: string
  onVisible?: (element: HTMLElement) => void
  triggerOnce?: boolean
})
```

### useViewportDetection

Detect viewport visibility without animations.

```typescript
const { ref, isVisible } = useViewportDetection(
  options?: IntersectionObserverInit
)
```

---

## Real-World Examples

### Marketplace Dashboard with Animations

```tsx
import { AnimatedSection, AnimatedContainer } from '@/components/AnimatedSection'
import { Card } from '@/components/ui/card'

export default function MarketplaceGrid() {
  return (
    <div>
      <AnimatedSection as="header" className="mb-8">
        <h1>Carbon Credit Marketplace</h1>
        <p>Discover verified carbon projects</p>
      </AnimatedSection>

      <AnimatedGrid columns={3} gap="2rem" itemDelay={100}>
        {projects.map(project => (
          <div key={project.id} data-grid-item>
            <Card>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </Card>
          </div>
        ))}
      </AnimatedGrid>

      <AnimatedSection variant="with-scale" className="mt-12">
        <section className="footer">
          <p>Footer content animates in after grid</p>
        </section>
      </AnimatedSection>
    </div>
  )
}
```

### Dashboard with Feature Cards

```tsx
import { AnimatedContainer } from '@/components/AnimatedSection'
import { Card } from '@/components/ui/card'

const features = [
  { title: 'Real-time Monitoring', icon: '📊' },
  { title: 'AI Analytics', icon: '🤖' },
  { title: 'Compliance Tracking', icon: '✓' },
  { title: 'Market Intelligence', icon: '📈' }
]

export default function Features() {
  return (
    <AnimatedContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {features.map(feature => (
        <Card key={feature.title} className="p-6">
          <span className="text-4xl">{feature.icon}</span>
          <h3>{feature.title}</h3>
        </Card>
      ))}
    </AnimatedContainer>
  )
}
```

### Compliance Dashboard

```tsx
import { AnimatedSection } from '@/components/AnimatedSection'

export default function CompliancePage() {
  return (
    <div className="space-y-8">
      <AnimatedSection as="header">
        <h1>Compliance Dashboard</h1>
      </AnimatedSection>

      <AnimatedSection variant="fast" as="section">
        <ComplianceGauge />
      </AnimatedSection>

      <AnimatedSection variant="with-scale" as="section" delay={200}>
        <RequirementsChecklist />
      </AnimatedSection>

      <AnimatedSection as="section" delay={400}>
        <AuditTrail />
      </AnimatedSection>
    </div>
  )
}
```

---

## Performance Considerations

### Intersection Observer Benefits
- Efficient: Native browser API
- Single observer per hook instance
- Automatically cleans up on unmount
- No memory leaks

### Best Practices

1. **Use `threshold` wisely**
   ```tsx
   threshold={0.1} // Triggers when 10% visible (default)
   threshold={0.5} // Triggers when 50% visible
   ```

2. **Adjust `rootMargin` for timing**
   ```tsx
   rootMargin="0px 0px -100px 0px" // Trigger 100px before entering
   ```

3. **Limit animations on mobile**
   ```tsx
   const isMobile = window.innerWidth < 768
   <AnimatedSection variant={isMobile ? 'fast' : 'default'}>
   ```

4. **Use `itemDelay` for grid layouts**
   ```tsx
   <AnimatedGrid itemDelay={100}> // 100ms between items
   ```

---

## Accessibility

The animation system includes built-in accessibility support:

### prefers-reduced-motion
Users who prefer reduced motion will see:
- No animations
- Instant opacity: 1
- No transforms
- Full accessibility maintained

```css
@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

## Troubleshooting

### Animation Not Triggering

**Check:**
1. Import CSS: `import '@/styles/animations.css'`
2. Element is in viewport: Lower `rootMargin` value
3. Threshold value: Try `threshold={0.05}`

```tsx
<AnimatedSection rootMargin="0px 0px -50px 0px" threshold={0.05}>
```

### Animation Triggers Multiple Times

**Solution:** Ensure `triggerOnce` is set (default is true)

```tsx
const ref = useCustomScrollAnimation({
  triggerOnce: true // Default behavior
})
```

### Performance Issues

**Reduce animations:**
```tsx
// Use fast variant
<AnimatedSection variant="fast">

// Increase delay threshold
<AnimatedGrid itemDelay={200}>

// Lower animation count
<AnimatedContainer>
  {items.slice(0, 10)} {/* Limit items */}
</AnimatedContainer>
```

---

## Browser Support

- ✅ Chrome 51+
- ✅ Firefox 55+
- ✅ Safari 12.1+
- ✅ Edge 16+
- ✅ All modern mobile browsers

Intersection Observer API is widely supported. Graceful degradation for older browsers (animations won't trigger but content remains visible).

---

## API Reference

See `useScrollAnimation.ts` for complete hook documentation with JSDoc comments.

See `styles/animations.css` for all keyframe definitions and CSS variables.

See `components/AnimatedSection.tsx` for component implementations.
