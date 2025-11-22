import React, { useState, useEffect } from 'react';
import { Slider, Slide, SliderLocation } from '../../types/slider';
import { getDefaultSliderSettings, sortSlides } from '../../utils/sliderHelpers';
import SliderLocationSelector from './SliderLocationSelector';
import SlideList from './SlideList';
import SlideForm from './SlideForm';
import SliderSettings from './SliderSettings';
import SliderPreview from './SliderPreview';
import { IconPlus, IconSave, IconSettings, IconEye, IconImage } from '../Icons';

const SLIDER_LOCATIONS: SliderLocation[] = [
  { id: 'home-hero', name: 'Home Hero', slug: 'home-hero', description: 'Main homepage slider' },
  { id: 'home-features', name: 'Home Features', slug: 'home-features', description: 'Features section' },
  { id: 'about-banner', name: 'About Banner', slug: 'about-banner', description: 'About page banner' },
  { id: 'testimonials', name: 'Testimonials', slug: 'testimonials', description: 'Customer testimonials' },
];

const SliderManagement: React.FC = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('home-hero');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [showSlideForm, setShowSlideForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentSettings, setCurrentSettings] = useState(getDefaultSliderSettings());

  // Load sliders from localStorage
  useEffect(() => {
    const savedSliders = localStorage.getItem('sliders');
    if (savedSliders) {
      setSliders(JSON.parse(savedSliders));
    } else {
      // Initialize with empty sliders for each location
      const initialSliders: Slider[] = SLIDER_LOCATIONS.map(loc => ({
        id: loc.id,
        name: loc.name,
        location: loc.slug,
        slides: [],
        settings: getDefaultSliderSettings(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setSliders(initialSliders);
      localStorage.setItem('sliders', JSON.stringify(initialSliders));
    }
  }, []);

  // Load slides for selected location
  useEffect(() => {
    const slider = sliders.find(s => s.location === selectedLocation);
    if (slider) {
      setSlides(slider.slides);
      setCurrentSettings(slider.settings);
    }
  }, [selectedLocation, sliders]);

  const handleSaveSlider = () => {
    const updatedSliders = sliders.map(slider => {
      if (slider.location === selectedLocation) {
        return {
          ...slider,
          slides: slides,
          settings: currentSettings,
          updatedAt: new Date().toISOString(),
        };
      }
      return slider;
    });
    setSliders(updatedSliders);
    localStorage.setItem('sliders', JSON.stringify(updatedSliders));
  };

  const handleAddSlide = (slide: Slide) => {
    setSlides([...slides, slide]);
    setShowSlideForm(false);
  };

  const handleUpdateSlide = (slide: Slide) => {
    setSlides(slides.map(s => s.id === slide.id ? slide : s));
    setEditingSlide(null);
    setShowSlideForm(false);
  };

  const handleDeleteSlide = (slideId: string) => {
    setSlides(slides.filter(s => s.id !== slideId));
  };

  const handleReorder = (reorderedSlides: Slide[]) => {
    setSlides(reorderedSlides);
  };

  const sortedSlides = sortSlides(slides);

  return (
    <div className="h-full flex flex-col space-y-5">
      {/* Header */}
      <div className="flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <IconImage className="w-5 h-5 text-blue-600" />
              Slider Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Create and manage image sliders
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                showPreview
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <IconEye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                showSettings
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <IconSettings className="w-3.5 h-3.5" />
              Settings
            </button>
            <button
              onClick={() => {
                setEditingSlide(null);
                setShowSlideForm(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <IconPlus className="w-3.5 h-3.5" />
              Add Slide
            </button>
            <button
              onClick={handleSaveSlider}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <IconSave className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Slider Location Selector */}
      <div className="flex-shrink-0">
        <SliderLocationSelector
          locations={SLIDER_LOCATIONS}
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
        />
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="flex-shrink-0 animate-in slide-in-from-top duration-300">
          <SliderPreview 
            slides={sortedSlides.filter(s => s.isActive)} 
            settings={currentSettings}
          />
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="flex-shrink-0 animate-in slide-in-from-top duration-300">
          <SliderSettings
            settings={currentSettings}
            onUpdate={setCurrentSettings}
            onClose={() => setShowSettings(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">
        {/* Slides List */}
        <div className={`${showSlideForm ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col min-h-0`}>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-md border border-gray-200/50 dark:border-gray-700/50 flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 p-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
                    Slides
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {slides.length} {slides.length === 1 ? 'slide' : 'slides'} • Drag to reorder
                  </p>
                </div>
                {slides.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-medium">
                      {slides.filter(s => s.isActive).length} Active
                    </span>
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded font-medium">
                      {slides.filter(s => !s.isActive).length} Inactive
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {slides.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-3">
                    <IconImage className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
                    No slides yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-3 max-w-sm text-sm">
                    Create beautiful image sliders with captions and call-to-action buttons. Perfect for showcasing your content.
                  </p>
                  <button
                    onClick={() => {
                      setEditingSlide(null);
                      setShowSlideForm(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <IconPlus className="w-3.5 h-3.5" />
                    Add Your First Slide
                  </button>
                </div>
              ) : (
                <SlideList
                  slides={sortedSlides}
                  onEdit={(slide) => {
                    setEditingSlide(slide);
                    setShowSlideForm(true);
                  }}
                  onDelete={handleDeleteSlide}
                  onReorder={handleReorder}
                />
              )}
            </div>
          </div>
        </div>

        {/* Slide Form */}
        {showSlideForm && (
          <div className="lg:col-span-4 flex flex-col min-h-0 animate-in slide-in-from-right duration-300">
            <SlideForm
              slide={editingSlide}
              existingSlides={slides}
              onSave={editingSlide ? handleUpdateSlide : handleAddSlide}
              onCancel={() => {
                setShowSlideForm(false);
                setEditingSlide(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderManagement;
