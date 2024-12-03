import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { name, breed, birthDate, weight, color, ownerId} = await request.json();
    try {
        const newPet = await prisma.pet.create({
            data: {
                name,
                breed,
                birthDate: new Date(birthDate),
                weight: weight,
                color,
                ownerId
            }
        });
        return NextResponse.json(newPet, { status: 201 });
    } catch (error) {
        console.error('Error creating new pet record:', error);
        return NextResponse.json({ error: 'Error creating new pet record' }, { status: 500 });
    }
} 