import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { name, breed, bornAt, weight, color, ownerId, id, isDead } = await request.json();
  try {
    const result = await withPrisma(async (prisma) => {
      const updatedPet = await prisma.pet.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          breed,
          bornAt,
          weight: weight,
          color,
          ownerId,
          isDead,
          updatedAt: new Date(),
        },
      });
      return updatedPet;
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating pet record" }, { status: 500 });
  }
}
