import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
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

    const { url } = await request.json();

    const course = await prismadb.course.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prismadb.attachment.create({
      data: {
        url,
        courseId: id,
        name: url.split("/").pop(),
      },
    });

    return NextResponse.json("Attachment Created");
  } catch (err) {
    console.log("ADD_ATTACHMENT", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
