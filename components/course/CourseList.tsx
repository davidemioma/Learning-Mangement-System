import React from "react";
import { CourseType } from "@/types";
import CourseCard from "./CourseCard";

interface Props {
  courses: CourseType[];
}

const CourseList = ({ courses }: Props) => {
  if (courses.length === 0) {
    return (
      <div className="py-10 px-6 text-lg text-center text-muted-foreground italic">
        No courses available!
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
