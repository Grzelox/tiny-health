import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId");

    if (!ownerId) {
      return NextResponse.json({ message: "Owner ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const pets = await prisma.pet.findMany({
        where: {
          ownerId: ownerId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      return pets;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching pets" }, { status: 500 });
  }
}
