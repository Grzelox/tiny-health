import { VetVisit } from "@/types/pet";
import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { description, medication, date, id }: VetVisit = await request.json();
  try {
    const result = await withPrisma(async (prisma) => {
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
      return newVisit;
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating new pet record" }, { status: 500 });
  }
}
