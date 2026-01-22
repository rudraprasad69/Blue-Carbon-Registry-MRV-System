/**
 * INTERACTIVE UI WRAPPER COMPONENTS
 * Non-invasive enhancement components for modern UI effects
 */

'use client'

import React, { ReactNode, CSSProperties, forwardRef } from 'react'
import {
  useInteractiveHover,
  useClickRipple,
  useMagneticCursor,
  useTiltEffect,
} from '@/hooks/useInteractiveEffects'

/* ============================================
   1. INTERACTIVE CARD WITH GLOW EFFECT
   ============================================ */

interface InteractiveCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  enableParticles?: boolean
  onClick?: () => void
  interactive?: boolean
}

export const InteractiveCard = forwardRef<
  HTMLDivElement,
  InteractiveCardProps
>(
  (
    {
      children,
      className = '',
      glowColor = 'rgba(16, 185, 129, 0.3)',
      enableParticles = false,
      onClick,
      interactive = true,
    },
    externalRef
  ) => {
    const { ref: hoverRef, isHovering } = useInteractiveHover({
      enableGlow: interactive,
      glowColor,
    })
    const { ref: rippleRef, ripples } = useClickRipple()

    return (
      <div
        ref={hoverRef}
        className={`card-hover relative overflow-hidden rounded-lg transition-all duration-300 ${className}`}
        onClick={onClick}
        style={
          {
            '--glow-color': glowColor,
            cursor: 'pointer',
          } as CSSProperties & { '--glow-color': string }
        }
      >
        {/* Glow background */}
        {isHovering && interactive && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor} 0%, transparent 80%)`,
              opacity: 0.3,
            }}
          />
        )}

        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '20px',
              height: '20px',
              background: glowColor,
              transform: 'translate(-50%, -50%)',
              animation: `ripple 0.6s ease-out`,
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    )
  }
)

InteractiveCard.displayName = 'InteractiveCard'

/* ============================================
   2. GLOWING BUTTON COMPONENT
   ============================================ */

interface GlowingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  glowColor?: string
  variant?: 'emerald' | 'indigo' | 'purple' | 'cyan' | 'rose'
  size?: 'sm' | 'md' | 'lg'
}

const glowColorMap = {
  emerald: 'rgba(16, 185, 129, 0.4)',
  indigo: 'rgba(99, 102, 241, 0.4)',
  purple: 'rgba(168, 85, 247, 0.4)',
  cyan: 'rgba(6, 182, 212, 0.4)',
  rose: 'rgba(244, 63, 94, 0.4)',
}

const sizeMap = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export const GlowingButton = forwardRef<
  HTMLButtonElement,
  GlowingButtonProps
>(
  (
    {
      children,
      glowColor,
      variant = 'emerald',
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const finalGlowColor = glowColor || glowColorMap[variant]

    return (
      <button
        ref={ref}
        className={`
          relative overflow-hidden rounded-lg font-semibold
          transition-all duration-300 transform
          hover:scale-105 hover:shadow-lg
          active:scale-95
          ${sizeMap[size]}
          ${className}
        `}
        style={
          {
            '--glow-color': finalGlowColor,
          } as CSSProperties & { '--glow-color': string }
        }
        {...props}
      >
        {/* Animated background */}
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle, ${finalGlowColor} 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <span className="relative z-10">{children}</span>
      </button>
    )
  }
)

GlowingButton.displayName = 'GlowingButton'

/* ============================================
   3. ANIMATED HEADING COMPONENT
   ============================================ */

interface AnimatedHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  glowColor?: string
  animated?: boolean
}

export const AnimatedHeading = forwardRef<
  HTMLHeadingElement,
  AnimatedHeadingProps
>(
  (
    {
      children,
      level = 2,
      glowColor = 'rgba(16, 185, 129, 0.3)',
      animated = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const HeadingTag = `h${level}` as const

    return (
      <HeadingTag
        ref={ref as any}
        className={`
          transition-all duration-300
          ${animated ? 'hover:scale-105' : ''}
          ${className}
        `}
        style={
          animated
            ? ({
                '--glow-color': glowColor,
              } as CSSProperties & { '--glow-color': string })
            : undefined
        }
        {...props}
      >
        {children}
      </HeadingTag>
    )
  }
)

AnimatedHeading.displayName = 'AnimatedHeading'

/* ============================================
   4. INTERACTIVE SECTION WRAPPER
   ============================================ */

interface InteractiveSectionProps {
  children: ReactNode
  className?: string
  enableTilt?: boolean
  enableMagnet?: boolean
  glowColor?: string
}

export const InteractiveSection = forwardRef<
  HTMLDivElement,
  InteractiveSectionProps
>(
  (
    {
      children,
      className = '',
      enableTilt = false,
      enableMagnet = false,
      glowColor = 'rgba(16, 185, 129, 0.2)',
    },
    externalRef
  ) => {
    const { ref: hoverRef } = useInteractiveHover({
      enableGlow: true,
      glowColor,
    })
    const tiltEffect = useTiltEffect(10)

    return (
      <section
        ref={hoverRef}
        className={`
          relative transition-all duration-300
          rounded-lg overflow-hidden
          ${className}
        `}
        style={
          {
            '--glow-color': glowColor,
          } as CSSProperties & { '--glow-color': string }
        }
      >
        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${glowColor} 0%, transparent 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </section>
    )
  }
)

InteractiveSection.displayName = 'InteractiveSection'

/* ============================================
   5. GLOW TEXT EFFECT
   ============================================ */

interface GlowTextProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  glowColor?: 'emerald' | 'indigo' | 'purple' | 'cyan' | 'rose'
  intensity?: 'light' | 'medium' | 'intense'
}

const glowTextMap = {
  emerald: {
    light: 'text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]',
    medium: 'text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    intense: 'text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.8)]',
  },
  indigo: {
    light: 'text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.3)]',
    medium: 'text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.5)]',
    intense: 'text-indigo-200 shadow-[0_0_30px_rgba(99,102,241,0.8)]',
  },
  purple: {
    light: 'text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
    medium: 'text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.5)]',
    intense: 'text-purple-200 shadow-[0_0_30px_rgba(168,85,247,0.8)]',
  },
  cyan: {
    light: 'text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]',
    medium: 'text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)]',
    intense: 'text-cyan-200 shadow-[0_0_30px_rgba(6,182,212,0.8)]',
  },
  rose: {
    light: 'text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
    medium: 'text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.5)]',
    intense: 'text-rose-200 shadow-[0_0_30px_rgba(244,63,94,0.8)]',
  },
}

export const GlowText = forwardRef<HTMLSpanElement, GlowTextProps>(
  (
    {
      children,
      glowColor = 'emerald',
      intensity = 'medium',
      className = '',
      ...props
    },
    ref
  ) => {
    const glowClass = glowTextMap[glowColor][intensity]

    return (
      <span
        ref={ref}
        className={`${glowClass} transition-all duration-300 hover:scale-105 inline-block ${className}`}
        {...props}
      >
        {children}
      </span>
    )
  }
)

GlowText.displayName = 'GlowText'

/* ============================================
   6. VIBRANT BADGE COMPONENT
   ============================================ */

interface VibrantBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info'
  pulse?: boolean
}

const badgeVariants = {
  success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]',
  warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]',
  danger: 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]',
  info: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]',
}

export const VibrantBadge = forwardRef<
  HTMLDivElement,
  VibrantBadgeProps
>(
  (
    { children, variant = 'success', pulse = false, className = '', ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          inline-flex items-center justify-center
          px-3 py-1 rounded-full
          border text-sm font-semibold
          transition-all duration-300
          transform hover:scale-110
          ${badgeVariants[variant]}
          ${pulse ? 'animate-pulse' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

VibrantBadge.displayName = 'VibrantBadge'

/* ============================================
   7. FLOATING ELEMENT WRAPPER
   ============================================ */

interface FloatingElementProps {
  children: ReactNode
  className?: string
  float?: boolean
  delay?: number
}

export const FloatingElement = forwardRef<
  HTMLDivElement,
  FloatingElementProps
>(
  (
    { children, className = '', float = true, delay = 0 },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          ${float ? 'animate-float' : ''}
          transition-all duration-300
          ${className}
        `}
        style={
          float
            ? ({
                animationDelay: `${delay}ms`,
              } as CSSProperties)
            : undefined
        }
      >
        {children}
      </div>
    )
  }
)

