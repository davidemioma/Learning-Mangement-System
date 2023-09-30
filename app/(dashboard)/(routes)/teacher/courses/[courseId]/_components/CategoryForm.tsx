"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { Course } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryData, categorySchema } from "@/lib/validators/category";
import { Form, FormItem, FormField, FormControl } from "@/components/ui/form";

interface Props {
  course: Course;
  options: { label: string; value: string }[];
}

const CategoryForm = ({ course, options }: Props) => {
  const router = useRouter();

  const [isEditing, setisEditing] = useState(false);

  const form = useForm<categoryData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryId: "",
    },
  });

  useEffect(() => {
    form.setValue("categoryId", course?.categoryId || "");
  }, [course]);

  const { isSubmitting, isValid } = form.formState;

  const selectedOption = options.find(
    (option) => option.value === course.categoryId
  );

  const onSubmit = async (values: categoryData) => {
    try {
      await axios.patch(`/api/courses/${course.id}`, values);

      toast.success("Course category updated.");

      setisEditing(false);

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div className="bg-slate-100 p-4 border rounded-md">
      <div className="flex items-center justify-between font-medium">
        <span>Course Category</span>

        <Button variant="ghost" onClick={() => setisEditing((prev) => !prev)}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit category
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={...options} {...field} />
                  </FormControl>
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
            !course.categoryId && "text-slate-500 italic"
          )}
        >
          {selectedOption?.label || "No Category"}
        </p>
      )}
    </div>
  );
};

export default CategoryForm;
