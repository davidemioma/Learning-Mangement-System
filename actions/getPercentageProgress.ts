import prismadb from "@/lib/prismadb";

interface Props {
  userId: string;
  courseId: string;
}

export const getPercentageProgress = async ({ userId, courseId }: Props) => {
  try {
    if (!userId || !courseId) {
      return 0;
    }

    const publishedChapters = await prismadb.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChaptersIds = publishedChapters.map((chapter) => chapter.id);

    const chaptersCompleted = await prismadb.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChaptersIds,
        },
        isCompleted: true,
      },
    });

    const percentageProgress =
      (chaptersCompleted / publishedChaptersIds.length) * 100;

    return percentageProgress;
  } catch (err) {
    return 0;
  }
};
