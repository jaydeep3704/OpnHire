import { inngest } from "@/utils/inngest/client";
import { requireUser } from "@/utils/requireUser";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
       const session= await requireUser()
      // If you throw, the user will not be able to upload
      if (!session) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),

    resumeUploader: f({
    pdf:{
      maxFileSize:"8MB",
      maxFileCount:1
    }
  },{awaitServerData:true})
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
       const session= await requireUser()
      // If you throw, the user will not be able to upload
      if (!session) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const {userId}=metadata
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { message: "Resume uploaded" };
    })



} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
