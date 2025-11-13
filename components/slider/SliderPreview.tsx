import React, { useState, useEffect } from 'react';
import { Slide, SliderSettings } from '../../types/slider';
import { IconChevronLeft, IconChevronRight, IconEye, IconImage } from '../Icons';

interface SliderPreviewProps {
  slides: Slide[];
  settings: SliderSettings;
}

const SliderPreview: React.FC<SliderPreviewProps> = ({ slides, settings }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!settings.autoplay || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (settings.infinite) {
          return (prev + 1) % slides.length;
        }
        return prev < slides.length - 1 ? prev + 1 : 0;
      });
    }, settings.autoplaySpeed);

    return () => clearInterval(interval);
  }, [settings.autoplay, settings.autoplaySpeed, settings.infinite, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      if (settings.infinite) {
        return prev === 0 ? slides.length - 1 : prev - 1;
      }
      return prev > 0 ? prev - 1 : prev;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      if (settings.infinite) {
        return (prev + 1) % slides.length;
      }
      return prev < slides.length - 1 ? prev + 1 : prev;
    });
  };

  if (slides.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <IconEye className="w-4 h-4" />
            Slider Preview
          </h3>
        </div>
        <div className="p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconImage className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            No active slides to preview
          </p>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];
  const heightClass = settings.height === 'fixed' ? '' : 'min-h-[400px]';
  const heightStyle = settings.height === 'fixed' && settings.fixedHeight
    ? { height: `${settings.fixedHeight}px` }
    : undefined;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <IconEye className="w-4 h-4" />
          Slider Preview
        </h3>
      </div>

      <div className={`relative ${heightClass}`} style={heightStyle}>
        {/* Slides */}
        <div className="relative w-full h-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`
                absolute inset-0 transition-all duration-500
                ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                ${settings.transition === 'slide' 
                  ? index === currentIndex 
                    ? 'translate-x-0' 
                    : index < currentIndex 
                      ? '-translate-x-full' 
                      : 'translate-x-full'
                  : ''
                }
              `}
            >
              {/* Background Image */}
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex items-end">
                <div className="p-8 text-white max-w-3xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">
                    {slide.title}
                  </h2>
                  {slide.description && (
                    <p className="text-lg mb-4 text-gray-100">
                      {slide.description}
                    </p>
                  )}
                  {slide.linkUrl && slide.linkText && (
                    <a
                      href={slide.linkUrl}
                      className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      {slide.linkText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {settings.showArrows && slides.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg"
              aria-label="Previous slide"
            >
              <IconChevronLeft className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg"
              aria-label="Next slide"
            >
              <IconChevronRight className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </button>
          </>
        )}

        {/* Dots Navigation */}
        {settings.showDots && slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`
                  w-2 h-2 rounded-full transition-all
                  ${index === currentIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75'
                  }
                `}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderPreview;
