import { getPetAccess, hasWriteAccess } from "@/utils/pet-access";
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
      const file = await prisma.file.findFirst({
        where: {
          id: fileId,
        },
        include: {
          pet: true,
        },
      });

      if (!file) {
        return { status: 404 as const, body: { message: "File not found" } };
      }

      const access = await getPetAccess(prisma, { id: file.petId }, userId);
      if (!access.pet || !hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      let fileKey: string;
      try {
        const url = new URL(file.url);
        const pathParts = url.pathname.split("/");
        fileKey = pathParts[pathParts.length - 1];
      } catch (error) {
        console.error("Error parsing file URL:", error);
        return { status: 400 as const, body: { message: "Invalid file URL" } };
      }

      try {
        await utapi.deleteFiles(fileKey);
      } catch (uploadthingError) {
        console.error("Error deleting file from UploadThing:", uploadthingError);
      }

      await prisma.file.delete({
        where: {
          id: fileId,
        },
      });

      return { status: 200 as const, body: { success: true, message: "File deleted successfully" } };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ message: "Error deleting file" }, { status: 500 });
  }
}
