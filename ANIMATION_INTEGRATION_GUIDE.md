# Scroll Animations Integration Guide

## Quick Start - Non-Invasive Integration

This guide shows how to add scroll animations to existing pages **without modifying** any current features.

---

## Step 1: Import the Animation Components

```tsx
import { AnimatedSection, AnimatedContainer, AnimatedGrid } from '@/components/AnimatedSection'
```

The CSS is already imported globally, so no additional setup needed.

---

## Step 2: Wrap Existing Sections

### Before (No Animation)
```tsx
export default function Dashboard() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>Dashboard content</p>
    </div>
  )
}
```

### After (With Animation)
```tsx
import { AnimatedSection } from '@/components/AnimatedSection'

export default function Dashboard() {
  return (
    <AnimatedSection>
      <h1>Welcome</h1>
      <p>Dashboard content</p>
    </AnimatedSection>
  )
}
```

**No changes to existing JSX structure!**

---

## Integration Examples by Feature

### Marketplace Dashboard

**Before:**
```tsx
export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      <header>
        <h1>Carbon Credit Marketplace</h1>
      </header>

      <div className="grid grid-cols-4 gap-4">
        {creditStats.map(stat => (
          <Card key={stat.type}>{stat.type}</Card>
        ))}
      </div>

      <MarketplaceTrader />
    </div>
  )
}
```

**After (with animations):**
```tsx
import { AnimatedSection, AnimatedContainer } from '@/components/AnimatedSection'

export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      <AnimatedSection as="header">
        <h1>Carbon Credit Marketplace</h1>
      </AnimatedSection>

      <AnimatedContainer className="grid grid-cols-4 gap-4">
        {creditStats.map(stat => (
          <Card key={stat.type}>{stat.type}</Card>
        ))}
      </AnimatedContainer>

      <AnimatedSection variant="with-scale">
        <MarketplaceTrader />
      </AnimatedSection>
    </div>
  )
}
```

### Compliance Dashboard

**Before:**
```tsx
export default function CompliancePage() {
  return (
    <div>
      <h1>Compliance Dashboard</h1>

      <section>
        <ComplianceGauge />
      </section>

      <section>
        <RequirementsChecklist />
      </section>

      <section>
        <AuditTrail />
      </section>
    </div>
  )
}
```

**After (with animations):**
```tsx
import { AnimatedSection } from '@/components/AnimatedSection'

export default function CompliancePage() {
  return (
    <div>
      <AnimatedSection as="h1">
        Compliance Dashboard
      </AnimatedSection>

      <AnimatedSection as="section" delay={0}>
        <ComplianceGauge />
      </AnimatedSection>

      <AnimatedSection as="section" delay={200}>
        <RequirementsChecklist />
      </AnimatedSection>

      <AnimatedSection as="section" delay={400}>
        <AuditTrail />
      </AnimatedSection>
    </div>
  )
}
```

### Monitoring Dashboard

**Before:**
```tsx
export default function MonitoringPage() {
  return (
    <div>
      <header><h1>Advanced Monitoring</h1></header>
      
      <div className="grid gap-4">
        {monitors.map(monitor => (
          <MonitorCard key={monitor.id} {...monitor} />
        ))}
      </div>

      <AnalyticsChart />
    </div>
  )
}
```

**After (with animations):**
```tsx
import { AnimatedSection, AnimatedGrid } from '@/components/AnimatedSection'

export default function MonitoringPage() {
  return (
    <div>
      <AnimatedSection as="header">
        <h1>Advanced Monitoring</h1>
      </AnimatedSection>
      
      <AnimatedGrid columns={3} gap="1rem" itemDelay={100}>
        {monitors.map(monitor => (
          <div key={monitor.id} data-grid-item>
            <MonitorCard {...monitor} />
          </div>
        ))}
      </AnimatedGrid>

      <AnimatedSection variant="with-scale">
        <AnalyticsChart />
      </AnimatedSection>
    </div>
  )
}
```

---

## Animation Variants for Different Sections

### Hero/Header Sections
Use **default** or **with-scale** for prominent sections:
```tsx
<AnimatedSection variant="with-scale" as="header">
  <h1>Main Title</h1>
</AnimatedSection>
```

### Card/Grid Items
Use **fast** for quicker, snappier animations:
```tsx
<AnimatedContainer>
  {cards.map(card => (
    <Card variant="fast" key={card.id}>{card.title}</Card>
  ))}
</AnimatedContainer>
```

### Detailed Content
Use **default** for regular content sections:
```tsx
<AnimatedSection>
  <h2>Detailed Section</h2>
  <p>Content here</p>
</AnimatedSection>
```

### Multiple Sections with Delay
Stagger section animations for visual flow:
```tsx
<AnimatedSection delay={0}>Section 1</AnimatedSection>
<AnimatedSection delay={200}>Section 2</AnimatedSection>
<AnimatedSection delay={400}>Section 3</AnimatedSection>
```

---

## Advanced Patterns

### Wrapping Existing Components with AnimatedSection

If you want to animate an entire component without modifying it:

