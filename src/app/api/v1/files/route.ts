import { MAX_IMAGES_PER_PET } from "@/utils/file-validation";
import { getPetAccess, hasWriteAccess } from "@/utils/pet-access";
import { withPrisma } from "@/utils/prisma";
import { createSpacesClient, getSpacesConfig } from "@/utils/spaces";
import { auth } from "@clerk/nextjs/server";
import { DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

type CreateFileBody = {
  petId: number | string;
  url: string;
  storageKey: string;
};

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let body: CreateFileBody | null = null;
    try {
      body = (await request.json()) as CreateFileBody;
    } catch {
      body = null;
    }

    if (!body || !body.petId || !body.url || !body.storageKey) {
      return NextResponse.json(
        { message: "petId, url, and storageKey are required" },
        { status: 400 },
      );
    }

    const petIdNumber = parseInt(body.petId.toString(), 10);
    if (Number.isNaN(petIdNumber)) {
      return NextResponse.json({ message: "Invalid petId" }, { status: 400 });
    }

    const access = await withPrisma(async (prisma) => {
      return getPetAccess(prisma, { id: petIdNumber }, userId);
    });

    if (!access.pet || !hasWriteAccess(access)) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const currentFileCount = await withPrisma(async (prisma) => {
      return prisma.file.count({
        where: {
          petId: petIdNumber,
        },
      });
    });

    if (currentFileCount >= MAX_IMAGES_PER_PET) {
      return NextResponse.json({ message: "Limit zdjęć osiągnięty" }, { status: 400 });
    }

    const config = getSpacesConfig();
    const client = createSpacesClient();

    try {
      await client.send(
        new HeadObjectCommand({
          Bucket: config.bucket,
          Key: body.storageKey,
        }),
      );
    } catch (error) {
      console.error("Error verifying Spaces upload:", error);
      return NextResponse.json({ message: "Upload not found" }, { status: 400 });
    }

    const file = await withPrisma(async (prisma) => {
      return prisma.file.create({
        data: {
          petId: petIdNumber,
          url: body.url,
          storageKey: body.storageKey,
          storageProvider: "spaces",
        },
      });
    });

    return NextResponse.json({ id: file.id, url: file.url }, { status: 201 });
  } catch (error) {
    console.error("Error creating file record:", error);
    return NextResponse.json({ message: "Error creating file" }, { status: 500 });
  }
}

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

      if (file.storageKey && file.storageProvider === "spaces") {
        try {
          const config = getSpacesConfig();
          const client = createSpacesClient();
          await client.send(
            new DeleteObjectCommand({
              Bucket: config.bucket,
              Key: file.storageKey,
            }),
          );
        } catch (storageError) {
          console.error("Error deleting file from Spaces:", storageError);
        }
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
