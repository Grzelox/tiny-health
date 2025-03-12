import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const searchParams = new URL(request.url).searchParams;
  const ownerId = searchParams.get("ownerId");
  if (!ownerId) {
    return NextResponse.json({ error: "Owner ID is required" }, { status: 400 });
  }
  try {
    const result = await withPrisma(async (prisma) => {
      const pets = await prisma.pet.findMany({
        where: {
          ownerId: ownerId,
        },
        select: {
          id: true,
          name: true,
          breed: true,
          updatedAt: true,
          isDead: true,
        },
      });
      return pets;
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching pets data" }, { status: 500 });
  }
}
