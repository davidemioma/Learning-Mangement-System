"use client";

import React, { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";
import useConfettiStore from "@/hooks/use-confetti-store";

interface Props {
  courseId: string;
  chapterId: string;
  title: string;
  nextChapterId: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

const VideoPlayer = ({
  courseId,
  chapterId,
  title,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd,
}: Props) => {
  const router = useRouter();

  const confetti = useConfettiStore();

  const [isReady, setIsReady] = useState(false);

  const onEnded = async () => {
    if (!completeOnEnd) return;

    try {
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: true,
        }
      );

      //Finish the course
      if (!nextChapterId) {
        confetti.onOpen();
      }

      toast.success("Progress updated");

      router.refresh();

      //Moves to the next chapter
      if (nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-secondary animate-spin" />
        </div>
      )}

      {isLocked && (
        <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center gap-2 text-secondary">
          <Lock className="h-8 w-8" />

          <p className="text-sm">This chapter is locked</p>
        </div>
      )}

      {!isLocked && (
        <MuxPlayer
          className={cn(!isReady && "hidden")}
          title={title}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnded}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
