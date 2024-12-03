import { VetVisit } from '@/types/pet';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  const { petId }: VetVisit = await request.json();
  try {
    const deletedPet = await prisma.pet.delete({
        where: {
            id: Number(petId)
        }
    });
    return NextResponse.json("OK", { status: 201 });
} catch (error) {
    console.error('Error creating new pet record:', error);
    return NextResponse.json({ error: 'Error creating new pet record' }, { status: 500 });
    }
}