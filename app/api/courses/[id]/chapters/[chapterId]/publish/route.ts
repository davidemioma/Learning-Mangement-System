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

    const muxData = await prismadb.muxData.findFirst({
      where: {
        chapterId,
      },
    });

    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await prismadb.chapter.update({
      where: {
        id: chapterId,
        courseId: id,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json("Chapter published");
  } catch (err) {
    console.log("PUBLISH_CHAPTER_ID", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
