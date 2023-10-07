import { Category, Course, Purchase } from "@prisma/client";

export type CourseType = Course & {
  category: Category | null;
  chapters: { id: string }[];
  purchases: Purchase[];
  progress: number | null;
};

export type DashboardResults = {
  completedCourses: CourseType[];
  courseInProgress: CourseType[];
};
