import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CourseType } from "@/types";
import IconBadge from "../icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface Props {
  course: CourseType;
}

const CourseCard = ({ course }: Props) => {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="group h-full p-3 border rounded-lg overflow-hidden hover:shadow-sm transition">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            className="object-cover"
            src={course.imageUrl || ""}
            fill
            alt={course.title}
          />
        </div>

        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {course.title}
          </div>

          <p className="text-xs text-muted-foreground">
            {course.category?.name}
          </p>

          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" Icon={BookOpen} />

              <span>
                {course.chapters.length}{" "}
                {course.chapters.length === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>

          {course.progress !== null ? (
            <div>progress</div>
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700">
              {formatPrice(course.price || 0)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
