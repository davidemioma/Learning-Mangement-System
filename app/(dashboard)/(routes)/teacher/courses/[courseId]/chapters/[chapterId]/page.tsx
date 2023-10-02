import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

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

  return (
    <div>
      {courseId} {chapterId}
    </div>
  );
}
