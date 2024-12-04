import { auth } from "@clerk/nextjs/server";
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
  if (!id) {
    return NextResponse.json({ error: "Pet ID is required" }, { status: 400 });
  }
  try {
    const pets = await prisma.pet.findMany({
      where: {
        id: Number(id),
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
