"use client";

import axios from "axios";
import React, { useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useConfettiStore from "@/hooks/use-confetti-store";
import ConfirmModal from "@/components/modal/ConfirmModal";

interface Props {
  disabled: boolean;
  course: Course;
}

const CourseActions = ({ disabled, course }: Props) => {
  const router = useRouter();

  const confettiStore = useConfettiStore();

  const [isLoading, setIsLoading] = useState(false);

  const onPublish = async () => {
    try {
      setIsLoading(true);

      if (course.isPublished) {
        await axios.patch(`/api/courses/${course.id}/unpublish`);

        toast.success("Course Unpublished");
      } else {
        await axios.patch(`/api/courses/${course.id}/publish`);

        toast.success("Course Published");

        confettiStore.onOpen();
      }

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Make sure to complete all fields!");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${course.id}`);

      toast.success("Course deleted");

      router.refresh();

      router.push("/teacher/courses");
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
        {course.isPublished ? "Unpublish" : "Publish"}
      </Button>

      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default CourseActions;
