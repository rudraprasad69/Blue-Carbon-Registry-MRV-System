'use client'

import { useState } from 'react'
import { AnimatedSection, AnimatedContainer, AnimatedGrid } from '@/components/AnimatedSection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ScrollAnimationsDemo() {
  const [codeView, setCodeView] = useState<'jsx' | 'html' | 'css'>('jsx')

  const examples = [
    {
      title: 'Basic Fade-In & Slide Up',
      description: 'Simple animation that triggers once on scroll',
      variant: 'default' as const,
      code: `<AnimatedSection>
  <h2>Animated Content</h2>
  <p>This fades in and slides up from below</p>
</AnimatedSection>`
    },
    {
      title: 'Fast Animation',
      description: 'Quicker animation with less distance',
      variant: 'fast' as const,
      code: `<AnimatedSection variant="fast">
  <p>Faster animation variant</p>
</AnimatedSection>`
    },
    {
      title: 'With Scale Effect',
      description: 'Combines slide, fade, and scale effects',
      variant: 'with-scale' as const,
      code: `<AnimatedSection variant="with-scale">
  <p>Animated with scale effect</p>
</AnimatedSection>`
    },
    {
      title: 'Staggered Container',
      description: 'Children animate in sequence',
      variant: 'default' as const,
      code: `<AnimatedContainer>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</AnimatedContainer>`
    }
  ]

  const gridItems = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Grid Item ${i + 1}`,
    value: Math.floor(Math.random() * 100)
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <AnimatedSection as="section" className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Scroll Animation System
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            Smooth fade-in and upward slide animations
          </p>
          <p className="text-slate-400">
            Scroll down to see animations in action
          </p>
        </div>
      </AnimatedSection>

      {/* Feature Cards */}
      <AnimatedSection as="section" className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Key Features
          </h2>

          <AnimatedContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: '✨',
                title: 'Smooth Animations',
                desc: 'Fade-in + upward slide'
              },
              {
                icon: '👁️',
                title: 'Viewport Detection',
                desc: 'Intersection Observer API'
              },
              {
                icon: '⚡',
                title: 'Trigger Once',
                desc: 'Efficient performance'
              },
              {
                icon: '♿',
                title: 'Accessible',
                desc: 'Respects prefers-reduced-motion'
              }
            ].map((feature) => (
              <Card key={feature.title} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </AnimatedContainer>
        </div>
      </AnimatedSection>

      {/* Animation Variants */}
      <AnimatedSection as="section" className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Animation Variants
          </h2>

          <div className="space-y-8">
            {examples.map((example) => (
              <AnimatedSection key={example.title} as="div">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">{example.title}</CardTitle>
                    <CardDescription>{example.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Preview */}
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 bg-slate-900/50">
                      <AnimatedSection variant={example.variant} className="text-center">
                        <div className="inline-block bg-emerald-600/20 border border-emerald-500 rounded-lg px-6 py-4">
                          <p className="text-white font-semibold">
                            Preview: {example.title}
                          </p>
                        </div>
                      </AnimatedSection>
                    </div>

                    {/* Code */}
                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto">
                      <pre>{example.code}</pre>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Grid Animation Example */}
      <AnimatedSection as="section" className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Animated Grid
          </h2>
          <p className="text-center text-slate-400 mb-8">
            Each item animates in sequence with 100ms delay
          </p>

          <AnimatedGrid columns={4} gap="1rem" itemDelay={100}>
            {gridItems.map((item) => (
              <div key={item.id} data-grid-item>
                <Card className="bg-slate-800 border-slate-700 h-full">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-emerald-400 mb-2">
                        {item.value}%
                      </p>
                      <p className="text-slate-400 text-sm">{item.title}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </AnimatedGrid>
        </div>
      </AnimatedSection>

      {/* Code Examples */}
      <AnimatedSection as="section" className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Usage Examples
          </h2>

          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="bg-slate-800 border border-slate-700">
              <TabsTrigger value="basic">Basic Component</TabsTrigger>
              <TabsTrigger value="container">Container</TabsTrigger>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="hook">Using Hooks</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">AnimatedSection Component</CardTitle>
                  <CardDescription>
                    Simplest way to add animations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 rounded-lg p-4 text-slate-300 font-mono text-sm overflow-x-auto">
{`import { AnimatedSection } from '@/components/AnimatedSection'

export default function Page() {
  return (
    <AnimatedSection variant="with-scale">
      <h1>Welcome</h1>
      <p>This animates on scroll</p>
    </AnimatedSection>
  )
}`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="container">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">AnimatedContainer Component</CardTitle>
                  <CardDescription>
                    Staggered animation for children
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 rounded-lg p-4 text-slate-300 font-mono text-sm overflow-x-auto">
{`import { AnimatedContainer } from '@/components/AnimatedSection'

export default function CardGrid() {
  return (
    <AnimatedContainer>
      <Card>Item 1</Card>
      <Card>Item 2</Card>
      <Card>Item 3</Card>
    </AnimatedContainer>
  )
}`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grid">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">AnimatedGrid Component</CardTitle>
                  <CardDescription>
                    Grid layout with staggered item animations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 rounded-lg p-4 text-slate-300 font-mono text-sm overflow-x-auto">
{`import { AnimatedGrid } from '@/components/AnimatedSection'

export default function Dashboard() {
  return (
    <AnimatedGrid columns={4} gap="2rem" itemDelay={150}>
      {items.map(item => (
        <div key={item.id} data-grid-item>
          {item.content}
        </div>
      ))}
    </AnimatedGrid>
  )
}`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hook">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">useScrollAnimation Hook</CardTitle>
                  <CardDescription>
                    Programmatic control over animations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 rounded-lg p-4 text-slate-300 font-mono text-sm overflow-x-auto">
{`import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function Component() {
  const ref = useScrollAnimation()

  return (
    <div ref={ref} className="animate-on-scroll">
      <h2>Animated with hook</h2>
    </div>
  )
}`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AnimatedSection>

      {/* Performance Section */}
      <AnimatedSection as="section" className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Performance Benefits
          </h2>

          <AnimatedContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Efficient API',
                items: [
                  'Native Intersection Observer',
                  'Single observer per element',
                  'Automatic cleanup',
                  'No memory leaks'
                ]
              },
              {
                title: 'Optimized Rendering',
                items: [
                  'Trigger once per section',
                  'CSS animations (GPU accelerated)',
                  'Minimal repaints',
                  'Smooth 60fps performance'
                ]
              },
              {
                title: 'Accessibility First',
                items: [
                  'Respects prefers-reduced-motion',
                  'No blocking animations',
                  'Keyboard accessible',
                  'Screen reader friendly'
                ]
              }
            ].map((section) => (
              <Card key={section.title} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start">
                        <span className="text-emerald-400 mr-3">✓</span>
                        <span className="text-slate-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </AnimatedContainer>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <AnimatedSection as="footer" className="py-16 px-4 md:px-8 border-t border-slate-700">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Add Animations?
          </h3>
          <p className="text-slate-300 mb-8">
            Import components and wrap your sections with AnimatedSection
          </p>
          <div className="bg-slate-800 rounded-lg p-6 inline-block border border-slate-700">
            <pre className="text-slate-300 font-mono text-sm">
{`import { AnimatedSection } from '@/components/AnimatedSection'
import '@/styles/animations.css'`}
            </pre>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
