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

  const { petId } = await request.json();
  try {
    const deletedPet = await prisma.pet.delete({
      where: {
        id: Number(petId),
      },
    });
    return NextResponse.json("OK", { status: 200 });
  } catch (error) {
    console.error("Error deleting pet:", error);
    return NextResponse.json(
      { error: "Error deleting pet record" },
      { status: 500 },
    );
  }
}