FloatingElement.displayName = 'FloatingElement'

/* ============================================
   8. HIGHLIGHT BOX COMPONENT
   ============================================ */

interface HighlightBoxProps {
  children: ReactNode
  className?: string
  color?: 'emerald' | 'indigo' | 'purple' | 'cyan' | 'rose'
}

const highlightColors = {
  emerald: 'from-emerald-500/20 to-emerald-600/10',
  indigo: 'from-indigo-500/20 to-indigo-600/10',
  purple: 'from-purple-500/20 to-purple-600/10',
  cyan: 'from-cyan-500/20 to-cyan-600/10',
  rose: 'from-rose-500/20 to-rose-600/10',
}

export const HighlightBox = forwardRef<
  HTMLDivElement,
  HighlightBoxProps
>(
  (
    { children, className = '', color = 'emerald' },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          bg-gradient-to-r ${highlightColors[color]}
          rounded-lg px-4 py-3
          transition-all duration-300
          hover:shadow-lg hover:from-${color}-500/30
          ${className}
        `}
      >
        {children}
      </div>
    )
  }
)

HighlightBox.displayName = 'HighlightBox'

/* ============================================
   9. ANIMATED DIVIDER
   ============================================ */

interface AnimatedDividerProps {
  color?: 'emerald' | 'indigo' | 'purple' | 'cyan' | 'rose'
  height?: number
  className?: string
}

const dividerColors = {
  emerald: 'from-emerald-500 via-emerald-400 to-transparent',
  indigo: 'from-indigo-500 via-indigo-400 to-transparent',
  purple: 'from-purple-500 via-purple-400 to-transparent',
  cyan: 'from-cyan-500 via-cyan-400 to-transparent',
  rose: 'from-rose-500 via-rose-400 to-transparent',
}

export const AnimatedDivider = ({
  color = 'emerald',
  height = 2,
  className = '',
}: AnimatedDividerProps) => {
  return (
    <div
      className={`
        h-[${height}px] bg-gradient-to-r ${dividerColors[color]}
        rounded-full
        shadow-lg shadow-${color}-500/50
        animate-pulse
        ${className}
      `}
      style={{ height: `${height}px` }}
    />
  )
}

/* ============================================
   10. INTERACTIVE PROGRESS BAR
   ============================================ */

interface InteractiveProgressBarProps {
  value: number
  max?: number
  color?: 'emerald' | 'indigo' | 'purple' | 'cyan' | 'rose'
  animated?: boolean
  className?: string
}

const progressColors = {
  emerald: 'from-emerald-500 to-emerald-400',
  indigo: 'from-indigo-500 to-indigo-400',
  purple: 'from-purple-500 to-purple-400',
  cyan: 'from-cyan-500 to-cyan-400',
  rose: 'from-rose-500 to-rose-400',
}

export const InteractiveProgressBar = ({
  value,
  max = 100,
  color = 'emerald',
  animated = true,
  className = '',
}: InteractiveProgressBarProps) => {
  const percentage = (value / max) * 100

  return (
    <div className={`w-full bg-slate-700/50 rounded-full overflow-hidden h-3 ${className}`}>
      <div
        className={`
          h-full bg-gradient-to-r ${progressColors[color]}
          transition-all duration-300
          ${animated ? 'shadow-lg shadow-${color}-500/50' : ''}
        `}
        style={{
          width: `${percentage}%`,
        }}
      />
    </div>
  )
}
