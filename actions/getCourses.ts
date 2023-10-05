import prismadb from "@/lib/prismadb";
import { getPercentageProgress } from "./getPercentageProgress";

interface Props {
  userId: string;
  title?: string;
  categoryId?: string;
}

export const getCourses = async ({ userId, title, categoryId }: Props) => {
  try {
    if (!userId) return [];

    const courses = await prismadb.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
          mode: "insensitive",
        },
        categoryId,
      },
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
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }

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

    return coursesWithProgress;
  } catch (err) {
    return [];
  }
};
