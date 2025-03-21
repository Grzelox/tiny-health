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

    const result = await withPrisma(async (prisma) => {
      const pet = await prisma.pet.findMany({
        where: {
          id: Number(id),
          ownerId: userId,
        },
        include: {
          vetVisits: true,
          uploadedFiles: true,
        },
      });

      if (!pet || pet.length === 0) {
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

  const { name, breed, bornAt, weight, color, ownerId, notes } = await request.json();
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
  const { name, breed, bornAt, weight, color, ownerId, id, isDead, notes } = await request.json();
  try {
    const result = await withPrisma(async (prisma) => {
      // Get the current pet to check if weight has changed
      const currentPet = await prisma.pet.findUnique({
        where: { id: Number(id) },
        select: { weight: true },
      });

      // Update the pet
      const updatedPet = await prisma.pet.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          breed,
          bornAt,
          weight: weight,
          color,
          ownerId,
          isDead,
          notes,
          updatedAt: new Date(),
        },
      });

      // If weight has changed, create a new weight record
      if (weight && (!currentPet || currentPet.weight !== weight)) {
        await prisma.weight.create({
          data: {
            petId: Number(id),
            weight: Number(weight),
            createdAt: new Date(),
          },
        });
      }

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
    const petId = searchParams.get("petId");

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
