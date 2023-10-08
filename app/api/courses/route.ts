import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { isTeacher } from "@/lib/teacher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title } = await request.json();

    const course = await prismadb.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(course);
  } catch (err) {
    console.log("CREATE_COURSE", err);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
