import React from 'react';
import { Testimonial } from '../../types/testimonial';
import TestimonialCard from './TestimonialCard';

interface TestimonialListProps {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (testimonialId: string) => void;
  onToggleFeatured: (testimonialId: string) => void;
  onChangeStatus: (testimonialId: string, status: Testimonial['status']) => void;
}

const TestimonialList: React.FC<TestimonialListProps> = ({
  testimonials,
  onEdit,
  onDelete,
  onToggleFeatured,
  onChangeStatus,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {testimonials.map((testimonial) => (
        <TestimonialCard
          key={testimonial.id}
          testimonial={testimonial}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFeatured={onToggleFeatured}
          onChangeStatus={onChangeStatus}
        />
      ))}
    </div>
  );
};

export default TestimonialList;
