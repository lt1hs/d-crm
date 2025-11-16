# Aspire HR Dashboard - Content Management Features

This document outlines the content management features implemented in the Aspire HR Dashboard.

## Implemented Features

### 1. Menu Management System
**Location**: `components/menu/`

A comprehensive menu creation and management system with:
- Multi-location support (Header, Footer, Sidebar, Mobile)
- Hierarchical menu structure with unlimited nesting
- Multi-language support (English, Arabic, Persian)
- Drag & drop ready interface for reordering
- Active/Inactive toggle for menu items
- External link support with target options
- Icon support for menu items
- Live preview of menu structure
- LocalStorage persistence

**Key Components**:
- `MenuManagement.tsx` - Main orchestrator
- `MenuForm.tsx` - Create/edit menu items
- `MenuList.tsx` & `MenuListItem.tsx` - Display menu structure
- `MenuLocationSelector.tsx` - Switch between menu locations
- `MenuPreview.tsx` - Live menu preview

**Usage**: Click "Menu" in the sidebar to access the menu management page.

---

### 2. Slider Management System
**Location**: `components/slider/`

A full-featured slider/carousel management system with:
- Multi-location support (Home Hero, Features, About Banner, Testimonials)
- Multi-language support (English, Arabic, Persian)
- Image management with preview
- Titles, descriptions, and call-to-action buttons
- Live interactive preview with working navigation
- Comprehensive settings:
  - Autoplay with adjustable speed
  - Navigation arrows toggle
  - Dot indicators toggle
  - Infinite loop option
  - Transition effects (Slide/Fade)
  - Height modes (Auto/Fixed)
- Drag & drop ready interface
- Active/Inactive toggle for slides
- LocalStorage persistence

**Key Components**:
- `SliderManagement.tsx` - Main orchestrator
- `SlideForm.tsx` - Create/edit slides with image preview
- `SlideList.tsx` & `SlideListItem.tsx` - Display slides with thumbnails
- `SliderLocationSelector.tsx` - Switch between slider locations
- `SliderSettings.tsx` - Configure slider behavior
- `SliderPreview.tsx` - Live, interactive slider preview

**Usage**: Click "Sliders" in the sidebar to access the slider management page.

---

## Technical Details

### Type Definitions
- `types/menu.ts` - Menu and MenuItem interfaces
- `types/slider.ts` - Slider, Slide, and SliderSettings interfaces

### Utility Functions
- `utils/menuHelpers.ts` - Menu tree building and manipulation
- `utils/sliderHelpers.ts` - Slide sorting and validation

### Data Persistence
Both systems use browser localStorage for data persistence:
- Menus: `localStorage.getItem('menus')`
- Sliders: `localStorage.getItem('sliders')`

### Multi-language Support
All content supports three languages:
- English (default)
- Arabic (RTL support)
- Persian/Farsi (RTL support)

### Navigation
The app uses a simple page-based navigation system:
- `App.tsx` manages the current page state
- `Sidebar.tsx` handles navigation between pages
- Pages: Dashboard, Menu, Slider (extensible for more)

---

## Future Enhancements

Potential improvements for both systems:

1. **Drag & Drop Implementation**
   - Currently UI-ready, needs functional implementation
   - Use libraries like `react-beautiful-dnd` or `@dnd-kit/core`

2. **Image Upload**
   - Add file upload functionality for sliders
   - Image optimization and CDN integration

3. **Export/Import**
   - Export menus/sliders as JSON
   - Import from JSON files
   - Backup and restore functionality

4. **API Integration**
   - Replace localStorage with backend API
   - Real-time synchronization
   - Multi-user support

5. **Advanced Features**
   - Menu item permissions/roles
   - Slider scheduling (start/end dates)
   - Analytics integration
   - A/B testing support

6. **Additional Content Types**
   - Books management
   - News/Articles
   - Videos
   - Products
   - And more...

---

## Development Notes

### Adding New Content Types

To add a new content management section:

1. Create types in `types/[content-type].ts`
2. Create utility functions in `utils/[content-type]Helpers.ts`
3. Create components in `components/[content-type]/`
4. Add page to `App.tsx` navigation
5. Add sidebar item in `Sidebar.tsx`
6. Update translation keys in `types.ts` and `context/LanguageContext.tsx`

### Code Quality
- All components use TypeScript for type safety
- Accessibility features included (ARIA labels, keyboard navigation)
- Dark mode support throughout
- Responsive design for mobile/tablet/desktop
- RTL language support

---

## Getting Started

1. Start the development server: `npm run dev`
2. Navigate to Menu or Slider management from the sidebar
3. Create your first menu or slider
4. Use the preview feature to see your changes
5. Save to persist to localStorage

For more details, see the README files in each component directory:
- `components/menu/README.md`
- `components/slider/README.md`
