"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { Chapter } from "@prisma/client";
import Editor from "@/components/Editor";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  descriptionData,
  descriptionSchema,
} from "@/lib/validators/description";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Preview from "@/components/Preview";

interface Props {
  courseId: string;
  chapter: Chapter;
}

const ChapterDescForm = ({ courseId, chapter }: Props) => {
  const router = useRouter();

  const [isEditing, setisEditing] = useState(false);

  const form = useForm<descriptionData>({
    resolver: zodResolver(descriptionSchema),
    defaultValues: {
      description: "",
    },
  });

  useEffect(() => {
    form.setValue("description", chapter?.description || "");
  }, [chapter]);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: descriptionData) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapter.id}`,
        values
      );

      toast.success("Chapter description updated.");

      setisEditing(false);

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div className="bg-slate-100 p-4 border rounded-md">
      <div className="flex items-center justify-between font-medium">
        <span>Chapter Description</span>

        <Button variant="ghost" onClick={() => setisEditing((prev) => !prev)}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor disabled={isSubmitting} {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2 mt-3">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div
          className={cn(
            "text-sm mt-2",
            !chapter.description && "text-slate-500 italic"
          )}
        >
          {chapter.description ? (
            <Preview value={chapter.description} />
          ) : (
            <span>No Description</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ChapterDescForm;
