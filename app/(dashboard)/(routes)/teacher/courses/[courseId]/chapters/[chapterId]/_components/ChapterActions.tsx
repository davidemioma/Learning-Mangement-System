"use client";

import axios from "axios";
import React, { useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { Chapter } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/modal/ConfirmModal";

interface Props {
  disabled: boolean;
  courseId: string;
  chapter: Chapter;
}

const ChapterActions = ({ disabled, courseId, chapter }: Props) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onPublish = async () => {
    try {
      setIsLoading(true);

      if (chapter.isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapter.id}/unpublish`
        );

        toast.success("Chapter Unpublished");
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapter.id}/publish`
        );

        toast.success("Chapter Published");
      }

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}/chapters/${chapter.id}`);

      toast.success("Chapter deleted");

      router.refresh();

      router.push(`/teacher/courses/${courseId}`);
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onPublish}
        variant="outline"
        size="sm"
        disabled={disabled || isLoading}
      >
        {chapter.isPublished ? "Unpublish" : "Publish"}
      </Button>

      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterActions;
