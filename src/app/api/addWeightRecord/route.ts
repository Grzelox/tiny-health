import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await withPrisma(async (prisma) => {
      const body = await request.json();
      const { petId, weight } = body;

      if (!petId || !weight) {
        return NextResponse.json({ error: "Pet ID and weight are required" }, { status: 400 });
      }

      const newWeightRecord = await prisma.weight.create({
        data: {
          petId,
          weight: Number(weight),
        },
      });

      await prisma.pet.update({
        where: {
          id: petId,
        },
        data: {
          weight: Number(weight),
          updatedAt: new Date(),
        },
      });
      return newWeightRecord;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error adding weight record:", error);
    return NextResponse.json({ error: "Failed to add weight record" }, { status: 500 });
  }
}
