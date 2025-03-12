import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { id } = await request.json();
  try {
    const result = await withPrisma(async (prisma) => {
      const deletedVisit = await prisma.vetVisit.delete({
        where: {
          id: Number(id),
        },
      });
      return deletedVisit;
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting vet visit record" }, { status: 500 });
  }
}
