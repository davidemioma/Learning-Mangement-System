import { File } from "lucide-react";
import { auth } from "@clerk/nextjs";
import Banner from "@/components/Banner";
import Preview from "@/components/Preview";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/getChapter";
import VideoPlayer from "./_components/VideoPlayer";
import { Separator } from "@/components/ui/separator";
import CourseEnrollButton from "./_components/CourseEnrollButton";

export default async function Chapter({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const { userId } = auth();

  const { courseId, chapterId } = params;

  if (!userId) {
    return redirect("/");
  }

  const data = await getChapter({ userId, courseId, chapterId });

  if (!data?.course || !data?.chapter) {
    return redirect("/");
  }

  const isLocked = !data.chapter.isFree && !data.purchase;

  const completeOnEnd = !!data.purchase && !data.userProgress?.isCompleted;

  return (
    <>
      {data.userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}

      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            courseId={courseId}
            chapterId={chapterId}
            title={data.chapter.title}
            nextChapterId={data.nextChapter?.id!}
            playbackId={data.muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between p-4">
          <h2 className="text-2xl font-semibold mb-2">{data.chapter.title}</h2>

          {data.purchase ? (
            <div>CourseProgressButton</div>
          ) : (
            <CourseEnrollButton
              courseId={courseId}
              coursePrice={data.course.price!}
            />
          )}
        </div>

        <Separator />

        <Preview value={data.chapter.description!} />

        {!!data.attachments?.length && (
          <>
            <Separator />

            <div className="p-4">
              {data.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  href={attachment.url}
                  target="_blank"
                >
                  <File />

                  <p className="line-clamp-1">{attachment.name}</p>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
