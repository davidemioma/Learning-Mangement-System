import prismadb from "@/lib/prismadb";
import { CourseType, DashboardResults } from "@/types";
import { getPercentageProgress } from "./getPercentageProgress";

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardResults> => {
  if (!userId) {
    return {
      completedCourses: [],
      courseInProgress: [],
    };
  }

  try {
    const purchasedCourses = await prismadb.purchase.findMany({
      where: {
        userId,
      },
      include: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map((item) => item.course) as CourseType[];

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        const percentageProgress = await getPercentageProgress({
          userId,
          courseId: course.id,
        });

        return {
          ...course,
          progress: percentageProgress,
        };
      })
    );

    const completedCourses = coursesWithProgress.filter(
      (course) => course.progress === 100
    );

    const courseInProgress = coursesWithProgress.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return {
      completedCourses,
      courseInProgress,
    };
  } catch (err) {
    return {
      completedCourses: [],
      courseInProgress: [],
    };
  }
};
