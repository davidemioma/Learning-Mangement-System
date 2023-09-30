"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { Course } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { imageData, imageSchema } from "@/lib/validators/image";

interface Props {
  course: Course;
}

const ImageForm = ({ course }: Props) => {
  const router = useRouter();

  const [isEditing, setisEditing] = useState(false);

  const form = useForm<imageData>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      imageUrl: "",
    },
  });

  useEffect(() => {
    form.setValue("imageUrl", course?.imageUrl || "");
  }, [course]);

  const onSubmit = async (values: imageData) => {
    try {
      await axios.patch(`/api/courses/${course.id}`, values);

      toast.success("Course image updated.");

      setisEditing(false);

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div className="bg-slate-100 p-4 border rounded-md">
      <div className="flex items-center justify-between font-medium">
        <span>Course Image</span>

        <Button variant="ghost" onClick={() => setisEditing((prev) => !prev)}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              {!course.imageUrl ? (
                <>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add an image
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit image
                </>
              )}
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />

          <div className="mt-4 text-sm text-muted-foreground">
            16:9 aspect ratio recommended
          </div>
        </div>
      ) : (
        <>
          {course.imageUrl ? (
            <div className="relative w-full h-60 mt-2 rounded-md overflow-hidden">
              <Image
                className="object-cover"
                src={course.imageUrl}
                fill
                alt=""
              />
            </div>
          ) : (
            <div className="bg-slate-200 w-full h-60 flex items-center justify-center rounded-md">
              <ImageIcon className="w-10 h-10 text-slate-500" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageForm;
