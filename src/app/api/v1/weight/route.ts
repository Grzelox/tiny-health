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

    if (!petId) {
      return NextResponse.json({ message: "Pet ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const pet = await prisma.pet.findFirst({
        where: {
          id: petId,  
        },
      });

      if (!pet) {
        return NextResponse.json({ message: "Pet not found" }, { status: 404 });
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

    // Basic validation
    if (!weight || !petId) {
      return NextResponse.json({ message: "Weight and petId are required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const weightRecord = await prisma.weight.create({
        data: {
          weight: Number(weight),
          petId: Number(petId),
          createdAt: new Date(),
        },
      });

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

    const result = await withPrisma(async (prisma) => {
      const weightRecord = await prisma.weight.findUnique({
        where: { id: Number(id) },
        select: { petId: true },
      });

      if (!weightRecord) {
        return NextResponse.json({ message: "Weight record not found" }, { status: 404 });
      }

      await prisma.weight.delete({
        where: { id: Number(id) },
      });

      const latestWeight = await prisma.weight.findFirst({
        where: { petId: weightRecord.petId },
        orderBy: { createdAt: "desc" },
      });

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
    return NextResponse.json({ message: "Error deleting weight record" }, { status: 500 });
  }
}
