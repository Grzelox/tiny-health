import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name, breed, birthDate, weight, color, ownerId, id, isDead } =
    await request.json();
  try {
    const updatedPet = await prisma.pet.update({
      where: {
        id: id,
      },
      data: {
        name,
        breed,
        birthDate: new Date(birthDate),
        weight: weight,
        color,
        ownerId,
        isDead,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(updatedPet, { status: 201 });
  } catch (error) {
    console.error("Error updating pet record:", error);
    return NextResponse.json(
      { error: "Error updating pet record" },
      { status: 500 },
    );
  }
}
