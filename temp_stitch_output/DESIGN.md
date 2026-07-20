---
name: Aureate Dark System
colors:
  surface: '#141218'
  surface-dim: '#141218'
  surface-bright: '#3b383e'
  surface-container-lowest: '#0f0d13'
  surface-container-low: '#1d1b20'
  surface-container: '#211f24'
  surface-container-high: '#2b292f'
  surface-container-highest: '#36343a'
  on-surface: '#e6e0e9'
  on-surface-variant: '#cbc4d2'
  inverse-surface: '#e6e0e9'
  inverse-on-surface: '#322f35'
  outline: '#948e9c'
  outline-variant: '#494551'
  surface-tint: '#cfbcff'
  primary: '#cfbcff'
  on-primary: '#381e72'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#6750a4'
  secondary: '#cdc0e9'
  on-secondary: '#342b4b'
  secondary-container: '#4d4465'
  on-secondary-container: '#bfb2da'
  tertiary: '#e7c365'
  on-tertiary: '#3e2e00'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cdc0e9'
  on-secondary-fixed: '#1f1635'
  on-secondary-fixed-variant: '#4b4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#141218'
  on-background: '#e6e0e9'
  surface-variant: '#36343a'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 32px
  gutter: 24px
  section-gap: 48px
  card-padding: 24px
---

## Brand & Style

This design system is built for high-end SaaS environments where focus and prestige are paramount. It employs a **Premium Minimalist** aesthetic, utilizing deep charcoal foundations and warm metallic accents to evoke a sense of exclusive craftsmanship. 

The emotional response is one of calm authority and high productivity. By using expansive white space (or "dark space") and a restricted color palette, the UI recedes to let user data take center stage, while the golden accents guide the eye toward primary actions and critical insights. The style leans into **Tonal Layering** with subtle glassmorphic hints to create a sophisticated sense of depth without clutter.

## Colors

The palette is anchored by a three-tier monochromatic dark scale to establish hierarchy through value rather than color. 

- **Primary Background**: Used for the lowest level of the interface (global canvas).
- **Secondary Background**: Reserved for sidebars, navigation rails, or header sections to provide structural contrast.
- **Card Background**: Used for elevated content containers. 
- **Primary Accent**: A warm golden hue used sparingly for buttons, active states, and focus indicators to signify "premium" value.
- **Text**: Primary white (#FFFFFF) is used for high-emphasis content and headers, while Secondary grey (#B7B7B7) is used for body copy and metadata to reduce eye strain.

## Typography

The system utilizes a dual-font strategy. **Manrope** is used for headlines and display text to provide a modern, geometric character with high impact. **Inter** is used for all functional body text, UI labels, and data points due to its exceptional legibility at small sizes and neutral tone.

Large bold greetings (Display LG) should be used on dashboard homepages to establish a welcoming, premium feel. Use `label-caps` for table headers and section overviews to create a disciplined, architectural look.

## Layout & Spacing

This design system follows a **Fluid Grid** model with generous inner margins to maintain an airy, "spacious" feel. 

- **Desktop**: A 12-column grid with 24px gutters. Use 32px or 48px side margins to allow the content to breathe.
- **Tablet**: 8-column grid with 16px gutters.
- **Mobile**: 4-column grid with 16px gutters and 16px side margins.

Vertical rhythm is strictly maintained using multiples of 8px. Large sections should be separated by `section-gap` to prevent visual density from feeling overwhelming in a dark environment.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** combined with **Ambient Shadows**.

- **Level 0 (Base)**: `#161616`. No shadow.
- **Level 1 (Sidebar/Nav)**: `#1D1D1D`. Right-aligned soft shadow for sidebars.
- **Level 2 (Cards/Modals)**: `#232323`. Use a very soft, diffused shadow: `0px 12px 32px rgba(0, 0, 0, 0.4)`. 
- **Accents**: To emphasize depth on golden elements, use a subtle outer glow (0px 0px 12px) using a low-opacity version of the primary accent color (#F5C15D at 20%).

Avoid harsh white borders. Instead, use a subtle 1px inner stroke of `#2E2E2E` on cards to define edges against the background.

## Shapes

The design system favors significant roundedness to soften the "tech" feel of the SaaS dashboard. 

- **Cards**: Use 24px (`rounded-2xl`) for main dashboard cards and containers.
- **Buttons/Inputs**: Use 12px (`rounded-xl`) for a balanced, modern touch.
- **Modals**: Use 32px (`rounded-3xl`) for high-level overlays to distinguish them clearly from background elements.

The interplay of these large radii creates a organic, premium flow throughout the application.

## Components

### Buttons
- **Primary**: Background `#F5C15D`, Text `#161616` (Black), Bold weight.
- **Secondary**: Transparent background, 1px border `#2E2E2E`, Text `#FFFFFF`.
- **Ghost**: No background/border, Text `#B7B7B7`.

### Cards
Cards must always use the `#232323` background with 24px padding and 24px corner radius. Group related data within cards using subtle separator lines in `#2E2E2E`.

### Inputs
Fields use the `#1D1D1D` background with a 1px border of `#2E2E2E`. On focus, the border should transition to `#F5C15D`.

### Chips / Tags
Use a low-contrast approach: Background `#2E2E2E`, Text `#B7B7B7`. For active states, use Background `#F5C15D` at 10% opacity with Text `#F5C15D`.

### Navigation
Vertical navigation rails should be kept minimal. Icons should be line-art style (2px stroke) in `#B7B7B7`, turning `#FFFFFF` or `#F5C15D` when active.