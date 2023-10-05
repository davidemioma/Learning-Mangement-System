import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return new NextResponse("Course ID is required", { status: 400 });
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
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.price ||
      !course.categoryId ||
      !hasPublishedChapter
    ) {
      return new NextResponse("Missing required fields", { status: 401 });
    }

    await prismadb.course.update({
      where: { id, userId },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json("Course published");
  } catch (err) {
    console.log("PUBLISH_COURSE_ID", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
