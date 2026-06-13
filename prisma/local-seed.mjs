import 'dotenv/config';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ownerId = process.env.LOCAL_SEED_OWNER_ID || 'user_local_owner';
const sharedWith = process.env.LOCAL_SEED_SHARED_WITH || 'user_local_shared';

async function seed() {
  const puszek = await prisma.pet.upsert({
    where: { uuid: '11111111-1111-4111-8111-111111111111' },
    update: {
      name: 'Puszek',
      breed: 'Syryjska',
      animalType: 'Chomik',
      bornAt: new Date('2024-03-14T00:00:00.000Z'),
      weight: 48,
      color: 'Kremowy',
      notes: 'Lubi biec w kolku po zmroku.',
      ownerId,
      isDead: false,
      deathDate: null,
    },
    create: {
      uuid: '11111111-1111-4111-8111-111111111111',
      name: 'Puszek',
      breed: 'Syryjska',
      animalType: 'Chomik',
      bornAt: new Date('2024-03-14T00:00:00.000Z'),
      weight: 48,
      color: 'Kremowy',
      notes: 'Lubi biec w kolku po zmroku.',
      ownerId,
      isDead: false,
      deathDate: null,
    },
  });

  const luna = await prisma.pet.upsert({
    where: { uuid: '22222222-2222-4222-8222-222222222222' },
    update: {
      name: 'Luna',
      breed: 'Dumbo',
      animalType: 'Szczur',
      bornAt: new Date('2023-11-05T00:00:00.000Z'),
      weight: 312,
      color: 'Szara',
      notes: 'Przyjazna i spokojna podczas wazenia.',
      ownerId,
      isDead: false,
      deathDate: null,
    },
    create: {
      uuid: '22222222-2222-4222-8222-222222222222',
      name: 'Luna',
      breed: 'Dumbo',
      animalType: 'Szczur',
      bornAt: new Date('2023-11-05T00:00:00.000Z'),
      weight: 312,
      color: 'Szara',
      notes: 'Przyjazna i spokojna podczas wazenia.',
      ownerId,
      isDead: false,
      deathDate: null,
    },
  });

  const petIds = [puszek.id, luna.id];

  await prisma.vetVisit.deleteMany({ where: { petId: { in: petIds } } });
  await prisma.weight.deleteMany({ where: { petId: { in: petIds } } });

  await prisma.vetVisit.createMany({
    data: [
      {
        petId: puszek.id,
        date: new Date('2026-02-01T12:00:00.000Z'),
        description: 'Kontrola po problemach z apetytem',
        medication: 'Probiotyk przez 5 dni',
      },
      {
        petId: luna.id,
        date: new Date('2026-02-08T15:30:00.000Z'),
        description: 'Badanie kontrolne zebow',
        medication: 'Brak',
      },
    ],
  });

  await prisma.weight.createMany({
    data: [
      {
        petId: puszek.id,
        date: new Date('2026-01-12T08:00:00.000Z'),
        weight: 46.5,
      },
      {
        petId: puszek.id,
        date: new Date('2026-01-26T08:00:00.000Z'),
        weight: 48.0,
      },
      {
        petId: luna.id,
        date: new Date('2026-01-13T08:15:00.000Z'),
        weight: 308.0,
      },
      {
        petId: luna.id,
        date: new Date('2026-02-10T08:15:00.000Z'),
        weight: 312.0,
      },
    ],
  });

  await prisma.userShare.upsert({
    where: {
      ownerId_sharedWith: {
        ownerId,
        sharedWith,
      },
    },
    update: {},
    create: {
      ownerId,
      sharedWith,
    },
  });
}

try {
  await seed();
  console.log('Local sample data seeded.');
} finally {
  await prisma.$disconnect();
}
