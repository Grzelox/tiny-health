import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";
import type { FileRouter } from "uploadthing/next";
import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const prisma = new PrismaClient();

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "16MB",
      maxFileCount: 16,
    },
    video: {
      maxFileSize: "64MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        petId: z.string(),
      }),
    )
    .middleware(async ({ input }) => {
      const supabase = await createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user.id;
      const petId = input.petId;
      if (!userId) throw new UploadThingError("Unauthorized");
      if (!petId) throw new UploadThingError("Pet ID is required");
      return { userId, petId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await saveFileToDatabase({ url: file.url, metadata });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {
        uploadedBy: metadata.userId,
        petId: metadata.petId,
        shouldInvalidateQueries: true,
      };
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
        petId: parseInt(metadata.petId),
        url,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {}
}
