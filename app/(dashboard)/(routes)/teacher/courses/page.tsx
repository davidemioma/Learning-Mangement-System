import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { columns } from "./_components/Columns";
import { DataTable } from "./_components/DataTable";

export default async function Courses() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await prismadb.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
}
