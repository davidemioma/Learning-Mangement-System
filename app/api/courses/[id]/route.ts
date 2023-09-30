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
