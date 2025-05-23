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
    const petId = Number(searchParams.get("petId"));

    if (!petId || isNaN(petId)) {
      return NextResponse.json({ message: "Valid Pet ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      // Verify pet exists and user has access (owner or shared)
      const pet = await prisma.pet.findFirst({
        where: {
          id: petId,
          OR: [
            { ownerId: userId },
            {
              ownerId: {
                in: (
                  await prisma.userShare.findMany({
                    where: { sharedWith: userId },
                    select: { ownerId: true },
                  })
                ).map((share) => share.ownerId),
              },
            },
          ],
        },
      });

      if (!pet) {
        return NextResponse.json({ message: "Pet not found or access denied" }, { status: 404 });
      }

      const weights = await prisma.weight.findMany({
        where: {
          petId: pet.id,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return weights;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching weight records:", error);
    return NextResponse.json({ message: "Error fetching weight records" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { weight, petId } = await request.json();

    // Enhanced validation
    if (!weight || !petId) {
      return NextResponse.json({ message: "Weight and petId are required" }, { status: 400 });
    }

    const weightValue = Number(weight);
    const petIdValue = Number(petId);

    if (isNaN(weightValue) || isNaN(petIdValue)) {
      return NextResponse.json(
        { message: "Weight and petId must be valid numbers" },
        { status: 400 },
      );
    }

    if (weightValue <= 0) {
      return NextResponse.json({ message: "Weight must be greater than 0" }, { status: 400 });
    }

    if (weightValue > 10000) {
      return NextResponse.json(
        { message: "Weight value seems unrealistic (max 10000g)" },
        { status: 400 },
      );
    }

    const result = await withPrisma(async (prisma) => {
      // Verify pet exists and user has access (only owners can add weight records)
      const pet = await prisma.pet.findFirst({
        where: {
          id: petIdValue,
          ownerId: userId,
        },
      });

      if (!pet) {
        return NextResponse.json({ message: "Pet not found or access denied" }, { status: 404 });
      }

      const weightRecord = await prisma.weight.create({
        data: {
          weight: weightValue,
          petId: petIdValue,
          createdAt: new Date(),
        },
      });

      await prisma.pet.update({
        where: { id: petIdValue },
        data: {
          weight: weightValue,
          updatedAt: new Date(),
        },
      });

      return weightRecord;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error adding weight record:", error);
    return NextResponse.json({ message: "Error adding weight record" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Weight record ID is required" }, { status: 400 });
    }

    const weightId = Number(id);
    if (isNaN(weightId)) {
      return NextResponse.json({ message: "Valid weight record ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const weightRecord = await prisma.weight.findUnique({
        where: { id: weightId },
        include: {
          pet: {
            select: { id: true, ownerId: true },
          },
        },
      });

      if (!weightRecord) {
        return NextResponse.json({ message: "Weight record not found" }, { status: 404 });
      }

      // Verify ownership - only pet owners can delete weight records
      if (weightRecord.pet.ownerId !== userId) {
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
      }

      await prisma.weight.delete({
        where: { id: weightId },
      });

      // Update pet's current weight to the latest remaining weight record
      const latestWeight = await prisma.weight.findFirst({
        where: { petId: weightRecord.petId },
        orderBy: { createdAt: "desc" },
      });

      await prisma.pet.update({
        where: { id: weightRecord.petId },
        data: {
          weight: latestWeight ? latestWeight.weight : null,
          updatedAt: new Date(),
        },
      });

      return { success: true, petId: weightRecord.petId };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting weight record:", error);
    return NextResponse.json({ message: "Error deleting weight record" }, { status: 500 });
  }
}
