import { VetVisit } from "@/types/pet";
import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id }: VetVisit = await request.json();
  try {
    const deletedVisit = await prisma.vetVisit.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json("OK", { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting vet visit record" },
      { status: 500 },
    );
  }
}
