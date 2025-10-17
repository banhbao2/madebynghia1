# 🎨 Nghia Demo - Design Style Guide

## Design Philosophy
Creating a vibrant, appetizing, and modern restaurant experience that combines Vietnamese and Japanese culinary aesthetics with contemporary web design.

---

## 🎨 Color Palette

### Primary Colors
```css
--primary-red: #DC2626      /* Main brand red - passionate, appetizing */
--primary-dark: #B91C1C     /* Hover states, depth */
--primary-light: #FCA5A5    /* Accents, highlights */
```

### Secondary Colors
```css
--secondary-orange: #F59E0B  /* Warmth, energy */
--secondary-amber: #FBBF24   /* Highlights, call-to-actions */
--secondary-yellow: #FCD34D  /* Accents, freshness */
```

### Accent Colors (NEW)
```css
--accent-teal: #14B8A6       /* Fresh, modern - for Asian cuisine */
--accent-emerald: #10B981    /* Success states, fresh ingredients */
--accent-purple: #8B5CF6     /* Premium items, special offers */
--accent-pink: #EC4899       /* Sushi/Japanese elements */
```

### Neutral Colors
```css
--neutral-50: #FFFBF5        /* Warm white background */
--neutral-100: #FFF5E6       /* Soft backgrounds */
--neutral-200: #FFE4C4       /* Borders, dividers */
--neutral-800: #2D2D2D       /* Primary text */
--neutral-900: #1A1A1A       /* Headings, emphasis */
```

### Gradient Combinations
```css
--gradient-warm: linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)
--gradient-sunset: linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)
--gradient-ocean: linear-gradient(135deg, #14B8A6 0%, #8B5CF6 100%)
--gradient-fresh: linear-gradient(135deg, #10B981 0%, #14B8A6 100%)
--gradient-premium: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)
```

---

## 📝 Typography

### Font Stack
```css
Primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Display: 'Poppins', 'Inter', sans-serif (for headings)
Accent: 'Playfair Display', serif (for special text)
```

### Font Sizes
```
Display: 4rem - 6rem (64px - 96px)
H1: 2.5rem - 3.5rem (40px - 56px)
H2: 2rem - 2.75rem (32px - 44px)
H3: 1.5rem - 2rem (24px - 32px)
Body: 1rem - 1.125rem (16px - 18px)
Small: 0.875rem (14px)
Tiny: 0.75rem (12px)
```

### Font Weights
```
Light: 300 (subtle text)
Regular: 400 (body text)
Medium: 500 (emphasis)
Semibold: 600 (subheadings)
Bold: 700 (headings)
Extrabold: 800 (hero text, CTAs)
```

---

## 🎭 Visual Effects

### Shadows
```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)
--shadow-lg: 0 10px 25px rgba(220, 38, 38, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)
--shadow-xl: 0 20px 40px rgba(220, 38, 38, 0.15), 0 10px 20px rgba(0, 0, 0, 0.08)
--shadow-glow: 0 0 30px rgba(220, 38, 38, 0.3)
--shadow-colored: 0 10px 30px rgba(220, 38, 38, 0.2)
```

### Glassmorphism
```css
--glass-white: rgba(255, 255, 255, 0.1)
--glass-blur: blur(10px)
--glass-border: 1px solid rgba(255, 255, 255, 0.18)
```

### Border Radius
```css
--radius-sm: 0.5rem (8px)
--radius-md: 0.75rem (12px)
--radius-lg: 1rem (16px)
--radius-xl: 1.5rem (24px)
--radius-2xl: 2rem (32px)
--radius-full: 9999px
```

---

## ✨ Animation & Transitions

### Timing Functions
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
--ease-in-out: cubic-bezier(0.4, 0, 0.6, 1)
```

### Duration
```css
--duration-fast: 150ms
--duration-normal: 300ms
--duration-slow: 500ms
```

### Hover Effects
- Scale: 1.02 - 1.05
- Translate Y: -4px to -8px
- Opacity: 0.7 - 0.9 (for subtle elements)
- Glow: Add colored shadows on hover

---

## 🎯 Component Patterns

### Cards
- Border radius: 1rem - 2rem
- Shadow: md to lg on hover
- Background: White with subtle gradient overlays
- Hover: Lift effect (-translateY-2 to -4px)
- Border: 1-2px solid with accent colors

### Buttons
**Primary (CTA)**
- Gradient background
- Bold font weight
- Large padding (px-8 py-4)
- Rounded corners (rounded-xl)
- Hover: Lift + glow effect
- Active: Scale(0.98)

**Secondary**
- Outlined or glass effect
- Medium weight
- Hover: Solid background transition

### Input Fields
- Border: 2px solid neutral
- Focus: Ring effect with brand color
- Rounded: rounded-xl
- Height: py-3 to py-4

---

## 🖼️ Imagery

### Image Treatment
- Overlay gradients for text readability
- Border radius: 1rem - 2rem
- Aspect ratios: 16:9 (cards), 4:3 (products), 1:1 (avatars)
- Hover: Slight scale (1.05) with overflow hidden

### Icons
- Size: 1.5rem - 2.5rem
- Color: Match brand colors
- Stroke width: 2-2.5px
- Use consistent icon library (Heroicons)

---

## 📐 Spacing System

```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
3xl: 4rem (64px)
4xl: 6rem (96px)
```

### Section Spacing
- Between sections: py-16 to py-24
- Container padding: px-4 to px-8
- Component gap: gap-6 to gap-10

---

## 🎨 Design Patterns

### Hero Sections
- Full viewport height or min-height
- Gradient overlays (60-80% opacity)
- Large, bold typography
- Animated elements
- Clear CTA buttons

### Grid Layouts
- 2-3 columns on desktop
- Single column on mobile
- Consistent gap spacing (gap-6 to gap-10)
- Card-based layouts

### Color Usage
- **Red**: Primary actions, food items, urgency
- **Orange**: Secondary actions, warmth, appetizing
- **Teal**: Fresh ingredients, modern touch
- **Purple**: Premium items, special offers
- **Pink**: Sushi/Japanese cuisine elements
- **Green**: Success, fresh, healthy options

---

## ♿ Accessibility

- Contrast ratio: Minimum 4.5:1 for text
- Focus states: Clear ring indicators
- Keyboard navigation: Full support
- Touch targets: Minimum 44x44px
- Alt text: All images
- ARIA labels: Interactive elements

---

## 📱 Responsive Design

### Breakpoints
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Mobile-First Approach
- Stack vertically on mobile
- Larger touch targets (min 44px)
- Simplified navigation
- Bottom navigation for key actions

---

## 🎪 Special Elements

### Badges
- Small rounded pills
- Bright accent colors
- White or colored backgrounds
- Bold, uppercase text

### Decorative Elements
- Subtle patterns in backgrounds
- Geometric shapes for visual interest
- Emoji icons for personality
- Wavy dividers between sections

### Loading States
- Skeleton screens matching content
- Smooth pulse animations
- Brand-colored spinners
- Progress indicators

---

## Implementation Checklist

✓ Color palette expansion
✓ Custom fonts integration
✓ Enhanced shadows and depth
✓ Glassmorphism effects
✓ Micro-interactions
✓ Decorative patterns
✓ Improved spacing
✓ Visual hierarchy enhancement
