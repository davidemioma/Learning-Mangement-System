import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; attachmentId: string } }
) {
  try {
    const { id, attachmentId } = params;

    if (!id) {
      return new NextResponse("Course ID is required", { status: 400 });
    }

    if (!attachmentId) {
      return new NextResponse("Attachment ID is required", { status: 400 });
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

    await prismadb.attachment.delete({
      where: {
        id: attachmentId,
        courseId: id,
      },
    });

    return NextResponse.json("Attachment delected");
  } catch (err) {
    console.log("DELETE_ATTACHMENT", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
