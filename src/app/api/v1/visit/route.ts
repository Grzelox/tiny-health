import { VetVisit } from "@/types/pet";
import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { description, medication, date, petId }: VetVisit = await request.json();

    if (!petId || !date || !description) {
      return NextResponse.json(
        { message: "Pet ID, date, and description are required" },
        { status: 400 },
      );
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

      const vetVisit = await prisma.vetVisit.create({
        data: {
          description: description,
          medication: medication,
          date: new Date(date),
          petId: Number(petId),
        },
      });

      return vetVisit;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error adding vet visit" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { description, medication, date, id }: VetVisit = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Visit ID and Pet ID are required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      // Update vet visit
      const updatedVisit = await prisma.vetVisit.update({
        where: {
          id: Number(id),
        },
        data: {
          description: description,
          medication: medication,
          date: new Date(date),
        },
      });

      return updatedVisit;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: "Error updating vet visit" }, { status: 500 });
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
      return NextResponse.json({ message: "Visit ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const deletedVisit = await prisma.vetVisit.delete({
        where: {
          id: Number(id),
        },
      });
      return deletedVisit;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: "Error deleting vet visit" }, { status: 500 });
  }
}
