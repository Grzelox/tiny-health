import { getPetAccess, hasReadAccess, hasWriteAccess } from "@/utils/pet-access";
import { getSignedGetUrl } from "@/utils/spaces";
import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface CreatePetPayload {
  readonly name: string;
  readonly breed: string;
  readonly bornAt: string;
  readonly weight?: unknown;
  readonly color: string;
  readonly notes?: string;
  readonly isDead?: boolean;
  readonly deathDate?: string;
  readonly animalType?: string;
}

const MAX_PET_WEIGHT_GRAMS = 10000;

const parseOptionalWeight = (weight: unknown): number | null => {
  if (weight === null || weight === undefined || weight === "") return null;
  const weightNumber: number = typeof weight === "number" ? weight : Number(weight);
  if (!Number.isFinite(weightNumber)) return null;
  if (weightNumber <= 0 || weightNumber > MAX_PET_WEIGHT_GRAMS) return null;
  return Math.round(weightNumber);
};

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const petUuid = searchParams.get("petUuid");
    if (!petUuid) {
      return NextResponse.json({ message: "Pet petUuid is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const access = await getPetAccess(prisma, { uuid: petUuid }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasReadAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      const pet = await prisma.pet.findFirst({
        where: { id: access.pet.id },
        include: {
          vetVisits: true,
          uploadedFiles: true,
          medications: { orderBy: { startDate: "desc" } },
          vaccinations: { orderBy: { administeredDate: "desc" } },
        },
      });

      if (!pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }

      const signedFiles = await Promise.all(
        pet.uploadedFiles.map(async (file) => {
          if (file.storageProvider === "spaces" && file.storageKey) {
            const signedUrl = await getSignedGetUrl(file.storageKey);
            return { ...file, url: signedUrl };
          }
          return file;
        }),
      );

      return { status: 200 as const, body: { ...pet, uploadedFiles: signedFiles } };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching pet data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as CreatePetPayload;
  const parsedWeight: number | null = parseOptionalWeight(payload.weight);
  try {
    const result = await withPrisma(async (prisma) => {
      const newPet = await prisma.pet.create({
        data: {
          name: payload.name,
          breed: payload.breed,
          bornAt: payload.bornAt,
          color: payload.color,
          ownerId: userId,
          notes: payload.notes,
          isDead: payload.isDead || false,
          deathDate: payload.deathDate,
          animalType: payload.animalType,
          updatedAt: new Date(),
          ...(parsedWeight !== null ? { weight: parsedWeight } : {}),
        },
      });

      if (parsedWeight !== null) {
        await prisma.weight.create({
          data: {
            petId: newPet.id,
            weight: parsedWeight,
            createdAt: new Date(),
          },
        });
      }

      return newPet;
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating new pet record" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const payload = await request.json();
  const petId = Number(payload.petId);

  if (!petId) {
    return NextResponse.json({ message: "Pet ID is required" }, { status: 400 });
  }

  try {
    const result = await withPrisma(async (prisma) => {
      const access = await getPetAccess(prisma, { id: petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      const updatedPet = await prisma.pet.update({
        where: {
          id: petId,
        },
        data: {
          ...(payload.name !== undefined && { name: payload.name }),
          ...(payload.breed !== undefined && { breed: payload.breed }),
          ...(payload.bornAt !== undefined && { bornAt: payload.bornAt }),
          ...(payload.color !== undefined && { color: payload.color }),
          ...(payload.isDead !== undefined && { isDead: payload.isDead }),
          ...(payload.deathDate !== undefined && { deathDate: new Date(payload.deathDate) }),
          ...(payload.animalType !== undefined && { animalType: payload.animalType }),
          updatedAt: new Date(),
        },
      });

      return { status: 200 as const, body: updatedPet };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    return NextResponse.json({ error: "Error updating pet record" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const petId = Number(searchParams.get("petId"));

    if (!petId) {
      return NextResponse.json({ message: "Pet ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const access = await getPetAccess(prisma, { id: petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!access.isOwner) {
        return { status: 403 as const, body: { message: "Only owner can delete pet" } };
      }

      await prisma.pet.delete({
        where: {
          id: petId,
        },
      });

      return { status: 200 as const, body: { success: true } };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting pet" }, { status: 500 });
  }
}
