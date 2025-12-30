import { VetVisit } from "@/types/pet";
import { getPetAccess, hasWriteAccess } from "@/utils/pet-access";
import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    if (!data.petId || !data.date || !data.description) {
      return NextResponse.json(
        { message: "Pet ID, date, and description are required" },
        { status: 400 },
      );
    }

    const petId = Number(data.petId);
    if (!petId) {
      return NextResponse.json({ message: "Valid Pet ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const access = await getPetAccess(prisma, { id: petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      const vetVisit = await prisma.vetVisit.create({
        data: {
          description: data.description,
          medication: data.medication,
          date: new Date(data.date),
          petId,
        },
      });

      return { status: 201 as const, body: vetVisit };
    });

    return NextResponse.json(result.body, { status: result.status });
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

    const visitId = Number(id);
    if (!visitId) {
      return NextResponse.json({ message: "Valid visit ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const existingVisit = await prisma.vetVisit.findUnique({
        where: { id: visitId },
        select: { id: true, petId: true },
      });

      if (!existingVisit) {
        return { status: 404 as const, body: { message: "Visit not found" } };
      }

      const access = await getPetAccess(prisma, { id: existingVisit.petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      const updatedVisit = await prisma.vetVisit.update({
        where: {
          id: visitId,
        },
        data: {
          description: description,
          medication: medication,
          date: new Date(date),
        },
      });

      return { status: 200 as const, body: updatedVisit };
    });

    return NextResponse.json(result.body, { status: result.status });
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

    const { id }: { id: string } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Visit ID is required" }, { status: 400 });
    }

    const visitId = Number(id);
    if (!visitId) {
      return NextResponse.json({ message: "Valid visit ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const existingVisit = await prisma.vetVisit.findUnique({
        where: { id: visitId },
        select: { id: true, petId: true },
      });

      if (!existingVisit) {
        return { status: 404 as const, body: { message: "Visit not found" } };
      }

      const access = await getPetAccess(prisma, { id: existingVisit.petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      const deletedVisit = await prisma.vetVisit.delete({
        where: {
          id: visitId,
        },
      });
      return { status: 200 as const, body: deletedVisit };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting vet visit" }, { status: 500 });
  }
}
