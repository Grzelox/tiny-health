import { VetVisit } from "@/types/pet";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { description, medication, date, id }: VetVisit = await request.json();
  try {
    const newVisit = await prisma.vetVisit.update({
      where: {
        id: Number(id),
      },
      data: {
        description: description,
        medication: medication,
        date: new Date(date),
      },
    });
    return NextResponse.json(newVisit, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating new pet record" },
      { status: 500 },
    );
  }
}
