# Standardized Style Guide for Suhaila-locals

This guide defines the core design tokens and principles to ensure a consistent and professional aesthetic across all pages of the website.

## 1. Color Palette (Design Tokens)

The existing color palette is well-defined but will be slightly refined to ensure better contrast and a more cohesive look, focusing on the warm gold and terracotta tones.

| Variable Name | Hex Code | Description | Usage |
| :--- | :--- | :--- | :--- |
| `--color-primary` | `#D4AF37` | **Warm Gold** | Main call-to-action buttons, primary links, key highlights. |
| `--color-secondary` | `#E76F51` | **Terracotta/Burnt Orange** | Secondary accents, hover states, complementary elements. |
| `--color-accent` | `#00798C` | **Deep Teal** | Used sparingly for strong contrast, e.g., icons, important notices. |
| `--text-primary` | `#1A1A1A` | **Dark Charcoal** | Main body text and headings. |
| `--text-muted` | `#6B7280` | **Muted Grey** | Secondary text, captions, and placeholders. |
| `--bg-page` | `#FBFBFB` | **Near-White** | Main background color for the entire page. |
| `--bg-surface` | `#FFFFFF` | **Pure White** | Background for cards, modals, and content blocks. |
| `--muted-border` | `#D4D4D4` | **Light Grey** | Borders, dividers, and subtle outlines. |
| `--color-success` | `#4CAF50` | **Success Green** | Form success messages. |
| `--color-error` | `#F44336` | **Error Red** | Form error messages and alerts. |

## 2. Typography

The existing fluid typography is good, but we will ensure consistent font-family usage across all elements.

| Element | Font Size | Line Height | Font Weight | Font Family |
| :--- | :--- | :--- | :--- | :--- |
| `h1` | `clamp(1.6rem, 3.6vw, 3.5rem)` | `1.05` | `700` | **Consistent with body** (or a serif if imported) |
| `h2` | `clamp(1.2rem, 2.6vw, 2.2rem)` | `1.2` | `600` | **Consistent with body** |
| `h3` | `1.3em` | `1.3` | `700` | **Consistent with body** |
| `p` / Body | `1rem` (base) | `1.6` | `400` | **'Inter', Arial, sans-serif** (as seen in form) |

**Action:** Ensure the base `body` and all headings use a consistent, modern, and readable font stack. If 'Playfair Display' is desired for headings, it must be imported and applied consistently. For now, we will standardize on a clean sans-serif stack.

## 3. Spacing and Layout

We will standardize spacing using a consistent scale (e.g., multiples of 8px).

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `--space-xs` | `4px` | Extra small spacing (e.g., between icon and text) |
| `--space-sm` | `8px` | Small spacing (e.g., padding inside buttons) |
| `--space-md` | `16px` | Medium spacing (e.g., padding inside cards) |
| `--space-lg` | `24px` | Large spacing (e.g., section margins) |
| `--space-xl` | `40px` | Extra large spacing (e.g., between major sections) |

## 4. Components Standardization

### Buttons (`.button`, `.btn`)
*   **Primary:** Use a gradient of `--color-primary` and `--color-secondary` for a warm, inviting look. Consistent `border-radius: 999px` (pill shape).
*   **Ghost:** Transparent background, `--text-primary` color, and `1px solid var(--muted-border)` border. Hover state uses a light mix of `--color-primary`.

### Cards (`.reservation-item`)
*   Consistent background (`--bg-surface`), border (`1.5px solid var(--muted-border)`), and shadow (`var(--shadow-1)`).
*   Hover effect: `transform: translateY(-6px) scale(1.03)` and a stronger shadow (`var(--shadow-2)`).

### Forms
*   Input fields will use a light background (`#f8fafc`), a subtle border (`1px solid var(--muted-border)`), and the standardized font stack.
*   Form labels will use `--text-primary` for better readability.

## 5. CSS Variable Cleanup

The existing `style.css` has redundant and conflicting variables. We will clean this up by removing the conflicting definitions and ensuring all components use the primary set of design tokens.

**Variables to be removed/replaced:**
*   `--primary-color`, `--secondary-color`, `--accent-color`, `--text-dark`, `--text-light`, `--background-light`, `--background-dark`, `--accent-light`, `--shadow-color`, `--border-radius`, `--transition-speed`, `--fast-transition`, `--slow-transition`, `--text-shadow-light`, `--accent-blue`, `--cta-gold-start`, `--cta-gold-end`.

**Action:** The next phase will involve modifying `style.css` to implement this cleanup and apply the standardized tokens to all components.
