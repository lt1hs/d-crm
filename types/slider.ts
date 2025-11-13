export interface Slide {
  id: string;
  title: string;
  titleAr?: string;
  titleFa?: string;
  description?: string;
  descriptionAr?: string;
  descriptionFa?: string;
  imageUrl: string;
  linkUrl?: string;
  linkText?: string;
  linkTextAr?: string;
  linkTextFa?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Slider {
  id: string;
  name: string;
  location: string;
  slides: Slide[];
  settings: SliderSettings;
  createdAt: string;
  updatedAt: string;
}

export interface SliderSettings {
  autoplay: boolean;
  autoplaySpeed: number; // in milliseconds
  showArrows: boolean;
  showDots: boolean;
  infinite: boolean;
  transition: 'slide' | 'fade';
  height: 'auto' | 'fixed';
  fixedHeight?: number; // in pixels
}

export interface SliderLocation {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export type SlideFormData = Omit<Slide, 'id' | 'createdAt' | 'updatedAt'>;
