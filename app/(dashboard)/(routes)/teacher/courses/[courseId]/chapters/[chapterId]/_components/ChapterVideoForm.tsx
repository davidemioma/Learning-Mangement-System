"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import { Chapter, MuxData } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { videoData, videoSchema } from "@/lib/validators/video";

interface Props {
  courseId: string;
  chapter: Chapter & {
    muxData?: MuxData | null;
  };
}

const ChapterVideoForm = ({ courseId, chapter }: Props) => {
  const router = useRouter();

  const [isEditing, setisEditing] = useState(false);

  const form = useForm<videoData>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      videoUrl: "",
    },
  });

  useEffect(() => {
    form.setValue("videoUrl", chapter?.videoUrl || "");
  }, [chapter]);

  const onSubmit = async (values: videoData) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapter.id}`,
        values
      );

      toast.success("Chapter video updated.");

      setisEditing(false);

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div className="bg-slate-100 p-4 border rounded-md">
      <div className="flex items-center justify-between font-medium">
        <span>Chapter Video</span>

        <Button variant="ghost" onClick={() => setisEditing((prev) => !prev)}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              {!chapter.videoUrl ? (
                <>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add a video
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit video
                </>
              )}
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />

          <div className="mt-4 text-sm text-muted-foreground">
            Upload this chapter&apos;s video
          </div>
        </div>
      ) : (
        <>
          {chapter.videoUrl ? (
            <div className="relative aspect-video mt-2">
              <MuxPlayer playbackId={chapter.muxData?.playbackId || ""} />
            </div>
          ) : (
            <div className="bg-slate-200 w-full h-60 flex items-center justify-center rounded-md">
              <Video className="w-10 h-10 text-slate-500" />
            </div>
          )}
        </>
      )}

      {chapter.videoUrl && !isEditing && (
        <div className="mt-2 text-xs text-muted-foreground">
          Videos can take few minutes to process. Refresh the page if video does
          not appear.
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
