import { MAX_IMAGES_PER_PET } from "@/utils/file-validation";
import { auth } from "@clerk/nextjs/server";
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
      maxFileSize: "32MB",
      maxFileCount: 1, // Limit to 1 file per upload to control the validation better
    },
    video: {
      maxFileSize: "32MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        petId: z.string(),
      }),
    )
    .middleware(async ({ input }) => {
      const { userId } = await auth();
      const petId = input.petId;

      if (!userId) throw new UploadThingError("Unauthorized");
      if (!petId) throw new UploadThingError("Pet ID is required");

      const petIdNumber = parseInt(petId);
      if (isNaN(petIdNumber)) {
        throw new UploadThingError("Invalid Pet ID");
      }

      // Validate that user owns the pet
      const pet = await prisma.pet.findFirst({
        where: {
          id: petIdNumber,
          ownerId: userId,
        },
      });

      if (!pet) {
        throw new UploadThingError("Pet not found or access denied");
      }

      // Explicitly count files for this specific pet using pet.id
      const currentFileCount = await prisma.file.count({
        where: {
          petId: pet.id,
        },
      });

      // Check if adding this file would exceed the limit
      if (currentFileCount >= MAX_IMAGES_PER_PET) {
        throw new UploadThingError(
          `Maksymalna liczba zdjęć na zwierzę to ${MAX_IMAGES_PER_PET}. Aktualnie masz ${currentFileCount} zdjęć.`,
        );
      }

      return { userId, petId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        await saveFileToDatabase({ url: file.url, metadata });
      } catch (error) {
        console.error("Failed to save file to database:", error);
        // Don't throw here as it would break the upload flow
        // Just log the error so the upload can complete
      }

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {
        uploadedBy: metadata.userId,
        petId: metadata.petId,
        shouldInvalidateQueries: true,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

async function saveFileToDatabase({ url, metadata }: { url: string; metadata: any }) {
  try {
    // Validate inputs
    if (!url) {
      throw new Error("File URL is required");
    }

    if (!metadata || !metadata.petId) {
      throw new Error("Pet ID is required in metadata");
    }

    const petIdNumber = parseInt(metadata.petId);
    if (isNaN(petIdNumber)) {
      throw new Error(`Invalid Pet ID: ${metadata.petId}`);
    }

    // Create the file record - let Prisma handle createdAt automatically
    const res = await prisma.file.create({
      data: {
        petId: petIdNumber,
        url: url,
      },
    });

    return res;
  } catch (err) {
    console.error("❌ Error saving file to database:", {
      error: err,
      message: err instanceof Error ? err.message : "Unknown error",
      stack: err instanceof Error ? err.stack : undefined,
      url,
      metadata,
    });
    throw err;
  }
}
