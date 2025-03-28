import { withPrisma } from "@/utils/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    const clerk = await clerkClient();
    // Find the user by email using Clerk
    const users = await clerk.users.getUserList({
      emailAddress: [email],
    });

    if (!users) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const targetUserId = users.data[0].id;

    if (targetUserId === userId) {
      return NextResponse.json({ message: "Cannot share with yourself" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      // Create the share record
      const share = await prisma.userShare.create({
        data: {
          ownerId: userId,
          sharedWith: targetUserId,
        },
      });

      return share;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json({ message: "Already shared with this user" }, { status: 400 });
    }
    return NextResponse.json({ error: "Error sharing pets" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const clerk = await clerkClient();
    const result = await withPrisma(async (prisma) => {
      const shares = await prisma.userShare.findMany({
        where: {
          ownerId: userId,
        },
      });
      const userIds = shares.map((share) => share.sharedWith);
      const users = await clerk.users.getUserList({
        userId: userIds,
      });

      return shares.map((share) => ({
        ...share,
        user: users.data.find((u) => u.id === share.sharedWith),
      }));
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching shared users" }, { status: 500 });
  }
}

// Remove share access
export async function DELETE(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const targetUserId = searchParams.get("userId");

  if (!targetUserId) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  try {
    const result = await withPrisma(async (prisma) => {
      // Delete the share
      await prisma.userShare.deleteMany({
        where: {
          ownerId: userId,
          sharedWith: targetUserId,
        },
      });

      return { success: true };
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Error removing share access" }, { status: 500 });
  }
}
