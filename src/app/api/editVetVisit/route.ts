import { VetVisit } from "@/types/pet";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { description, medication, date, id }: VetVisit = await request.json();
  console.log(description, medication, date, id);
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
    console.error("Error updating vet visit record:", error);
    return NextResponse.json(
      { error: "Error updating new pet record" },
      { status: 500 },
    );
  }
}
