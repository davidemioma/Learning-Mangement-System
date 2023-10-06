import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

export default async function Course({
  params,
}: {
  params: { courseId: string };
}) {
  const { courseId } = params;

  const course = await prismadb.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
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

  return redirect(`/courses/${courseId}/chapters/${course.chapters?.[0]?.id}`);
}
