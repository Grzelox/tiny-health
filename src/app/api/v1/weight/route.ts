import { getPetAccess, hasReadAccess, hasWriteAccess } from "@/utils/pet-access";
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
      const access = await getPetAccess(prisma, { id: petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasReadAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      const weights = await prisma.weight.findMany({
        where: {
          petId: access.pet.id,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return { status: 200 as const, body: weights };
    });

    return NextResponse.json(result.body, { status: result.status });
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
      const access = await getPetAccess(prisma, { id: petIdValue }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
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

      return { status: 201 as const, body: weightRecord };
    });

    return NextResponse.json(result.body, { status: result.status });
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
            select: { id: true },
          },
        },
      });

      if (!weightRecord) {
        return { status: 404 as const, body: { message: "Weight record not found" } };
      }

      const access = await getPetAccess(prisma, { id: weightRecord.petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      await prisma.weight.delete({
        where: { id: weightId },
      });

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

      return { status: 200 as const, body: { success: true, petId: weightRecord.petId } };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Error deleting weight record:", error);
    return NextResponse.json({ message: "Error deleting weight record" }, { status: 500 });
  }
}
