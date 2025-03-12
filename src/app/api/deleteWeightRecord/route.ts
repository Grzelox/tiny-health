import { withPrisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Weight record ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const weightRecord = await prisma.weight.findUnique({
        where: { id: Number(id) },
        select: { petId: true },
      });

      if (!weightRecord) {
        return { error: "Weight record not found", status: 404 };
      }

      const petId = weightRecord.petId;

      await prisma.weight.delete({
        where: { id: Number(id) },
      });

      const latestWeight = await prisma.weight.findFirst({
        where: { petId: petId },
        orderBy: { createdAt: "desc" },
      });

      await prisma.pet.update({
        where: { id: petId },
        data: {
          weight: latestWeight ? latestWeight.weight : 0,
          updatedAt: new Date(),
        },
      });

      return { success: true, petId };
    });

    if ("error" in result && "status" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status as number });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting weight record:", error);
    return NextResponse.json({ error: "Failed to delete weight record" }, { status: 500 });
  }
}
