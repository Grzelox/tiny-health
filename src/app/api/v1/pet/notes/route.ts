import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const {id, notes } = await request.json();

  if (!id) {
    return NextResponse.json({ message: "Pet ID is required" }, { status: 400 });
  }

  try {
    const result = await withPrisma(async (prisma) => {
      const pet = await prisma.pet.findFirst({
        where: {
          id: id,
          ownerId: userId,
        },
      });

      if (!pet) {
        return NextResponse.json({ message: "Pet not found" }, { status: 404 });
      }

      // Update only the notes field
      const updatedPet = await prisma.pet.update({
        where: {
          id: id,
        },
        data: {
          notes,
          updatedAt: new Date(),
        },
      });

      return updatedPet;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating pet notes" }, { status: 500 });
  }
}
