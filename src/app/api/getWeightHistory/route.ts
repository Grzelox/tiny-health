import { withPrisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const petId = searchParams.get("petId");

    if (!petId) {
      return NextResponse.json({ error: "Pet ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const weightRecords = await prisma.weight.findMany({
        where: {
          petId: Number(petId),
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return weightRecords;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching weight history:", error);
    return NextResponse.json({ error: "Failed to fetch weight history" }, { status: 500 });
  }
}
