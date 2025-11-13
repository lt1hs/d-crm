import React from 'react';
import { Slide } from '../../types/slider';
import SlideListItem from './SlideListItem';

interface SlideListProps {
  slides: Slide[];
  onEdit: (slide: Slide) => void;
  onDelete: (slideId: string) => void;
  onReorder: (slides: Slide[]) => void;
}

const SlideList: React.FC<SlideListProps> = ({ slides, onEdit, onDelete, onReorder }) => {
  return (
    <div className="space-y-3">
      {slides.map((slide) => (
        <SlideListItem
          key={slide.id}
          slide={slide}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SlideList;