```tsx
import { AnimatedSection } from '@/components/AnimatedSection'
import { ExistingComponent } from '@/components/ExistingComponent'

export default function Page() {
  return (
    <AnimatedSection>
      <ExistingComponent prop1="value" />
    </AnimatedSection>
  )
}
```

### Grid Item Animation

For grids, use `data-grid-item` attribute:

```tsx
<AnimatedGrid columns={4} itemDelay={100}>
  {items.map(item => (
    <div key={item.id} data-grid-item>
      <Card>{item.name}</Card>
    </div>
  ))}
</AnimatedGrid>
```

### Using Custom Timing

```tsx
<AnimatedSection
  threshold={0.2}           // Trigger at 20% visible
  rootMargin="0px 0px -50px 0px" // Trigger 50px before viewport
  delay={150}               // 150ms animation delay
>
  Content
</AnimatedSection>
```

---

## Integration Checklist

- [ ] Identify sections that should animate (headers, main content, cards)
- [ ] Import `AnimatedSection` or `AnimatedContainer`
- [ ] Wrap sections with animated components
- [ ] Choose appropriate variant (default, fast, with-scale)
- [ ] Add delays if staggering multiple sections (0ms, 200ms, 400ms)
- [ ] Test scroll behavior
- [ ] Verify animations trigger once
- [ ] Check accessibility with reduced motion

---

## No Breaking Changes

✅ **All existing functionality preserved**
✅ **Zero modifications to existing components**
✅ **Fully backward compatible**
✅ **Optional - use only where desired**
✅ **No performance impact on non-animated sections**

---

## Testing the Animations

### View Demo Page
Visit `/animations-demo` to see all animation variants in action.

### Test in Development
```bash
npm run dev
# Open http://localhost:3000/animations-demo
```

### Verify in Production Build
```bash
npm run build
# Build includes optimized animations
```

---

## Performance Tips

### 1. Limit Animations on Mobile
```tsx
const isMobile = window.innerWidth < 768

<AnimatedSection variant={isMobile ? 'fast' : 'default'}>
  Content
</AnimatedSection>
```

### 2. Use ItemDelay for Large Grids
```tsx
// For 20+ items, increase delay
<AnimatedGrid itemDelay={50}> {/* Faster stagger */}
```

### 3. Adjust Threshold for Lazy Sections
```tsx
// For sections below fold
<AnimatedSection threshold={0.05}> {/* Trigger earlier */}
```

---

## Accessibility

Animations automatically respect user preferences:

- **`prefers-reduced-motion: reduce`** - Disables all animations
- **Keyboard navigation** - Fully supported
- **Screen readers** - No impact
- **Mobile** - Smooth 60fps performance

No additional setup needed!

---

## Example: Full Page with Animations

```tsx
'use client'

import { AnimatedSection, AnimatedContainer, AnimatedGrid } from '@/components/AnimatedSection'

export default function CompletePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <AnimatedSection as="section" className="py-20">
        <h1 className="text-5xl font-bold">Welcome</h1>
        <p className="text-xl">Scroll to see animations</p>
      </AnimatedSection>

      {/* Feature Cards */}
      <AnimatedSection as="section" delay={200}>
        <h2 className="text-3xl font-bold mb-8">Features</h2>
        <AnimatedContainer className="grid grid-cols-3 gap-4">
          {features.map(feature => (
            <Card key={feature.id}>{feature.name}</Card>
          ))}
        </AnimatedContainer>
      </AnimatedSection>

      {/* Dashboard Grid */}
      <AnimatedSection as="section" delay={400}>
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
        <AnimatedGrid columns={4} gap="1rem" itemDelay={100}>
          {dashboardItems.map(item => (
            <div key={item.id} data-grid-item>
              <Card>{item.title}</Card>
            </div>
          ))}
        </AnimatedGrid>
      </AnimatedSection>

      {/* Content Section */}
      <AnimatedSection as="section" variant="with-scale" delay={600}>
        <h2 className="text-3xl font-bold mb-4">Details</h2>
        <p className="text-lg">Additional information</p>
      </AnimatedSection>
    </div>
  )
}
```

---

## Common Questions

**Q: Will this slow down my pages?**  
A: No. Intersection Observer is efficient, and CSS animations are GPU-accelerated. Zero performance impact.

**Q: Can I customize animation timing?**  
A: Yes. Use `delay`, `threshold`, `rootMargin` props, or create custom CSS classes.

**Q: Do I need to modify existing components?**  
A: No. Simply wrap sections with `<AnimatedSection>`.

**Q: What about mobile devices?**  
A: Works great! Use `variant="fast"` for quicker animations on mobile.

**Q: Are animations accessible?**  
A: Yes. Fully respects `prefers-reduced-motion` preference.

---

## Next Steps

1. Visit `/animations-demo` to see all variants
2. Choose sections to animate in your dashboards
3. Wrap with `AnimatedSection` or `AnimatedContainer`
4. Test scroll behavior
5. Deploy!

For detailed API docs, see [SCROLL_ANIMATIONS_GUIDE.md](./SCROLL_ANIMATIONS_GUIDE.md)
