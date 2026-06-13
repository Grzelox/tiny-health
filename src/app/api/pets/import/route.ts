import { parseCSVRecords } from "@/utils/csv";
import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const MAX_PET_WEIGHT_GRAMS = 10000;
const MAX_STRING_LENGTH = 300;
const MAX_ROWS = 200;
const REQUIRED_HEADERS = ["name", "bornAt"];

interface ImportRowResult {
  row: number;
  name: string;
  status: "created" | "error";
  message?: string;
}

const parseOptionalWeight = (weight: string | undefined): number | null => {
  if (!weight) return null;
  const weightNumber = Number(weight);
  if (!Number.isFinite(weightNumber)) return null;
  if (weightNumber <= 0 || weightNumber > MAX_PET_WEIGHT_GRAMS) return null;
  return Math.round(weightNumber);
};

const parseBoolean = (value: string | undefined): boolean => {
  if (!value) return false;
  return ["true", "1", "tak", "yes"].includes(value.trim().toLowerCase());
};

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Nieprawidłowe żądanie" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Plik CSV jest wymagany" }, { status: 400 });
  }

  const text = await file.text();
  const records = parseCSVRecords(text);

  if (records.length === 0) {
    return NextResponse.json({ message: "Plik CSV jest pusty lub nieprawidłowy" }, { status: 400 });
  }

  const headers = Object.keys(records[0]);
  const missingHeaders = REQUIRED_HEADERS.filter((header) => !headers.includes(header));
  if (missingHeaders.length > 0) {
    return NextResponse.json(
      { message: `W pliku CSV brakuje wymaganych kolumn: ${missingHeaders.join(", ")}` },
      { status: 400 },
    );
  }

  if (records.length > MAX_ROWS) {
    return NextResponse.json(
      { message: `Plik zawiera zbyt wiele wierszy (maksymalnie ${MAX_ROWS})` },
      { status: 400 },
    );
  }

  const results: ImportRowResult[] = [];

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const rowNumber = i + 2; // +1 for 1-based index, +1 for the header row
    const name = (record.name || "").trim();

    if (!name) {
      results.push({ row: rowNumber, name: "(brak)", status: "error", message: "Imię jest wymagane" });
      continue;
    }
    if (name.length > MAX_STRING_LENGTH) {
      results.push({
        row: rowNumber,
        name,
        status: "error",
        message: `Imię nie może przekraczać ${MAX_STRING_LENGTH} znaków`,
      });
      continue;
    }

    const bornAtRaw = (record.bornAt || "").trim();
    if (!bornAtRaw) {
      results.push({ row: rowNumber, name, status: "error", message: "Data urodzenia jest wymagana" });
      continue;
    }

    const bornAt = new Date(bornAtRaw);
    if (Number.isNaN(bornAt.getTime())) {
      results.push({
        row: rowNumber,
        name,
        status: "error",
        message: "Nieprawidłowy format daty urodzenia (RRRR-MM-DD)",
      });
      continue;
    }
    if (bornAt > new Date()) {
      results.push({
        row: rowNumber,
        name,
        status: "error",
        message: "Data urodzenia nie może być z przyszłości",
      });
      continue;
    }

    const breed = (record.breed || "").trim().slice(0, MAX_STRING_LENGTH);
    const color = (record.color || "").trim().slice(0, MAX_STRING_LENGTH);
    const animalType = (record.animalType || "").trim().slice(0, MAX_STRING_LENGTH) || "Mysz";
    const notes = (record.notes || "").trim();
    const isDead = parseBoolean(record.isDead);
    const parsedWeight = parseOptionalWeight(record.weight);

    let deathDate: Date | undefined;
    if (isDead) {
      const deathDateRaw = (record.deathDate || "").trim();
      const parsedDeathDate = deathDateRaw ? new Date(deathDateRaw) : undefined;
      if (parsedDeathDate && !Number.isNaN(parsedDeathDate.getTime())) {
        deathDate = parsedDeathDate;
      }
    }

    try {
      await withPrisma(async (prisma) => {
        const newPet = await prisma.pet.create({
          data: {
            name,
            breed,
            color,
            bornAt,
            animalType,
            notes: notes || null,
            ownerId: userId,
            isDead,
            ...(deathDate ? { deathDate } : {}),
            updatedAt: new Date(),
            ...(parsedWeight !== null ? { weight: parsedWeight } : {}),
          },
        });

        if (parsedWeight !== null) {
          await prisma.weight.create({
            data: {
              petId: newPet.id,
              weight: parsedWeight,
              createdAt: new Date(),
            },
          });
        }
      });

      results.push({ row: rowNumber, name, status: "created" });
    } catch {
      results.push({ row: rowNumber, name, status: "error", message: "Nie udało się zapisać zwierzaka" });
    }
  }

  const imported = results.filter((result) => result.status === "created").length;
  const failed = results.length - imported;

  return NextResponse.json({ imported, failed, results }, { status: 200 });
}
