/**
 * Luxury Design Tokens - 2025 Modern Aesthetic
 * Centralized design system for sophisticated, minimalist restaurant branding
 */

export const designTokens = {
  // Border Radius - Subtle and elegant
  radius: {
    sm: 'rounded-md',      // 6px - subtle for small elements
    md: 'rounded-lg',      // 8px - cards, buttons, inputs (PRIMARY)
    lg: 'rounded-xl',      // 12px - large cards, modals
    xl: 'rounded-2xl',     // 16px - hero sections, major containers
    full: 'rounded-full',  // Pills, avatars
  },

  // Luxury Shadows - Soft and sophisticated
  shadow: {
    sm: 'shadow-luxury',       // Subtle elevation with luxury feel
    md: 'shadow-luxury-lg',    // Default cards (PRIMARY)
    lg: 'shadow-[0_20px_60px_rgba(26,26,26,0.12)]',
    xl: 'shadow-[0_24px_80px_rgba(26,26,26,0.15)]',
    gold: 'shadow-gold',       // Gold accent shadow
  },

  // Generous Spacing for luxury feel
  spacing: {
    xs: 'p-3',     // 12px
    sm: 'p-4',     // 16px
    md: 'p-6',     // 24px (PRIMARY - more breathing room)
    lg: 'p-8',     // 32px
    xl: 'p-12',    // 48px
    '2xl': 'p-16', // 64px - hero sections
  },

  // Margin/Padding utilities - More generous
  gap: {
    xs: 'gap-3',   // 12px
    sm: 'gap-4',   // 16px
    md: 'gap-6',   // 24px (PRIMARY)
    lg: 'gap-8',   // 32px
    xl: 'gap-12',  // 48px
    '2xl': 'gap-16', // 64px
  },

  // Luxury Gradients
  gradient: {
    primary: 'bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D]',
    gold: 'bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#B8941F]',
    emerald: 'bg-gradient-to-r from-[#3A7773] to-[#2D5F5D]',
    subtle: 'bg-gradient-to-b from-[#FDFCFA] to-[#F8F7F4]',
    glass: 'bg-white/80 backdrop-blur-xl',
    glassDark: 'bg-black/5 backdrop-blur-md',
  },

  // Smooth Luxury Transitions
  transition: {
    default: 'transition-all duration-300 ease-out',
    fast: 'transition-all duration-200 ease-out',
    slow: 'transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)',
    luxury: 'transition-all duration-400 cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Typography
  typography: {
    display: 'font-playfair font-semibold tracking-tight',
    heading: 'font-playfair font-medium',
    body: 'font-inter',
    accent: 'font-poppins font-medium',
  },

  // Colors (for JS usage)
  colors: {
    gold: '#D4AF37',
    goldLight: '#E5C158',
    goldDark: '#B8941F',
    emerald: '#2D5F5D',
    emeraldLight: '#3A7773',
    charcoal: '#1A1A1A',
    muted: '#6B6B6B',
  },
} as const
