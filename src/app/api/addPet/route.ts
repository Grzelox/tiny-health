import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { name, breed, bornAt, weight, color, ownerId } = await request.json();
  try {
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
    return NextResponse.json(newPet, { status: 201 });
  } catch (error) {
    console.error("Error creating new pet record:", error);
    return NextResponse.json(
      { error: "Error creating new pet record" },
      { status: 500 },
    );
  }
}
