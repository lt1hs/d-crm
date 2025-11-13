import { Slide, SliderSettings } from '../types/slider';

export const generateSlideId = (): string => {
  return `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const sortSlides = (slides: Slide[]): Slide[] => {
  return [...slides].sort((a, b) => a.order - b.order);
};

export const getActiveSlides = (slides: Slide[]): Slide[] => {
  return slides.filter(slide => slide.isActive);
};

export const getDefaultSliderSettings = (): SliderSettings => {
  return {
    autoplay: true,
    autoplaySpeed: 5000,
    showArrows: true,
    showDots: true,
    infinite: true,
    transition: 'slide',
    height: 'auto',
  };
};

export const validateImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check if it's a valid URL or data URL
  try {
    if (url.startsWith('data:image/')) return true;
    new URL(url);
    return true;
  } catch {
    // Check if it's a relative path
    return url.startsWith('/') || url.startsWith('./');
  }
};
