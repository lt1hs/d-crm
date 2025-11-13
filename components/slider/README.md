# Slider Management System

A comprehensive slider/carousel management system for the Aspire HR Dashboard with live preview and customizable settings.

## Features

- **Multi-location Support**: Create sliders for different sections (Home Hero, Features, About Banner, Testimonials)
- **Multi-language**: Support for English, Arabic, and Persian translations
- **Image Management**: Add images with titles, descriptions, and call-to-action buttons
- **Live Preview**: Real-time preview with working navigation and autoplay
- **Customizable Settings**:
  - Autoplay with adjustable speed
  - Navigation arrows
  - Dot indicators
  - Infinite loop
  - Transition effects (Slide/Fade)
  - Height modes (Auto/Fixed)
- **Drag & Drop Ready**: UI prepared for reordering slides
- **Active/Inactive States**: Toggle slide visibility
- **LocalStorage Persistence**: Sliders are saved locally

## Components

### SliderManagement
Main orchestrator component for the entire slider system.

### SliderLocationSelector
Switch between different slider locations.

### SlideForm
Form for creating and editing slides with multi-language support and image preview.

### SlideList & SlideListItem
Display slides with thumbnails, edit/delete actions.

### SliderSettings
Configure slider behavior (autoplay, arrows, dots, transitions, etc.)

### SliderPreview
Live, interactive preview of the slider with working navigation and autoplay.

## Usage

1. Click on "Sliders" in the sidebar
2. Select a slider location
3. Click "Add Slide" to create a new slide
4. Fill in the form with image URL, title, description, and optional link
5. Click "Settings" to customize slider behavior
6. Click "Show Preview" to see the slider in action
7. Click "Save Slider" to persist changes

## Data Structure

Sliders are stored in localStorage:

```typescript
{
  id: string;
  name: string;
  location: string;
  slides: Slide[];
  settings: SliderSettings;
  createdAt: string;
  updatedAt: string;
}
```

Each Slide contains:
- Multi-language titles and descriptions
- Image URL with preview
- Optional link with CTA text
- Order and active status

Settings include:
- Autoplay configuration
- Navigation controls
- Transition effects
- Height management

## Preview Features

The preview component includes:
- Automatic slide transitions
- Manual navigation with arrows
- Dot indicators for quick navigation
- Smooth transitions (slide or fade)
- Responsive design
- Dark mode support
