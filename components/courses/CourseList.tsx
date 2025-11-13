import React from 'react';
import { Course } from '../../types/course';
import CourseCard from './CourseCard';

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onToggleFeatured: (courseId: string) => void;
  onToggleBestseller: (courseId: string) => void;
  onChangeStatus: (courseId: string, status: Course['status']) => void;
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  onEdit,
  onDelete,
  onToggleFeatured,
  onToggleBestseller,
  onChangeStatus,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFeatured={onToggleFeatured}
          onToggleBestseller={onToggleBestseller}
          onChangeStatus={onChangeStatus}
        />
      ))}
    </div>
  );
};

export default CourseList;
