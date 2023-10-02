"use client";

import React, { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import ChapterList from "./ChapterList";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Chapter, Course } from "@prisma/client";
import { Loader2, PlusCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { chapterData, chapterSchema } from "@/lib/validators/chapter";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface Props {
  course: Course & {
    chapters: Chapter[];
  };
}

const ChapterForm = ({ course }: Props) => {
  const router = useRouter();

  const [isCreating, setisCreating] = useState(false);

  const [isUpdating, setisUpdating] = useState(false);

  const form = useForm<chapterData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: chapterData) => {
    try {
      await axios.post(`/api/courses/${course.id}/chapters`, values);

      toast.success("Course chapter created.");

      setisCreating(false);

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    }
  };

  const onReorder = async (updatedData: { id: string; position: number }[]) => {
    try {
      setisUpdating(true);

      await axios.put(`/api/courses/${course.id}/chapters/reorder`, {
        lists: updatedData,
      });

      toast.success("Course chapter reordered.");

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    } finally {
      setisUpdating(false);
    }
  };

  const onEdit = async (id: string) => {
    router.push(`/teacher/courses/${course.id}/chapters/${id}`);
  };

  return (
    <div className="relative bg-slate-100 p-4 border rounded-md">
      {isUpdating && (
        <div className="absolute top-0 right-0 bg-slate-500/20 w-full h-full flex items-center justify-center rounded-md">
          <Loader2 className="w-6 h-6 text-sky-700 animate-spin" />
        </div>
      )}

      <div className="flex items-center justify-between font-medium">
        <span>Course Chapters</span>

        <Button variant="ghost" onClick={() => setisCreating((prev) => !prev)}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2 mt-3">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Create
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <>
          <div
            className={cn(
              "mt-2 text-sm",
              course.chapters.length === 0 && "text-slate-500 italic"
            )}
          >
            {course.chapters.length > 0 ? (
              <ChapterList
                initialChapters={course.chapters}
                onReorder={onReorder}
                onEdit={onEdit}
              />
            ) : (
              "No chapters"
            )}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Drag and drop to reorder chapters
          </p>
        </>
      )}
    </div>
  );
};

export default ChapterForm;
