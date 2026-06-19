import { getPetAccess, hasWriteAccess } from "@/utils/pet-access";
import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const parseDate = (value: unknown): Date | null => {
  if (value === null || value === undefined || value === "") return null;
  const date = new Date(value as string);
  return isNaN(date.getTime()) ? null : date;
};

const cleanString = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const petId = Number(data.petId);
    const name = cleanString(data.name);
    const startDate = parseDate(data.startDate);

    if (!petId || !name || !startDate) {
      return NextResponse.json(
        { message: "Pet ID, name and start date are required" },
        { status: 400 },
      );
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
          name,
          dosage: cleanString(data.dosage),
          frequency: cleanString(data.frequency),
          route: cleanString(data.route),
          startDate,
          endDate: parseDate(data.endDate),
          notes: cleanString(data.notes),
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
    const medicationId = Number(data.id);
    if (!medicationId) {
      return NextResponse.json({ message: "Valid medication ID is required" }, { status: 400 });
    }

    const name = cleanString(data.name);
    const startDate = parseDate(data.startDate);
    if (!name || !startDate) {
      return NextResponse.json(
        { message: "Name and start date are required" },
        { status: 400 },
      );
    }

    const result = await withPrisma(async (prisma) => {
      const existing = await prisma.medication.findUnique({
        where: { id: medicationId },
        select: { id: true, petId: true },
      });
      if (!existing) {
        return { status: 404 as const, body: { message: "Medication not found" } };
      }

      const access = await getPetAccess(prisma, { id: existing.petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      const medication = await prisma.medication.update({
        where: { id: medicationId },
        data: {
          name,
          dosage: cleanString(data.dosage),
          frequency: cleanString(data.frequency),
          route: cleanString(data.route),
          startDate,
          endDate: parseDate(data.endDate),
          notes: cleanString(data.notes),
        },
      });

      return { status: 200 as const, body: medication };
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

    const { id } = await request.json();
    const medicationId = Number(id);
    if (!medicationId) {
      return NextResponse.json({ message: "Valid medication ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const existing = await prisma.medication.findUnique({
        where: { id: medicationId },
        select: { id: true, petId: true },
      });
      if (!existing) {
        return { status: 404 as const, body: { message: "Medication not found" } };
      }

      const access = await getPetAccess(prisma, { id: existing.petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      const deleted = await prisma.medication.delete({ where: { id: medicationId } });
      return { status: 200 as const, body: deleted };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting medication" }, { status: 500 });
  }
}
