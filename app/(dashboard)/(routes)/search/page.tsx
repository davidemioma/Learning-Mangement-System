import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import CourseList from "@/components/course/CourseList";
import { getCourses } from "@/actions/getCourses";
import Categories from "./_components/Categories";
import SearchInput from "@/components/SearchInput";

export default async function Search({
  searchParams,
}: {
  searchParams: {
    title: string;
    categoryId: string;
  };
}) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = await prismadb.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({ userId, ...searchParams });

  return (
    <>
      <div className="block px-6 pt-6 md:hidden md:mb-0">
        <SearchInput />
      </div>

      <div className="p-6">
        <Categories items={categories} />

        <CourseList courses={courses} />
      </div>
    </>
  );
}
