/**
 * AQS / MGPS design system — 60-30-10 color attribution.
 * Dominant 60%: workspace surfaces
 * Navigation 30%: structure & hierarchy
 * Accent 10%: CTAs & critical actions
 */
export const designTokens = {
  bg: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    muted: '#F1F5F9',
  },
  nav: {
    primary: '#1E3A8A',
    primaryHover: '#1E40AF',
    primaryMuted: '#1E3A8A1A',
  },
  accent: {
    action: '#DC2626',
    actionHover: '#B91C1C',
    success: '#16A34A',
    warning: '#D97706',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#94A3B8',
    onNav: '#FFFFFF',
  },
  border: {
    default: '#E2E8F0',
    focus: '#1E3A8A',
  },
} as const;

export type DesignToken = typeof designTokens;
