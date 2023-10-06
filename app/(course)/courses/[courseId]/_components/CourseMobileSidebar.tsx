import React from "react";
import { Menu } from "lucide-react";
import CourseSidebar from "./CourseSidebar";
import { Chapter, Course, UserProgress, Purchase } from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Props {
  course: Course & {
    chapters: (Chapter & {
      usersProgress: UserProgress[] | null;
    })[];
  };
  percentageProgress: number;
  purchase: Purchase | null;
}

const CourseMobileSidebar = ({
  course,
  purchase,
  percentageProgress,
}: Props) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>

      <SheetContent side="left" className="p-0 bg-white w-72">
        <CourseSidebar
          course={course}
          purchase={purchase}
          percentageProgress={percentageProgress}
        />
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSidebar;
