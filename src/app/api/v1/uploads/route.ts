import { MAX_IMAGES_PER_PET } from "@/utils/file-validation";
import { getPetAccess, hasWriteAccess } from "@/utils/pet-access";
import { withPrisma } from "@/utils/prisma";
import { buildPublicUrl, createSpacesClient, getSpacesConfig, sanitizeExtension } from "@/utils/spaces";
import { auth } from "@clerk/nextjs/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

type UploadRequestBody = {
  petId: number | string;
  filename: string;
  contentType: string;
};

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let body: UploadRequestBody | null = null;
    try {
      body = (await request.json()) as UploadRequestBody;
    } catch {
      body = null;
    }

    if (!body || !body.petId || !body.filename || !body.contentType) {
      return NextResponse.json(
        { message: "petId, filename, and contentType are required" },
        { status: 400 },
      );
    }

    const petIdNumber = parseInt(body.petId.toString(), 10);
    if (Number.isNaN(petIdNumber)) {
      return NextResponse.json({ message: "Invalid petId" }, { status: 400 });
    }

    const pet = await withPrisma(async (prisma) => {
      const access = await getPetAccess(prisma, { id: petIdNumber }, userId);
      if (!access.pet || !hasWriteAccess(access)) {
        return null;
      }
      return access.pet;
    });

    if (!pet) {
      return NextResponse.json({ message: "Pet not found or access denied" }, { status: 403 });
    }

    const currentFileCount = await withPrisma(async (prisma) => {
      return prisma.file.count({
        where: {
          petId: pet.id,
        },
      });
    });

    if (currentFileCount >= MAX_IMAGES_PER_PET) {
      return NextResponse.json(
        {
          message: `Maksymalna liczba zdjęć na zwierzę to ${MAX_IMAGES_PER_PET}. Aktualnie masz ${currentFileCount} zdjęć.`,
        },
        { status: 400 },
      );
    }

    const config = getSpacesConfig();
    const client = createSpacesClient();
    const extension = sanitizeExtension(body.filename);
    const objectKey = `pets/${userId}/${pet.id}/${crypto.randomUUID()}${extension}`;

    const command = new PutObjectCommand({
      Bucket: config.bucket,
      Key: objectKey,
      ContentType: body.contentType,
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 * 10 });
    const publicUrl = buildPublicUrl(objectKey, config.publicBaseUrl);

    return NextResponse.json({ uploadUrl, publicUrl, key: objectKey });
  } catch (error) {
    console.error("Error creating Spaces upload:", error);
    return NextResponse.json({ message: "Failed to create upload" }, { status: 500 });
  }
}
