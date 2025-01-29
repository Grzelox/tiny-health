import { VetVisit } from "@/types/pet";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id }: VetVisit = await request.json();
  console.log(id);
  try {
    const deletedVisit = await prisma.vetVisit.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json("OK", { status: 201 });
  } catch (error) {
    console.error("Error deleting vet visit record:", error);
    return NextResponse.json(
      { error: "Error deleting vet visit record" },
      { status: 500 },
    );
  }
}
