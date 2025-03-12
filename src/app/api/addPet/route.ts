import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, breed, bornAt, weight, color, ownerId } = await request.json();
  try {
    const result = await withPrisma(async (prisma) => {
      const newPet = await prisma.pet.create({
        data: {
          name,
          breed,
          bornAt,
          weight,
          color,
          ownerId,
          updatedAt: new Date().toISOString(),
        },
      });
      return newPet;
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating new pet record" }, { status: 500 });
  }
}
