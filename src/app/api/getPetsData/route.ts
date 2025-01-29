import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const searchParams = new URL(request.url).searchParams;
  const id = searchParams.get("id");
  try {
    const pets = await prisma.pet.findMany({
      where: {
        id: Number(id),
      },
      include: {
        VetVisit: true,
        files: true,
      },
    });
    return NextResponse.json(pets, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching pets data" },
      { status: 500 },
    );
  }
}
