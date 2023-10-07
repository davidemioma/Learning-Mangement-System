import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PUT(
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

    const { isCompleted } = await request.json();

    const course = await prismadb.course.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
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

    await prismadb.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });

    return NextResponse.json("Progress Updated");
  } catch (err) {
    console.log("CHAPTER_PROGRESS_UPDATE", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
