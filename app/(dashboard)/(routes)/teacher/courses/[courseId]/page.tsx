import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import TitleForm from "./_components/TitleForm";
import IconBadge from "@/components/ui/icon-badge";

export default async function CoursePage({
  params,
}: {
  params: {
    courseId: string;
  };
}) {
  const { courseId } = params;

  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await prismadb.course.findUnique({
    where: {
      id: courseId,
      userId,
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.price,
    course.imageUrl,
    course.categoryId,
    course.description,
  ];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">Course Setup</h1>

        <p className="text-sm text-slate-700">
          Complete all fields {completionText}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <IconBadge Icon={LayoutDashboard} />

            <h2 className="text-xl">Customize your course</h2>
          </div>

          <TitleForm course={course} />
        </div>

        <div></div>
      </div>
    </div>
  );
}
