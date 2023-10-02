"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { Course } from "@prisma/client";
import { useForm } from "react-hook-form";
import { formatPrice } from "@/lib/format";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { priceData, priceSchema } from "@/lib/validators/price";
import { Form, FormItem, FormField, FormControl } from "@/components/ui/form";

interface Props {
  course: Course;
}

const PriceForm = ({ course }: Props) => {
  const router = useRouter();

  const [isEditing, setisEditing] = useState(false);

  const form = useForm<priceData>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      price: 0,
    },
  });

  useEffect(() => {
    form.setValue("price", course?.price || 0);
  }, [course]);

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: priceData) => {
    try {
      await axios.patch(`/api/courses/${course.id}`, values);

      toast.success("Course description updated.");

      setisEditing(false);

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div className="bg-slate-100 p-4 border rounded-md">
      <div className="flex items-center justify-between font-medium">
        <span>Course Price</span>

        <Button variant="ghost" onClick={() => setisEditing((prev) => !prev)}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit price
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="Set a price for your course"
                      {...field}
                    />
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
            !course.price && "text-slate-500 italic"
          )}
        >
          {course.price ? formatPrice(course.price) : "No Price"}
        </p>
      )}
    </div>
  );
};

export default PriceForm;
