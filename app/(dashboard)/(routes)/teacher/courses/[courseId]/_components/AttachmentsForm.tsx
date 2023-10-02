"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import { Attachment, Course } from "@prisma/client";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { attachmentData } from "@/lib/validators/attachments";

interface Props {
  course: Course & {
    attachments: Attachment[];
  };
}

const AttachmentsForm = ({ course }: Props) => {
  const router = useRouter();

  const [isEditing, setisEditing] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onSubmit = async (values: attachmentData) => {
    try {
      await axios.post(`/api/courses/${course.id}/attachments`, values);

      toast.success("Attachment created.");

      setisEditing(false);

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);

      await axios.delete(`/api/courses/${course.id}/attachments/${id}`);

      toast.success("Attachment deleted.");

      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-slate-100 p-4 border rounded-md">
      <div className="flex items-center justify-between font-medium">
        <span>Course Attachments</span>

        <Button variant="ghost" onClick={() => setisEditing((prev) => !prev)}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add an file
            </>
          )}
        </Button>
      </div>

      {isEditing ? (
        <div>
          <FileUpload
            endpoint="courseAttachments"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />

          <div className="mt-4 text-sm text-muted-foreground">
            Add anything your students might need to complete the course.
          </div>
        </div>
      ) : (
        <>
          {course.attachments.length > 0 ? (
            <div className="space-y-2">
              {course.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="bg-sky-100 w-full flex items-center p-3 text-sky-700 border border-sky-200 rounded-md"
                >
                  <File className="w-4 h-4 mr-2 flex-shrink-0" />

                  <p className="text-xs line-clamp-1">{attachment.name}</p>

                  {deletingId === attachment.id ? (
                    <div className="ml-auto">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    <button
                      className="ml-auto hover:opacity-75 transition"
                      onClick={() => onDelete(attachment.id)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500 italic">
              No attachments yet
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default AttachmentsForm;
