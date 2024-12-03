import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');
    try {
        const pets = await prisma.pet.findMany({
            where: {
                id: id
            }
        });
        console.log("pets", pets);
        return NextResponse.json(pets, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching pets data' }, { status: 500 });
    }
} 