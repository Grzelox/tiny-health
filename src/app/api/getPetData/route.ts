import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const searchParams = new URL(request.url).searchParams;
  const id = searchParams.get("id");
  try {
    const result = await withPrisma(async (prisma) => {
      const pets = await prisma.pet.findMany({
        where: {
          id: Number(id),
        },
        include: {
          vetVisits: true,
          uploadedFiles: true,
        },
      });
      return pets;
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching pets data" }, { status: 500 });
  }
}
