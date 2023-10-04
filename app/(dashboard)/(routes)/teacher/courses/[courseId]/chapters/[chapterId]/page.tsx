import Link from "next/link";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import IconBadge from "@/components/icon-badge";
import ChapterDescForm from "./_components/ChapterDescForm";
import ChapterTitleForm from "./_components/ChapterTitleForm";
import ChapterAccessForm from "./_components/ChapterAccessForm";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

export default async function Chapter({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const { courseId, chapterId } = params;

  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await prismadb.chapter.findUnique({
    where: {
      id: chapterId,
      courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <Link
        href={`/teacher/courses/${courseId}`}
        className="flex items-center mb-6 text-sm hover:opacity-75 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to course setup
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">Chapter Creation</h1>

        <span className="text-sm text-slate-700">
          Complete all fields {completionText}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <IconBadge Icon={LayoutDashboard} />

            <h2 className="text-xl">Customize your chapter</h2>
          </div>

          <ChapterTitleForm courseId={courseId} chapter={chapter} />

          <ChapterDescForm courseId={courseId} chapter={chapter} />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <IconBadge Icon={Eye} />

              <h2 className="text-xl">Access Settings</h2>
            </div>

            <ChapterAccessForm courseId={courseId} chapter={chapter} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <IconBadge Icon={Video} />

            <h2 className="text-xl">Add a Video</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
