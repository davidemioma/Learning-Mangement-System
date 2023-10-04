"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { Chapter } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { accessData, accessSchema } from "@/lib/validators/access";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormDescription,
} from "@/components/ui/form";

interface Props {
  courseId: string;
  chapter: Chapter;
}

const ChapterAccessForm = ({ courseId, chapter }: Props) => {
  const router = useRouter();

  const [isEditing, setisEditing] = useState(false);

  const form = useForm<accessData>({
    resolver: zodResolver(accessSchema),
    defaultValues: {
      isFree: false,
    },
  });

  useEffect(() => {
    form.setValue("isFree", chapter?.isFree || false);
  }, [chapter]);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: accessData) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapter.id}`,
        values
      );

      toast.success("Chapter access updated.");

      setisEditing(false);

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div className="bg-slate-100 p-4 border rounded-md">
      <div className="flex items-center justify-between font-medium">
        <span>Chapter Access Settings</span>

        <Button variant="ghost" onClick={() => setisEditing((prev) => !prev)}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit access
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 p-4 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Check this box if you want to make this chapter free for
                      preview.
                    </FormDescription>
                  </div>
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
        <p
          className={cn(
            "text-sm mt-2",
            !chapter.isFree && "text-slate-500 italic"
          )}
        >
          {chapter.isFree
            ? "This chapter is free for preview."
            : "This chapter is not free."}
        </p>
      )}
    </div>
  );
};

export default ChapterAccessForm;
