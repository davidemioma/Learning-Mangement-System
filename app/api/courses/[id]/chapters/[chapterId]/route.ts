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

    if (chapter?.videoUrl) {
      //Check if there is an existing mux data
      const existingMuxData = await prismadb.muxData.findFirst({
        where: {
          chapterId,
        },
      });

      //Delete the video from Mux storage and delete Mux data if there's an existing Mux data
      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);

        await prismadb.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    await prismadb.chapter.delete({
      where: {
        id: chapterId,
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

    return NextResponse.json("Chapter deleted");
  } catch (err) {
    console.log("DELETE_CHAPTER_ID", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}

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

    const { isPublished, videoUrl, ...values } = await request.json();

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

    if (videoUrl) {
      //Check if there is an existing mux data
      const existingMuxData = await prismadb.muxData.findFirst({
        where: {
          chapterId,
        },
      });

      //Delete the video from Mux storage and delete Mux data if there's an existing Mux data
      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId);

        await prismadb.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      //If there is no Mux data and a new one and add video to Mux storage
      const asset = await Video.Assets.create({
        input: videoUrl,
        playback_policy: "public",
        test: false,
      });

      await prismadb.muxData.create({
        data: {
          chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });

      await prismadb.chapter.update({
        where: {
          id: chapterId,
          courseId: id,
        },
        data: {
          videoUrl,
        },
      });
    }

    return NextResponse.json("Chapter updated");
  } catch (err) {
    console.log("UPDATE_CHAPTER_ID", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
