/**
 * Design Tokens
 * Centralized design system values for consistent styling across the application
 */

export const designTokens = {
  // Border Radius
  radius: {
    sm: 'rounded-lg',      // 8px - small elements like tags, badges
    md: 'rounded-xl',      // 12px - cards, buttons, inputs (PRIMARY)
    lg: 'rounded-2xl',     // 16px - large cards, modals
    full: 'rounded-full',  // Pills, avatars
  },

  // Shadows - Clear hierarchy
  shadow: {
    sm: 'shadow-sm',       // Subtle elevation - hover states
    md: 'shadow-md',       // Default cards and elevated elements (PRIMARY)
    lg: 'shadow-lg',       // Important elements, dropdowns
    xl: 'shadow-xl',       // Modals, popovers
    '2xl': 'shadow-2xl',   // Hero elements, major overlays
  },

  // Spacing Scale (using Tailwind's built-in scale)
  spacing: {
    xs: 'p-2',    // 8px
    sm: 'p-3',    // 12px
    md: 'p-4',    // 16px (PRIMARY for cards)
    lg: 'p-6',    // 24px
    xl: 'p-8',    // 32px
  },

  // Margin/Padding utilities
  gap: {
    xs: 'gap-2',   // 8px
    sm: 'gap-3',   // 12px
    md: 'gap-4',   // 16px (PRIMARY)
    lg: 'gap-6',   // 24px
    xl: 'gap-8',   // 32px
  },

  // Common gradients
  gradient: {
    primary: 'bg-gradient-to-r from-red-600 via-red-500 to-orange-500',
    primaryHover: 'hover:shadow-[0_0_40px_rgba(220,38,38,0.6)]',
    glass: 'bg-white/10 backdrop-blur-md',
  },

  // Transitions
  transition: {
    default: 'transition-all duration-300',
    fast: 'transition-all duration-150',
    slow: 'transition-all duration-500',
  },
} as const
