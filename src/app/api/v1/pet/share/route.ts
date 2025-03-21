import { withPrisma } from "@/utils/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Share a pet with another user
export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { petId, email } = await request.json();

  if (!petId || !email) {
    return NextResponse.json({ message: "Pet ID and email are required" }, { status: 400 });
  }

  try {
    // Find the user by email using Clerk
    const users = await clerkClient.users.getUserList({
      emailAddress: [email],
    });

    if (!users || users.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const targetUserId = users[0].id;

    // Don't allow sharing with yourself
    if (targetUserId === userId) {
      return NextResponse.json({ message: "Cannot share with yourself" }, { status: 400 });
    }

    const result = await withPrisma(async (prisma) => {
      // Verify the pet belongs to the current user
      const pet = await prisma.pet.findFirst({
        where: {
          id: Number(petId),
          ownerId: userId,
        },
      });

      if (!pet) {
        return NextResponse.json({ message: "Pet not found or not authorized" }, { status: 404 });
      }

      // Create the share record
      const share = await prisma.petShare.create({
        data: {
          petId: Number(petId),
          userId: targetUserId,
        },
      });

      return share;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "Pet is already shared with this user" }, { status: 400 });
    }
    return NextResponse.json({ error: "Error sharing pet" }, { status: 500 });
  }
}

// Get list of users a pet is shared with
export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const petId = searchParams.get("petId");

  if (!petId) {
    return NextResponse.json({ message: "Pet ID is required" }, { status: 400 });
  }

  try {
    const result = await withPrisma(async (prisma) => {
      // Verify the pet belongs to the current user
      const pet = await prisma.pet.findFirst({
        where: {
          id: Number(petId),
          ownerId: userId,
        },
      });

      if (!pet) {
        return NextResponse.json({ message: "Pet not found or not authorized" }, { status: 404 });
      }

      // Get all shares for this pet
      const shares = await prisma.petShare.findMany({
        where: {
          petId: Number(petId),
        },
      });

      // Get user details from Clerk
      const userIds = shares.map(share => share.userId);
      const users = await clerkClient.users.getUserList({
        userId: userIds,
      });

      // Map shares to include user details
      return shares.map(share => ({
        ...share,
        user: users.find(u => u.id === share.userId),
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
  const petId = searchParams.get("petId");
  const targetUserId = searchParams.get("userId");

  if (!petId || !targetUserId) {
    return NextResponse.json({ message: "Pet ID and user ID are required" }, { status: 400 });
  }

  try {
    const result = await withPrisma(async (prisma) => {
      // Verify the pet belongs to the current user
      const pet = await prisma.pet.findFirst({
        where: {
          id: Number(petId),
          ownerId: userId,
        },
      });

      if (!pet) {
        return NextResponse.json({ message: "Pet not found or not authorized" }, { status: 404 });
      }

      // Delete the share
      await prisma.petShare.deleteMany({
        where: {
          petId: Number(petId),
          userId: targetUserId,
        },
      });

      return { success: true };
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Error removing share access" }, { status: 500 });
  }
} 