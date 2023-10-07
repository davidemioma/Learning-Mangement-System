"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import useConfettiStore from "@/hooks/use-confetti-store";

interface Props {
  courseId: string;
  chapterId: string;
  nextChapterId: string;
  isCompleted: boolean;
}

const CourseProgressButton = ({
  courseId,
  chapterId,
  nextChapterId,
  isCompleted,
}: Props) => {
  const router = useRouter();

  const confetti = useConfettiStore();

  const [isLoading, setIsLoading] = useState(false);

  const Icon = isCompleted ? XCircle : CheckCircle;

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      );

      //it Completes the chapter and finish the course
      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      //it Completes the chapter and moves to the next chapter
      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success("Progress updated");

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full md:w-auto"
      type="button"
      variant={isCompleted ? "outline" : "success"}
      onClick={onClick}
      disabled={isLoading}
    >
      {isCompleted ? "Not completed" : "Mark as complete"}

      <Icon className="w-4 h-4 ml-2" />
    </Button>
  );
};

export default CourseProgressButton;
