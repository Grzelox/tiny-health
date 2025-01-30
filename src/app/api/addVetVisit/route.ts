import { VetVisit } from "@/types/pet";
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
  const { description, medication, date, petId }: VetVisit =
    await request.json();
  try {
    const newVisit = await prisma.vetVisit.create({
      data: {
        description: description,
        medication: medication,
        date: new Date(date),
        petId: Number(petId),
      },
    });
    return NextResponse.json(newVisit, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating new pet record" },
      { status: 500 },
    );
  }
}
