import { withPrisma } from "@/utils/prisma";
import { getSignedGetUrl } from "@/utils/spaces";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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
          uploadedFiles: true,
        },
      });

      const signPetFiles = async <T extends { uploadedFiles: any[] }>(pet: T) => {
        const signedFiles = await Promise.all(
          pet.uploadedFiles.map(async (file) => {
            if (file.storageProvider === "spaces" && file.storageKey) {
              const signedUrl = await getSignedGetUrl(file.storageKey);
              return { ...file, url: signedUrl };
            }
            return file;
          }),
        );

        return { ...pet, uploadedFiles: signedFiles };
      };

      const pets = [
        ...(await Promise.all(ownedPets.map((pet) => signPetFiles({ ...pet, isShared: false })))),
        ...(await Promise.all(sharedPets.map((pet) => signPetFiles({ ...pet, isShared: true })))),
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
