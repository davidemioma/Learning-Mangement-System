"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { Chapter, Purchase, UserProgress } from "@prisma/client";

interface Props {
  courseId: string;
  chapter: Chapter & {
    usersProgress: UserProgress[] | null;
  };
  purchase: Purchase | null;
}

const CourseSidebarItem = ({ courseId, chapter, purchase }: Props) => {
  const router = useRouter();

  const pathname = usePathname();

  const isLocked = !chapter.isFree && !purchase;

  const isActive = pathname.includes(chapter.id);

  const isCompleted = !!chapter.usersProgress?.[0]?.isCompleted;

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${chapter.id}`);
  };

  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-2 pl-6 text-slate-500 text-sm font-[500] transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "bg-slate-200/20 text-slate-700 hover:bg-slate-200/20 hover:text-slate-700",
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isCompleted && isActive && "bg-emerald-200/20"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-500",
            isActive && "text-slate-700",
            isCompleted && "text-emerald-700"
          )}
        />

        <span>{chapter.title}</span>
      </div>

      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
          isActive && "opacity-100",
          isCompleted && "border-emerald-700"
        )}
      />
    </button>
  );
};

export default CourseSidebarItem;
