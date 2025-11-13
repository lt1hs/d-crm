# Branding Update - AL-DALEEL-CRM

## Overview
Updated the application branding from "Aspire HR Dashboard" to "AL-DALEEL-CRM" with custom logo integration.

## Changes Made

### 1. Logo Integration
- **Location**: `/imgs/logo.png`
- **Usage**: Sidebar header and browser favicon
- **Dimensions**: 32x32px (w-8 h-8) in sidebar
- **Fallback**: Graceful image loading with object-contain

### 2. Application Name
Changed from "Aspire HR Dashboard" to "AL-DALEEL-CRM" in:

#### Sidebar Component (`components/Sidebar.tsx`)
- Updated header to display logo image instead of icon
- Changed text from "Aspire HR" to "AL-DALEEL-CRM"
- Implemented smart logo display:
  - **Expanded state**: Logo + full name
  - **Collapsed state**: Logo only
- Added expand/collapse button with proper positioning

#### HTML Document (`index.html`)
- Updated page title: "AL-DALEEL-CRM - Content Management System"
- Updated meta description: "AL-DALEEL-CRM - Modern CRM and Content Management System"
- Changed favicon from `/vite.svg` to `/imgs/logo.png`

#### Constants File (`config/constants.ts`)
- Updated `APP_NAME` constant from "Aspire HR Dashboard" to "AL-DALEEL-CRM"

## Logo Implementation Details

### Sidebar Header Structure
```tsx
{isCollapsed ? (
  // Collapsed: Show logo only
  <img src="/imgs/logo.png" alt="AL-DALEEL-CRM Logo" />
) : (
  // Expanded: Show logo + name
  <div>
    <img src="/imgs/logo.png" alt="AL-DALEEL-CRM Logo" />
    <span>AL-DALEEL-CRM</span>
  </div>
)}
```

### Responsive Behavior
- **Desktop (Expanded)**: Logo (32x32px) + "AL-DALEEL-CRM" text
- **Desktop (Collapsed)**: Logo only (32x32px)
- **Mobile**: Full logo and name visible
- **Smooth transitions**: 300ms duration for expand/collapse

### Styling
- Logo container: `flex-shrink-0` to prevent squishing
- Image: `object-contain` to maintain aspect ratio
- Text: `font-bold text-lg` with proper color theming
- Dark mode support: Automatic color adaptation

## Browser Tab
- **Title**: "AL-DALEEL-CRM - Content Management System"
- **Favicon**: `/imgs/logo.png` (PNG format)
- **Description**: Updated for SEO and clarity

## Accessibility
- Proper `alt` text: "AL-DALEEL-CRM Logo"
- ARIA labels for expand/collapse buttons
- Semantic HTML structure
- Keyboard navigation support

## File Locations
```
/imgs/logo.png                    # Logo image file
/index.html                       # Page title and favicon
/components/Sidebar.tsx           # Sidebar header with logo
/config/constants.ts              # App name constant
```

## Visual Consistency
- Logo appears in:
  1. Sidebar header (always visible)
  2. Browser tab (favicon)
  3. Future: Could be added to login page, emails, etc.

## Technical Notes
- Logo path uses absolute path from public directory: `/imgs/logo.png`
- Image loading is optimized with proper sizing
- No external dependencies required
- Works with existing dark/light theme system
- RTL support maintained for Arabic/Persian languages

## Future Enhancements
1. Add logo to login/authentication pages
2. Create different logo variants (light/dark mode specific)
3. Add loading placeholder for logo
4. Implement logo animation on hover
5. Add company tagline below logo
6. Create branded email templates
7. Add logo to PDF exports/reports

## Testing Checklist
- [x] Logo displays correctly in expanded sidebar
- [x] Logo displays correctly in collapsed sidebar
- [x] Favicon appears in browser tab
- [x] Page title shows "AL-DALEEL-CRM"
- [x] Dark mode compatibility
- [x] Light mode compatibility
- [x] Responsive behavior on mobile
- [x] Image loading gracefully handles errors
- [x] Accessibility features working
- [x] RTL support maintained

## Brand Identity
**Name**: AL-DALEEL-CRM
**Type**: CRM and Content Management System
**Target**: Modern businesses needing comprehensive content and customer management
**Key Features**: Multi-language support, Dark mode, Responsive design, Comprehensive content management
