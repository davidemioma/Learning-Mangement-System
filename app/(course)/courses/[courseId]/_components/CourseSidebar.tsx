import React from "react";
import CourseSidebarItem from "./CourseSidebarItem";
import CourseProgress from "@/components/CourseProgress";
import { Chapter, Course, Purchase, UserProgress } from "@prisma/client";

interface Props {
  course: Course & {
    chapters: (Chapter & {
      usersProgress: UserProgress[] | null;
    })[];
  };
  percentageProgress: number;
  purchase: Purchase | null;
}

const CourseSidebar = ({ course, percentageProgress, purchase }: Props) => {
  return (
    <div className="h-full flex flex-col border-r shadow-sm overflow-y-auto">
      <div className="flex flex-col p-8 border-b">
        <h1 className="font-semibold">{course.title}</h1>

        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={percentageProgress} />
          </div>
        )}
      </div>

      <div className="w-full flex flex-col">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            courseId={course.id}
            chapter={chapter}
            purchase={purchase}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
