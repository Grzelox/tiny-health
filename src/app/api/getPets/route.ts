import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const searchParams = new URL(request.url).searchParams;
  const ownerId = searchParams.get("ownerId");
  if (!ownerId) {
    return NextResponse.json(
      { error: "Owner ID is required" },
      { status: 400 },
    );
  }
  try {
    const pets = await prisma.pet.findMany({
      where: {
        ownerId: ownerId,
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
