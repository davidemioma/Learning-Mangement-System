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

    const { isPublished, ...values } = await request.json();

    const course = await prismadb.course.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prismadb.chapter.update({
      where: {
        id: chapterId,
        courseId: id,
      },
      data: {
        ...values,
      },
    });

    //Todo for vidoeUrl

    return NextResponse.json("Chapter updated");
  } catch (err) {
    console.log("UPDATE_CHAPTER_ID", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
