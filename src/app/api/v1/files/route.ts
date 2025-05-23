import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json({ message: "File ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      // First, verify that the user owns the pet that this file belongs to
      const file = await prisma.file.findFirst({
        where: {
          id: fileId,
        },
        include: {
          pet: true,
        },
      });

      if (!file) {
        return NextResponse.json({ message: "File not found" }, { status: 404 });
      }

      // Check if user owns the pet or has shared access
      const hasAccess = file.pet.ownerId === userId;

      if (!hasAccess) {
        // Check if user has shared access
        const sharedAccess = await prisma.userShare.findFirst({
          where: {
            ownerId: file.pet.ownerId,
            sharedWith: userId,
          },
        });

        if (!sharedAccess) {
          return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }
      }

      // Extract file key from UploadThing URL
      // URL format: https://<APP_ID>.ufs.sh/f/<FILE_KEY> or https://utfs.io/f/<FILE_KEY>
      let fileKey: string;
      try {
        const url = new URL(file.url);
        const pathParts = url.pathname.split("/");
        fileKey = pathParts[pathParts.length - 1]; // Get the last part which should be the file key
      } catch (error) {
        console.error("Error parsing file URL:", error);
        return NextResponse.json({ message: "Invalid file URL" }, { status: 400 });
      }

      try {
        // Delete the file from UploadThing
        await utapi.deleteFiles(fileKey);
      } catch (uploadthingError) {
        console.error("Error deleting file from UploadThing:", uploadthingError);
        // Continue with database deletion even if UploadThing deletion fails
        // to prevent orphaned database records
      }

      // Delete the file from the database
      await prisma.file.delete({
        where: {
          id: fileId,
        },
      });

      return { success: true, message: "File deleted successfully" };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ message: "Error deleting file" }, { status: 500 });
  }
}
