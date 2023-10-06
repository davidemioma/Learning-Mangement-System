import prismadb from "@/lib/prismadb";
import { Attachment, Chapter } from "@prisma/client";

interface Props {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({ userId, courseId, chapterId }: Props) => {
  try {
    if (!userId || !courseId || !chapterId) {
      return null;
    }

    const course = await prismadb.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      select: {
        price: true,
      },
    });

    const purchase = await prismadb.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const chapter = await prismadb.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
        isPublished: true,
      },
    });

    if (!chapter || !course) {
      return null;
    }

    let muxData = null;

    let attachments: Attachment[] | null = null;

    let nextChapter: Chapter | null = null;

    if (purchase) {
      attachments = await prismadb.attachment.findMany({
        where: {
          courseId,
        },
      });
    }

    if (purchase || chapter.isFree) {
      muxData = await prismadb.muxData.findUnique({
        where: {
          chapterId,
        },
      });

      nextChapter = await prismadb.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }

    const userProgress = await prismadb.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    return {
      course,
      chapter,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (err) {
    console.log("GET_CHAPTER", err);

    return null;
  }
};
