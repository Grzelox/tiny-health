import { getPetAccess, hasWriteAccess } from "@/utils/pet-access";
import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id, notes } = await request.json();

  if (!id) {
    return NextResponse.json({ message: "Pet ID is required" }, { status: 400 });
  }

  const petId = Number(id);
  if (!petId) {
    return NextResponse.json({ message: "Pet ID is required" }, { status: 400 });
  }

  try {
    const result = await withPrisma(async (prisma) => {
      const access = await getPetAccess(prisma, { id: petId }, userId);
      if (!access.pet) {
        return { status: 404 as const, body: { message: "Pet not found" } };
      }
      if (!hasWriteAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      const updatedPet = await prisma.pet.update({
        where: {
          id: petId,
        },
        data: {
          notes,
          updatedAt: new Date(),
        },
      });

      return { status: 200 as const, body: updatedPet };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    return NextResponse.json({ error: "Error updating pet notes" }, { status: 500 });
  }
}
