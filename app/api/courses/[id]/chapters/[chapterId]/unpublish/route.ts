import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; chapterId: string } }
) {
  try {
    const { id, chapterId } = params;

    if (!id) {
      return new NextResponse("Course ID is required", { status: 400 });
    }

    if (!chapterId) {
      return new NextResponse("Chapter ID is required", { status: 400 });
    }

    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await prismadb.course.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await prismadb.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: id,
      },
    });

    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    await prismadb.chapter.update({
      where: {
        id: chapterId,
        courseId: id,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedChaptersInCourse = await prismadb.chapter.findMany({
      where: {
        courseId: id,
        isPublished: true,
      },
    });

    if (publishedChaptersInCourse.length === 0) {
      await prismadb.course.update({
        where: {
          id,
          userId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json("Chapter unpublished");
  } catch (err) {
    console.log("UNPUBLISH_CHAPTER_ID", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
