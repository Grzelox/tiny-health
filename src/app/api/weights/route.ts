import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { weight, date, petId } = await req.json();

    // Basic validation
    if (!weight || !petId) {
      return NextResponse.json({ message: "Weight and petId are required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      // Verify pet ownership
      const pet = await prisma.pet.findFirst({
        where: {
          id: Number(petId),
          ownerId: userId,
        },
      });

      if (!pet) {
        return NextResponse.json({ message: "Pet not found" }, { status: 404 });
      }

      // Create weight record
      const weightRecord = await prisma.weight.create({
        data: {
          weight: Number(weight),
          date: date ? new Date(date) : new Date(),
          petId: Number(petId),
        },
      });

      // Update pet's current weight
      await prisma.pet.update({
        where: { id: Number(petId) },
        data: {
          weight: Number(weight),
          updatedAt: new Date(),
        },
      });

      return weightRecord;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[WEIGHTS_POST]", error);
    return NextResponse.json({ message: "Error adding weight record" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const petId = searchParams.get("petId");

    if (!petId) {
      return NextResponse.json({ message: "Pet ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      // Verify pet ownership
      const pet = await prisma.pet.findFirst({
        where: {
          id: Number(petId),
          ownerId: userId,
        },
      });

      if (!pet) {
        return NextResponse.json({ message: "Pet not found" }, { status: 404 });
      }

      // Get weight records
      const weights = await prisma.weight.findMany({
        where: {
          petId: Number(petId),
        },
        orderBy: {
          date: "asc",
        },
      });

      return weights;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[WEIGHTS_GET]", error);
    return NextResponse.json({ message: "Error fetching weight records" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Weight record ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      // First, get the weight record to verify ownership and get petId
      const weightRecord = await prisma.weight.findUnique({
        where: { id: Number(id) },
        select: { petId: true },
      });

      if (!weightRecord) {
        return NextResponse.json({ message: "Weight record not found" }, { status: 404 });
      }

      // Verify pet ownership
      const pet = await prisma.pet.findFirst({
        where: {
          id: weightRecord.petId,
          ownerId: userId,
        },
      });

      if (!pet) {
        return NextResponse.json({ message: "Unauthorized access to this pet" }, { status: 403 });
      }

      // Delete the weight record
      await prisma.weight.delete({
        where: { id: Number(id) },
      });

      // Find the latest weight record for this pet
      const latestWeight = await prisma.weight.findFirst({
        where: { petId: weightRecord.petId },
        orderBy: { date: "desc" },
      });

      // Update the pet's current weight to the latest record's weight
      // or set to a default value if no records exist
      await prisma.pet.update({
        where: { id: weightRecord.petId },
        data: {
          weight: latestWeight ? latestWeight.weight : 0,
          updatedAt: new Date(),
        },
      });

      return { success: true, petId: weightRecord.petId };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[WEIGHTS_DELETE]", error);
    return NextResponse.json({ message: "Error deleting weight record" }, { status: 500 });
  }
}
