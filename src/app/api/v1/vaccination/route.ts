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
    const administeredDate = parseDate(data.administeredDate);

    if (!petId || !name || !administeredDate) {
      return NextResponse.json(
        { message: "Pet ID, name and administered date are required" },
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

      const vaccination = await prisma.vaccination.create({
        data: {
          petId,
          name,
          administeredDate,
          nextDueDate: parseDate(data.nextDueDate),
          notes: cleanString(data.notes),
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
    const vaccinationId = Number(data.id);
    if (!vaccinationId) {
      return NextResponse.json({ message: "Valid vaccination ID is required" }, { status: 400 });
    }

    const name = cleanString(data.name);
    const administeredDate = parseDate(data.administeredDate);
    if (!name || !administeredDate) {
      return NextResponse.json(
        { message: "Name and administered date are required" },
        { status: 400 },
      );
    }

    const result = await withPrisma(async (prisma) => {
      const existing = await prisma.vaccination.findUnique({
        where: { id: vaccinationId },
        select: { id: true, petId: true },
      });
      if (!existing) {
        return { status: 404 as const, body: { message: "Vaccination not found" } };
      }

      const access = await getPetAccess(prisma, { id: existing.petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      const vaccination = await prisma.vaccination.update({
        where: { id: vaccinationId },
        data: {
          name,
          administeredDate,
          nextDueDate: parseDate(data.nextDueDate),
          notes: cleanString(data.notes),
        },
      });

      return { status: 200 as const, body: vaccination };
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

    const { id } = await request.json();
    const vaccinationId = Number(id);
    if (!vaccinationId) {
      return NextResponse.json({ message: "Valid vaccination ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const existing = await prisma.vaccination.findUnique({
        where: { id: vaccinationId },
        select: { id: true, petId: true },
      });
      if (!existing) {
        return { status: 404 as const, body: { message: "Vaccination not found" } };
      }

      const access = await getPetAccess(prisma, { id: existing.petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      const deleted = await prisma.vaccination.delete({ where: { id: vaccinationId } });
      return { status: 200 as const, body: deleted };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting vaccination" }, { status: 500 });
  }
}
