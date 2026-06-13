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
    if (!data.petId || !data.vaccineName || !data.administeredDate) {
      return NextResponse.json(
        { message: "Pet ID, vaccine name, and administered date are required" },
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

      const vaccination = await prisma.vaccination.create({
        data: {
          petId,
          vaccineName: data.vaccineName,
          administeredDate: new Date(data.administeredDate),
          nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : undefined,
          notes: data.notes || undefined,
        },
      });

      return { status: 201 as const, body: vaccination };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    return NextResponse.json({ message: "Error adding vaccination" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json({ message: "Vaccination ID is required" }, { status: 400 });
    }

    const vaccinationId = Number(id);
    if (!vaccinationId) {
      return NextResponse.json({ message: "Valid vaccination ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const existingVaccination = await prisma.vaccination.findUnique({
        where: { id: vaccinationId },
        select: { id: true, petId: true },
      });

      if (!existingVaccination) {
        return { status: 404 as const, body: { message: "Vaccination not found" } };
      }

      const access = await getPetAccess(prisma, { id: existingVaccination.petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      const updatedVaccination = await prisma.vaccination.update({
        where: { id: vaccinationId },
        data: {
          ...(data.vaccineName !== undefined && { vaccineName: data.vaccineName }),
          ...(data.administeredDate !== undefined && {
            administeredDate: new Date(data.administeredDate),
          }),
          ...(data.nextDueDate !== undefined && {
            nextDueDate: data.nextDueDate ? new Date(data.nextDueDate) : null,
          }),
          ...(data.notes !== undefined && { notes: data.notes || null }),
        },
      });

      return { status: 200 as const, body: updatedVaccination };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    return NextResponse.json({ message: "Error updating vaccination" }, { status: 500 });
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
      return NextResponse.json({ message: "Vaccination ID is required" }, { status: 400 });
    }

    const vaccinationId = Number(id);
    if (!vaccinationId) {
      return NextResponse.json({ message: "Valid vaccination ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const existingVaccination = await prisma.vaccination.findUnique({
        where: { id: vaccinationId },
        select: { id: true, petId: true },
      });

      if (!existingVaccination) {
        return { status: 404 as const, body: { message: "Vaccination not found" } };
      }

      const access = await getPetAccess(prisma, { id: existingVaccination.petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      const deletedVaccination = await prisma.vaccination.delete({
        where: { id: vaccinationId },
      });

      return { status: 200 as const, body: deletedVaccination };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting vaccination" }, { status: 500 });
  }
}
