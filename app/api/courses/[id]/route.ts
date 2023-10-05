import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export async function DELETE(
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

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    await prismadb.course.delete({
      where: {
        id,
        userId,
      },
    });

    return NextResponse.json("Course delected");
  } catch (err) {
    console.log("DELETE_COURSE", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}

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

    const values = await request.json();

    await prismadb.course.update({
      where: {
        id,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json("Course updated");
  } catch (err) {
    console.log("UPDATE_COURSE", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
