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
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    await prismadb.course.update({
      where: { id, userId },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json("Course unpublished");
  } catch (err) {
    console.log("UNPUBLISH_COURSE_ID", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
