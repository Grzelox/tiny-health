import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Pet ID is required" }, { status: 400 });
    }

    const availableUserIds = await withPrisma(async (prisma) => {
      return prisma.userShare.findMany({
        where: {
          sharedWith: userId,
        },
        select: {
          ownerId: true,
        },
      });
    });

    const accessibleOwnerIds = availableUserIds.map((share) => share.ownerId);
    accessibleOwnerIds.push(userId);

    const result = await withPrisma(async (prisma) => {
      const pet = await prisma.pet.findFirst({
        where: {
          id: Number(id),
          ownerId: {
            in: accessibleOwnerIds,
          },
        },
        include: {
          vetVisits: true,
          uploadedFiles: true,
        },
      });

      if (!pet) {
        return NextResponse.json({ message: "Pet not found" }, { status: 404 });
      }
      return pet;
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching pet data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, breed, bornAt, weight, color, ownerId, notes, isDead, deathDate, animalType } =
    await request.json();
  try {
    const result = await withPrisma(async (prisma) => {
      const newPet = await prisma.pet.create({
        data: {
          name,
          breed,
          bornAt,
          weight,
          color,
          ownerId,
          notes,
          isDead: isDead || false,
          deathDate,
          animalType,
          updatedAt: new Date().toISOString(),
        },
      });

      if (weight) {
        await prisma.weight.create({
          data: {
            petId: newPet.id,
            weight: Number(weight),
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

  try {
    const result = await withPrisma(async (prisma) => {
      const updatedPet = await prisma.pet.update({
        where: {
          id: Number(payload.id),
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

      return updatedPet;
    });
    return NextResponse.json(result, { status: 200 });
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
    const petId = searchParams.get("id");

    if (!petId) {
      return NextResponse.json({ message: "Pet ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const pet = await prisma.pet.findFirst({
        where: {
          id: Number(petId),
          ownerId: userId,
        },
      });

      if (!pet) {
        return NextResponse.json({ message: "Pet not found" }, { status: 404 });
      }

      await prisma.pet.delete({
        where: {
          id: Number(petId),
        },
      });

      return { success: true };
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: "Error deleting pet" }, { status: 500 });
  }
}
