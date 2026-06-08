---
name: i-help
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434750'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737781'
  outline-variant: '#c3c6d1'
  surface-tint: '#395e9b'
  primary: '#002d62'
  on-primary: '#ffffff'
  primary-container: '#1a4480'
  on-primary-container: '#8fb3f6'
  inverse-primary: '#abc7ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#003623'
  on-tertiary: '#ffffff'
  tertiary-container: '#004f35'
  on-tertiary-container: '#32c98f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#abc7ff'
  on-primary-fixed: '#001b3f'
  on-primary-fixed-variant: '#1d4682'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 20px
---

## Brand & Style

The design system is engineered to project unwavering reliability, professionalism, and efficiency. As a marketplace for labor and services, the UI must act as a transparent conduit between service seekers and providers. The brand personality is "The Dependable Partner"—it is authoritative yet accessible, minimizing friction through a high-utility, **Corporate / Modern** aesthetic.

The visual language prioritizes clarity over decoration. It utilizes a structured grid, generous whitespace to reduce cognitive load, and a strict adherence to accessibility standards to ensure users can navigate the marketplace with confidence, regardless of their environment or technical proficiency.

## Colors

The palette is anchored by "Trust Blue," a deep, professional sapphire that signals stability and expertise. This is supported by a "Success Green" used exclusively for positive outcomes, confirmations, and completed states to build user momentum.

- **Primary:** Used for main actions, active states, and brand-heavy components.
- **Secondary:** A dark charcoal for high-contrast text and grounding elements.
- **Tertiary (Success):** Reserved for validation, "verified" badges, and successful transaction signals.
- **Neutral:** A spectrum of cool grays used for borders, secondary text, and disabled states.
- **Background:** Crisp, pure white to maximize legibility and provide a "clean" feel.

## Typography

This design system utilizes **Inter** for its exceptional legibility on mobile displays and its neutral, systematic character. The typographic scale is optimized for information density without sacrificing readability.

- **Headlines:** Use a bold weight and slightly tighter letter spacing to create a strong visual anchor.
- **Body Text:** Standardized at 16px for primary content to ensure accessibility on all mobile devices.
- **Labels:** Utilized for form headers and small UI descriptors, employing a medium weight to distinguish them from body copy.

## Layout & Spacing

The layout follows a **fluid grid** model based on an 8px square system. For mobile views (iOS/Android Webview), the system maintains a 20px outer margin to provide breathing room and prevent accidental edge-taps.

- **Vertical Rhythm:** Components are spaced using the `md` (16px) or `lg` (24px) units to create clear logical groupings.
- **Touch Targets:** All interactive elements must maintain a minimum height of 44px (the `xl` unit plus internal padding).
- **Form Layout:** Labels are always positioned above input fields with an 8px (sm) gap to ensure clarity on narrow screens.

## Elevation & Depth

To maintain the "clean and crisp" aesthetic, this design system uses **low-contrast outlines** combined with **ambient shadows**. Depth is used sparingly to indicate interactivity or modal overlays.

- **Level 0 (Flat):** Used for the main background and non-interactive sections.
- **Level 1 (Crisp Border):** Interactive containers and cards use a 1px solid border (#E2E8F0) to define their boundaries.
- **Level 2 (Subtle Lift):** Active cards or floating buttons utilize a very soft shadow: `0px 4px 12px rgba(0, 0, 0, 0.05)`.
- **Modals:** Use a 40% black backdrop blur to pull focus, with a higher elevation shadow to signify the topmost layer.

## Shapes

The shape language is **Soft**, striking a balance between the precision of a professional tool and the approachability of a service marketplace.

- **Standard Elements:** Buttons, input fields, and small cards use a 0.25rem (4px) radius.
- **Large Containers:** Bottom sheets and prominent profile cards use a 0.5rem (8px) radius.
- **Icons:** Should follow a consistent 2px stroke weight with slightly rounded terminals to match the UI's geometry.

## Components

### Buttons
- **Primary:** Solid "Trust Blue" background with white text. High contrast, 1px border of the same color.
- **Secondary:** White background with "Trust Blue" 1px border and text.
- **Ghost:** No background or border; used for low-priority actions like "Cancel."

### Inputs & Forms
- **Fields:** 1px neutral border (#CBD5E1) that shifts to "Trust Blue" on focus. 
- **Validation:** Errors must show both a red border and a small warning icon for accessibility.

### Trust Indicators
- **Verified Badges:** A small shield icon in Success Green (#10B981) placed next to provider names.
- **Progress Bars:** Thin 4px height bars with a rounded track. Completed segments use the Primary color.

### Cards
- Service cards use a white background, a 1px neutral-light border, and no shadow unless tapped. This keeps the "list" views looking organized and professional.

### Chips
- Used for categories (e.g., "Plumbing", "Electrical"). These use a light gray background (#F1F5F9) and a 0.5rem (8px) radius to distinguish them from buttons.
