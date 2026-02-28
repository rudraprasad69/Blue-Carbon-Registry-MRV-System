'use client'

import React, { useState } from 'react'
import {
  InteractiveCard,
  GlowingButton,
  AnimatedHeading,
  InteractiveSection,
  GlowText,
  VibrantBadge,
  FloatingElement,
  HighlightBox,
  AnimatedDivider,
  InteractiveProgressBar,
} from '@/components/InteractiveComponents'

export default function InteractiveEffectsShowcase() {
  const [activeTab, setActiveTab] = useState<'effects' | 'components' | 'patterns'>('effects')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center mb-8">
          <AnimatedHeading level={1} className="text-5xl font-bold text-white mb-4">
            <GlowText glowColor="emerald" intensity="intense">
              Interactive UI Effects
            </GlowText>
          </AnimatedHeading>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Modern, vibrant hover effects, animations, and interactive components
            to enhance your user interface and engagement
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          {(['effects', 'components', 'patterns'] as const).map((tab) => (
            <GlowingButton
              key={tab}
              variant={activeTab === tab ? 'emerald' : 'indigo'}
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab}
            </GlowingButton>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto space-y-12">
        {/* EFFECTS TAB */}
        {activeTab === 'effects' && (
          <div className="space-y-8">
            {/* Hover Effects Section */}
            <InteractiveSection className="p-8">
              <AnimatedHeading level={2} className="text-2xl text-white mb-6">
                Hover Effects
              </AnimatedHeading>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card Hover Effect */}
                <InteractiveCard
                  className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-emerald-500/30"
                  glowColor="rgba(16, 185, 129, 0.4)"
                >
                  <div className="text-emerald-400 font-bold mb-2">Card Hover</div>
                  <p className="text-slate-300 text-sm mb-4">
                    Lift & glow effect with smooth animations
                  </p>
                  <div className="text-xs text-emerald-300">Hover to see effect</div>
                </InteractiveCard>

                {/* Button Glow */}
                <InteractiveCard
                  className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-indigo-500/30"
                  glowColor="rgba(99, 102, 241, 0.4)"
                >
                  <div className="text-indigo-400 font-bold mb-2">Button Glow</div>
                  <p className="text-slate-300 text-sm mb-4">
                    Ripple & shadow effects on interaction
                  </p>
                  <GlowingButton
                    variant="indigo"
                    size="sm"
                    onClick={() => console.log('Clicked!')}
                  >
                    Try Clicking
                  </GlowingButton>
                </InteractiveCard>

                {/* Text Glow */}
                <InteractiveCard
                  className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-purple-500/30"
                  glowColor="rgba(168, 85, 247, 0.4)"
                >
                  <div className="text-purple-400 font-bold mb-2">Text Glow</div>
                  <p className="text-slate-300 text-sm mb-4">
                    Luminous text with shadow effects
                  </p>
                  <GlowText glowColor="purple" intensity="medium">
                    Hover over text
                  </GlowText>
                </InteractiveCard>
              </div>
            </InteractiveSection>

            {/* Animation Effects */}
            <InteractiveSection className="p-8">
              <AnimatedHeading level={2} className="text-2xl text-white mb-6">
                Animation Effects
              </AnimatedHeading>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Pulse */}
                <FloatingElement float delay={0} className="flex justify-center">
                  <div className="w-16 h-16 bg-emerald-500 rounded-lg animate-pulse" />
                </FloatingElement>

                {/* Float */}
                <FloatingElement float delay={200} className="flex justify-center">
                  <div className="w-16 h-16 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/50" />
                </FloatingElement>

                {/* Bounce */}
                <FloatingElement float delay={400} className="flex justify-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-lg animate-bounce" />
                </FloatingElement>

                {/* Spin */}
                <FloatingElement float delay={600} className="flex justify-center">
                  <div className="w-16 h-16 bg-cyan-500 rounded-lg animate-spin" />
                </FloatingElement>
              </div>
            </InteractiveSection>
          </div>
        )}

        {/* COMPONENTS TAB */}
        {activeTab === 'components' && (
          <div className="space-y-8">
            {/* Vibrant Badges */}
            <InteractiveSection className="p-8">
              <AnimatedHeading level={2} className="text-2xl text-white mb-6">
                Vibrant Badges
              </AnimatedHeading>

              <div className="flex flex-wrap gap-4">
                <VibrantBadge variant="success">✓ Success</VibrantBadge>
                <VibrantBadge variant="warning">⚠ Warning</VibrantBadge>
                <VibrantBadge variant="danger">✕ Danger</VibrantBadge>
                <VibrantBadge variant="info">ℹ Info</VibrantBadge>
                <VibrantBadge variant="success" pulse>
                  🔔 Active
                </VibrantBadge>
              </div>
            </InteractiveSection>

            {/* Highlight Boxes */}
            <InteractiveSection className="p-8">
              <AnimatedHeading level={2} className="text-2xl text-white mb-6">
                Highlight Boxes
              </AnimatedHeading>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HighlightBox color="emerald">
                  <div className="font-bold text-emerald-300 mb-2">Emerald Box</div>
                  <p className="text-slate-300 text-sm">
                    Highlighted content with vibrant emerald gradient
                  </p>
                </HighlightBox>

                <HighlightBox color="indigo">
                  <div className="font-bold text-indigo-300 mb-2">Indigo Box</div>
                  <p className="text-slate-300 text-sm">
                    Highlighted content with vibrant indigo gradient
                  </p>
                </HighlightBox>

                <HighlightBox color="purple">
                  <div className="font-bold text-purple-300 mb-2">Purple Box</div>
                  <p className="text-slate-300 text-sm">
                    Highlighted content with vibrant purple gradient
                  </p>
                </HighlightBox>

                <HighlightBox color="cyan">
                  <div className="font-bold text-cyan-300 mb-2">Cyan Box</div>
                  <p className="text-slate-300 text-sm">
                    Highlighted content with vibrant cyan gradient
                  </p>
                </HighlightBox>
              </div>
            </InteractiveSection>

            {/* Progress Indicators */}
            <InteractiveSection className="p-8">
              <AnimatedHeading level={2} className="text-2xl text-white mb-6">
                Interactive Progress Bars
              </AnimatedHeading>

              <div className="space-y-6">
                <div>
                  <p className="text-slate-300 mb-3">Emerald Progress</p>
                  <InteractiveProgressBar value={75} color="emerald" />
                </div>
                <div>
                  <p className="text-slate-300 mb-3">Indigo Progress</p>
                  <InteractiveProgressBar value={60} color="indigo" />
                </div>
                <div>
                  <p className="text-slate-300 mb-3">Purple Progress</p>
                  <InteractiveProgressBar value={85} color="purple" />
                </div>
                <div>
                  <p className="text-slate-300 mb-3">Cyan Progress</p>
                  <InteractiveProgressBar value={45} color="cyan" />
                </div>
              </div>
            </InteractiveSection>
          </div>
        )}

        {/* PATTERNS TAB */}
        {activeTab === 'patterns' && (
          <div className="space-y-8">
            {/* Pattern Examples */}
            <InteractiveSection className="p-8">
              <AnimatedHeading level={2} className="text-2xl text-white mb-6">
                Design Patterns
              </AnimatedHeading>

              {/* Feature Cards Pattern */}
              <div className="mb-12">
                <h3 className="text-xl text-emerald-400 font-bold mb-6">
                  Feature Cards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Analytics', 'Performance', 'Security'].map((feature, i) => (
                    <InteractiveCard
                      key={feature}
                      className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border border-emerald-500/30"
                      glowColor={
                        i === 0
                          ? 'rgba(16, 185, 129, 0.4)'
                          : i === 1
                          ? 'rgba(99, 102, 241, 0.4)'
                          : 'rgba(168, 85, 247, 0.4)'
                      }
                    >
                      <div className="text-2xl mb-4">
                        {feature === 'Analytics' ? '📊' : feature === 'Performance' ? '⚡' : '🔒'}
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">{feature}</h4>
                      <p className="text-slate-400 text-sm">
                        Advanced {feature.toLowerCase()} with real-time monitoring and insights
                      </p>
                    </InteractiveCard>
                  ))}
                </div>
              </div>

              {/* Call-to-Action Pattern */}
              <div className="mb-12">
                <h3 className="text-xl text-indigo-400 font-bold mb-6">
                  Call-to-Action Pattern
                </h3>
                <HighlightBox color="indigo" className="text-center p-8">
                  <AnimatedHeading level={3} className="text-2xl text-white mb-4">
                    Ready to Get Started?
                  </AnimatedHeading>
                  <p className="text-slate-300 mb-6 max-w-xl mx-auto">
                    Experience the power of interactive effects and modern UI design
                    to enhance your user engagement and satisfaction
                  </p>
                  <div className="flex justify-center gap-4">
                    <GlowingButton variant="emerald" size="lg">
                      Get Started
                    </GlowingButton>
                    <GlowingButton variant="indigo" size="lg">
                      Learn More
                    </GlowingButton>
                  </div>
                </HighlightBox>
              </div>

              {/* Status Dashboard Pattern */}
              <div>
                <h3 className="text-xl text-purple-400 font-bold mb-6">
                  Status Dashboard
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'System Status', value: 98, color: 'emerald' as const },
                    { label: 'Performance', value: 85, color: 'indigo' as const },
                    { label: 'Security', value: 92, color: 'purple' as const },
                    { label: 'Availability', value: 99.9, color: 'cyan' as const },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-300 font-medium">{item.label}</span>
                        <span className="text-emerald-400 font-bold">{item.value}%</span>
                      </div>
                      <InteractiveProgressBar
                        value={item.value}
                        color={item.color}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </InteractiveSection>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-700/50">
        <AnimatedDivider color="emerald" className="mb-8" />
        <p className="text-center text-slate-400">
          All interactive effects are non-invasive and can be applied to any existing component.
          <br />
          Zero modifications to existing features required.
        </p>
      </div>
    </div>
  )
}
