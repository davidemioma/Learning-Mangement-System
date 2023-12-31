import { isTeacher } from "@/lib/teacher";
import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const getUser = async () => {
  const user = await currentUser();

  return user;
};

const handleAuth = async () => {
  const user = await getUser();

  const isAuthorized = isTeacher(user?.id);

  if (!user || !isAuthorized) throw new Error("Unauthorized");

  return { userId: user.id };
};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  courseAttachments: f(["text", "image", "audio", "video", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  chapterVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
