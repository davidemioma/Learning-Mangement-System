import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import InfoCard from "./_components/InfoCard";
import { CheckCircle, Clock } from "lucide-react";
import CourseList from "@/components/course/CourseList";
import { getDashboardCourses } from "@/actions/getDashboardCourses";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, courseInProgress } = await getDashboardCourses(
    userId
  );

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          label="In Progress"
          Icon={Clock}
          numberOfCourses={courseInProgress.length}
        />

        <InfoCard
          label="Completed"
          Icon={CheckCircle}
          variant="success"
          numberOfCourses={completedCourses.length}
        />
      </div>

      <CourseList courses={[...courseInProgress, ...completedCourses]} />
    </div>
  );
}
