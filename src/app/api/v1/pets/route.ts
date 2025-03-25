import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // TODO: Clean up get action and not take weight
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await withPrisma(async (prisma) => {
      const ownedPets = await prisma.pet.findMany({
        where: {
          ownerId: userId,
        },
        include: {
          vetVisits: true,
          weights: {
            orderBy: {
              date: "desc",
            },
            take: 1,
          },
          uploadedFiles: true,
        },
      });

      const sharedPets = await prisma.pet.findMany({
        where: {
          ownerId: {
            in: (
              await prisma.userShare.findMany({
                where: {
                  sharedWith: userId,
                },
                select: {
                  ownerId: true,
                },
              })
            ).map((share) => share.ownerId),
          },
          NOT: {
            ownerId: userId,
          },
        },
        include: {
          vetVisits: true,
          weights: {
            orderBy: {
              date: "desc",
            },
            take: 1,
          },
          uploadedFiles: true,
        },
      });

      const pets = [
        ...ownedPets.map((pet) => ({ ...pet, isShared: false })),
        ...sharedPets.map((pet) => ({ ...pet, isShared: true })),
      ];

      return pets.sort((a, b) => {
        const aDate = new Date(a.updatedAt);
        const bDate = new Date(b.updatedAt);
        return bDate.getTime() - aDate.getTime();
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching pets" }, { status: 500 });
  }
}
