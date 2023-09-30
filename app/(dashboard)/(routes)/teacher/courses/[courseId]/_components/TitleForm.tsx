"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { Course } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { titleData, titleSchema } from "@/lib/validators/title";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface Props {
  course: Course;
}

const TitleForm = ({ course }: Props) => {
  const router = useRouter();

  const [isEditing, setisEditing] = useState(false);

  const form = useForm<titleData>({
    resolver: zodResolver(titleSchema),
    defaultValues: course,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: titleData) => {
    try {
      await axios.patch(`/api/courses/${course.id}`, values);

      toast.success("Course title updated.");

      setisEditing(false);

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div className="bg-slate-100 p-4 border rounded-md">
      <div className="flex items-center justify-between font-medium">
        <span>Course Title</span>

        <Button variant="ghost" onClick={() => setisEditing((prev) => !prev)}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit title
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
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
                      placeholder="e.g. 'Advanced web development'"
                      {...field}
                    />
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
        <p className="text-sm mt-2">{course.title}</p>
      )}
    </div>
  );
};

export default TitleForm;
