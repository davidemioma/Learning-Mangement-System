import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import CourseNavbar from "./_components/CourseNavbar";
import CourseSidebar from "./_components/CourseSidebar";
import { getPercentageProgress } from "@/actions/getPercentageProgress";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const { userId } = auth();

  const { courseId } = params;

  if (!userId) {
    return redirect("/");
  }

  const course = await prismadb.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          usersProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const percentageProgress = await getPercentageProgress({
    userId,
    courseId: course.id,
  });

  const purcahse = await prismadb.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="h-full">
      <div className="hidden md:flex md:flex-col fixed inset-y-0 h-full w-80 z-50">
        <CourseSidebar
          course={course}
          purchase={purcahse}
          percentageProgress={percentageProgress}
        />
      </div>

      <div className="md:pl-80 fixed inset-y-0 w-full h-[80px] z-50">
        <CourseNavbar
          course={course}
          purchase={purcahse}
          percentageProgress={percentageProgress}
        />
      </div>

      <main className="h-full pt-[80px] md:pl-80">{children}</main>
    </div>
  );
}
