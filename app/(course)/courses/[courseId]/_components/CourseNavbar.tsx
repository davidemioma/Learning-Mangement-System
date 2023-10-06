import React from "react";
import NavRoutes from "@/components/navbar/NavRoutes";
import CourseMobileSidebar from "./CourseMobileSidebar";
import { Chapter, Course, UserProgress, Purchase } from "@prisma/client";

interface Props {
  course: Course & {
    chapters: (Chapter & {
      usersProgress: UserProgress[] | null;
    })[];
  };
  percentageProgress: number;
  purchase: Purchase | null;
}

const CourseNavbar = ({ course, purchase, percentageProgress }: Props) => {
  return (
    <div className="bg-white h-full flex items-center p-4 border-b shadow-sm">
      <CourseMobileSidebar
        course={course}
        purchase={purchase}
        percentageProgress={percentageProgress}
      />

      <NavRoutes />
    </div>
  );
};

export default CourseNavbar;
