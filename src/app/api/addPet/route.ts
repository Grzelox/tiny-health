import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { name, breed, birthday, weight, color, currentState } = await request.json();
    try {
        const newPet = await prisma.pet.create({
            data: {
                name,
                breed,
                birthday: new Date(birthday),
                weight: parseFloat(weight),
                color,
                currentState
            }
        });
        return NextResponse.json(newPet, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error creating new pet record' }, { status: 500 });
    }
} 