import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { petId } = await request.json();
  try {
    const result = await withPrisma(async (prisma) => {
      const deletedPet = await prisma.pet.delete({
        where: {
          id: Number(petId),
        },
      });
      return deletedPet;
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting pet record" }, { status: 500 });
  }
}
