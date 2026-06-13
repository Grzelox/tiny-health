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
    if (!data.petId || !data.name || !data.dosage || !data.frequency || !data.startDate) {
      return NextResponse.json(
        { message: "Pet ID, name, dosage, frequency, and start date are required" },
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

      const medication = await prisma.medication.create({
        data: {
          petId,
          vetVisitId: data.vetVisitId ? Number(data.vetVisitId) : undefined,
          name: data.name,
          dosage: data.dosage,
          frequency: data.frequency,
          route: data.route || undefined,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          isActive: data.isActive ?? true,
          notes: data.notes || undefined,
        },
      });

      return { status: 201 as const, body: medication };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    return NextResponse.json({ message: "Error adding medication" }, { status: 500 });
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
      return NextResponse.json({ message: "Medication ID is required" }, { status: 400 });
    }

    const medicationId = Number(id);
    if (!medicationId) {
      return NextResponse.json({ message: "Valid medication ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const existingMedication = await prisma.medication.findUnique({
        where: { id: medicationId },
        select: { id: true, petId: true },
      });

      if (!existingMedication) {
        return { status: 404 as const, body: { message: "Medication not found" } };
      }

      const access = await getPetAccess(prisma, { id: existingMedication.petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      const updatedMedication = await prisma.medication.update({
        where: { id: medicationId },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.dosage !== undefined && { dosage: data.dosage }),
          ...(data.frequency !== undefined && { frequency: data.frequency }),
          ...(data.route !== undefined && { route: data.route || null }),
          ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
          ...(data.endDate !== undefined && {
            endDate: data.endDate ? new Date(data.endDate) : null,
          }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
          ...(data.notes !== undefined && { notes: data.notes || null }),
        },
      });

      return { status: 200 as const, body: updatedMedication };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    return NextResponse.json({ message: "Error updating medication" }, { status: 500 });
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
      return NextResponse.json({ message: "Medication ID is required" }, { status: 400 });
    }

    const medicationId = Number(id);
    if (!medicationId) {
      return NextResponse.json({ message: "Valid medication ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const existingMedication = await prisma.medication.findUnique({
        where: { id: medicationId },
        select: { id: true, petId: true },
      });

      if (!existingMedication) {
        return { status: 404 as const, body: { message: "Medication not found" } };
      }

      const access = await getPetAccess(prisma, { id: existingMedication.petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      const deletedMedication = await prisma.medication.delete({
        where: { id: medicationId },
      });

      return { status: 200 as const, body: deletedMedication };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting medication" }, { status: 500 });
  }
}
