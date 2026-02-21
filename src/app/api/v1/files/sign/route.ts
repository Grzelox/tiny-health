import { getPetAccess, hasReadAccess } from "@/utils/pet-access";
import { withPrisma } from "@/utils/prisma";
import { getSignedGetUrl } from "@/utils/spaces";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");
    if (!fileId) {
      return NextResponse.json({ message: "File ID is required" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      const file = await prisma.file.findFirst({
        where: { id: fileId },
      });

      if (!file) {
        return { status: 404 as const, body: { message: "File not found" } };
      }

      const access = await getPetAccess(prisma, { id: file.petId }, userId);
      if (!access.pet || !hasReadAccess(access)) {
        return { status: 403 as const, body: { message: "Access denied" } };
      }

      if (file.storageProvider === "spaces" && file.storageKey) {
        const signedUrl = await getSignedGetUrl(file.storageKey);
        return { status: 200 as const, body: { signedUrl } };
      }

      return { status: 200 as const, body: { signedUrl: file.url } };
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Error signing file URL:", error);
    return NextResponse.json({ message: "Error signing file" }, { status: 500 });
  }
}
