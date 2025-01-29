import { PrismaClient } from "@prisma/client";
import type { FileRouter } from "uploadthing/next";
import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const prisma = new PrismaClient();

const f = createUploadthing();

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "16MB",
      maxFileCount: 5,
    },
  })
    .middleware(async ({ req }) => {
      const { userId } = auth();
      // If you throw, the user will not be able to upload
      if (!userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      await saveFileToDatabase({ url: file.url, metadata });
      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

async function saveFileToDatabase({
  url,
  metadata,
}: {
  url: string;
  metadata: any;
}) {
  try {
    const res = await prisma.file.create({
      data: {
        customId: "tinyhealth",
        url,
        metadata,
      },
    });
    console.log("File saved to database successfully", res);
  } catch (err) {
    console.error("Error saving file to database", err);
  }
}
