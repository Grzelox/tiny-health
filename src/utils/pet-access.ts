import { PrismaClient, Pet } from "@prisma/client";

export interface PetAccessResult {
  pet: Pet | null;
  isOwner: boolean;
  isShared: boolean;
}

export async function getPetAccess(
  prisma: PrismaClient,
  identifier: { id?: number; uuid?: string },
  userId: string,
): Promise<PetAccessResult> {
  if (!identifier.id && !identifier.uuid) {
    throw new Error("Pet identifier (id or uuid) is required");
  }

  const pet = await prisma.pet.findFirst({
    where: {
      ...(identifier.id !== undefined ? { id: identifier.id } : {}),
      ...(identifier.uuid !== undefined ? { uuid: identifier.uuid } : {}),
    },
  });

  if (!pet) {
    return { pet: null, isOwner: false, isShared: false };
  }

  const isOwner = pet.ownerId === userId;
  let isShared = false;

  if (!isOwner) {
    const shared = await prisma.userShare.findFirst({
      where: {
        ownerId: pet.ownerId,
        sharedWith: userId,
      },
      select: { id: true },
    });

    isShared = Boolean(shared);
  }

  return { pet, isOwner, isShared };
}

export const hasReadAccess = (access: PetAccessResult) => access.isOwner || access.isShared;
export const hasWriteAccess = (access: PetAccessResult) => access.isOwner || access.isShared;
