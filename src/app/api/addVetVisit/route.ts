import { VetVisit } from '@/types/pet';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { description, medication, date, petId }: VetVisit = await request.json();
  console.log(description, medication, date, petId);
  try {
    const newVisit = await prisma.vetVisit.create({
        data: {
            description: description,
            medication: medication,
            date: new Date(date),
            petId: Number(petId)
        }
    });
    return NextResponse.json(newVisit, { status: 201 });
} catch (error) {
    console.error('Error creating new pet record:', error);
    return NextResponse.json({ error: 'Error creating new pet record' }, { status: 500 });
    }
}