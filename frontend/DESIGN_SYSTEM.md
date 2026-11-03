# CareerScope Design System

## Overview

CareerScope uses the Intelligence Hybrid design direction, combining a distinctive dark visual identity with a readable, accessible analytics workspace.

## Design principles

1. Data clarity comes before decoration.
2. Consistent components use shared design tokens.
3. Accessibility is a baseline requirement.
4. Motion should communicate interaction and state.
5. All interfaces must support mobile and desktop layouts.

## Styling architecture

- `src/styles/tokens.css`: Brand, spacing, typography, geometry, and motion tokens.
- `src/styles/themes.css`: Semantic colors for light and dark themes.
- `src/index.css`: Global element styles.
- `src/App.css`: Existing application layouts and migrated semantic styling.
- `src/components/ui/`: Reusable interface primitives and component-specific styles.

## Themes

CareerScope supports three appearance preferences:

- Light: Always uses light colors.
- Dark: Always uses dark colors.
- System: Follows the operating system preference.

Preferences are stored under the `careerscope-theme` localStorage key.

The resolved theme is applied to the document element through `data-theme`.

## UI components

### Button

Variants: `primary`, `secondary`, `ghost`.

Sizes: `sm`, `md`, `lg`.

Use for actions, not navigation.

### Card

Supports semantic HTML elements through the `as` prop and optional elevation.

### Badge

Variants: `neutral`, `accent`, `success`, `danger`.

Use for meaningful status or metadata.

### ThemeToggle

Accessible appearance selector supporting Light, Dark, and System.

## Accessibility

Target WCAG 2.2 AA.

- Preserve native HTML semantics.
- Ensure visible keyboard focus.
- Verify contrast in both themes.
- Respect reduced-motion preferences.
- Provide text alternatives for charts.
- Avoid relying exclusively on color to communicate information.

## Development rules

- Use semantic CSS variables rather than hardcoded component colors.
- Avoid introducing additional UI libraries without justification.
- Preserve existing API contracts and data accuracy.
- Add tests for reusable component behavior.
- Run tests, lint, and build before requesting review.

## Future work

The design system will support upcoming improvements to navigation, landing-page presentation, occupation discovery, wage analytics, and purposeful motion.

These features belong in separate GitFlow pull requests.
