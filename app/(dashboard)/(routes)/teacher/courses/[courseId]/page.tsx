import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import TitleForm from "./_components/TitleForm";
import IconBadge from "@/components/icon-badge";
import ImageForm from "./_components/ImageForm";
import PriceForm from "./_components/PriceForm";
import ChapterForm from "./_components/ChapterForm";
import CategoryForm from "./_components/CategoryForm";
import AttachmentsForm from "./_components/AttachmentsForm";
import DescriptionForm from "./_components/DescriptionForm";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

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
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await prismadb.category.findMany({
    orderBy: {
      name: "asc",
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
    course.chapters.some((chapter) => chapter.isPublished),
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

          <DescriptionForm course={course} />

          <ImageForm course={course} />

          <CategoryForm
            course={course}
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <IconBadge Icon={ListChecks} />

              <h2 className="text-xl">Course Chapters</h2>
            </div>

            <ChapterForm course={course} />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <IconBadge Icon={CircleDollarSign} />

              <h2 className="text-xl">Sell Your Course</h2>
            </div>

            <PriceForm course={course} />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <IconBadge Icon={File} />

              <h2 className="text-xl">Resources & Attachments</h2>
            </div>

            <AttachmentsForm course={course} />
          </div>
        </div>
      </div>
    </div>
  );
}
