import { withPrisma } from "@/utils/prisma";
import { auth } from "@clerk/nextjs/server";
import JSZip from "jszip";
import { NextResponse } from "next/server";

const convertToCSV = (data: any[]): string => {
  if (!data || data.length === 0) {
    return "";
  }
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","), // header row
    ...data.map((row) =>
      headers
        .map((header) => {
          let value = row[header];
          value = value === null || value === undefined ? "" : String(value);
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(","),
    ),
  ];
  return csvRows.join("\n");
};

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await withPrisma(async (prisma) => {
      const ownedPets = await prisma.pet.findMany({
        where: { ownerId: userId },
        select: {
          id: true,
          name: true,
          breed: true,
          color: true,
          bornAt: true,
          isDead: true,
          createdAt: true,
          updatedAt: true,
          notes: true,
          animalType: true,
        },
      });

      const sharedPetsData = await prisma.pet.findMany({
        where: {
          ownerId: {
            in: (
              await prisma.userShare.findMany({
                where: { sharedWith: userId },
                select: { ownerId: true },
              })
            ).map((share) => share.ownerId),
          },
          NOT: { ownerId: userId },
        },
        select: {
          id: true,
          name: true,
          breed: true,
          color: true,
          bornAt: true,
          isDead: true,
          createdAt: true,
          updatedAt: true,
          notes: true,
          animalType: true,
        },
      });

      const allPets = [
        ...ownedPets.map((pet) => ({ ...pet, isShared: false })),
        ...sharedPetsData.map((pet) => ({ ...pet, isShared: true })),
      ];

      const allPetIds = allPets.map((pet) => pet.id);

      const vetVisits = await prisma.vetVisit.findMany({
        where: {
          petId: {
            in: allPetIds,
          },
        },
        select: {
          id: true,
          petId: true,
          date: true,
          description: true,
          medication: true,
        },
      });

      const weightRecords = await prisma.weight.findMany({
        where: {
          petId: {
            in: allPetIds,
          },
        },
        select: {
          id: true,
          petId: true,
          date: true,
          weight: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const medications = await prisma.medication.findMany({
        where: {
          petId: {
            in: allPetIds,
          },
        },
        select: {
          id: true,
          petId: true,
          name: true,
          dosage: true,
          frequency: true,
          route: true,
          startDate: true,
          endDate: true,
          notes: true,
        },
      });

      const vaccinations = await prisma.vaccination.findMany({
        where: {
          petId: {
            in: allPetIds,
          },
        },
        select: {
          id: true,
          petId: true,
          name: true,
          administeredDate: true,
          nextDueDate: true,
          notes: true,
        },
      });

      return {
        pets: allPets.sort((a, b) => {
          const aDate = new Date(a.updatedAt);
          const bDate = new Date(b.updatedAt);
          return bDate.getTime() - aDate.getTime();
        }),
        vetVisits,
        weightRecords,
        medications,
        vaccinations,
      };
    });

    const petsData = data.pets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      breed: pet.breed,
      color: pet.color,
      bornAt: pet.bornAt ? new Date(pet.bornAt).toLocaleDateString() : "",
      isDead: pet.isDead,
      isShared: pet.isShared,
      createdAt: new Date(pet.createdAt).toLocaleString(),
      updatedAt: new Date(pet.updatedAt).toLocaleString(),
      notes: pet.notes || "",
      animalType: pet.animalType || "",
    }));

    const petNameById = new Map(data.pets.map((pet) => [pet.id, pet.name]));

    const vetVisitsData = data.vetVisits.map((visit) => ({
      id: visit.id,
      petId: visit.petId,
      petName: petNameById.get(visit.petId) || "Unknown Pet",
      date: visit.date ? new Date(visit.date).toLocaleDateString() : "",
      description: visit.description || "",
      medication: visit.medication || "",
    }));

    const weightRecordsData = data.weightRecords.map((record) => ({
      id: record.id,
      petId: record.petId,
      petName: petNameById.get(record.petId) || "Unknown Pet",
      date: record.date ? new Date(record.date).toLocaleDateString() : "",
      weight: record.weight,
      createdAt: new Date(record.createdAt).toLocaleString(),
      updatedAt: new Date(record.updatedAt).toLocaleString(),
    }));

    const medicationsData = data.medications.map((med) => ({
      id: med.id,
      petId: med.petId,
      petName: petNameById.get(med.petId) || "Unknown Pet",
      name: med.name,
      dosage: med.dosage || "",
      frequency: med.frequency || "",
      route: med.route || "",
      startDate: med.startDate ? new Date(med.startDate).toLocaleDateString() : "",
      endDate: med.endDate ? new Date(med.endDate).toLocaleDateString() : "",
      notes: med.notes || "",
    }));

    const vaccinationsData = data.vaccinations.map((vac) => ({
      id: vac.id,
      petId: vac.petId,
      petName: petNameById.get(vac.petId) || "Unknown Pet",
      name: vac.name,
      administeredDate: vac.administeredDate
        ? new Date(vac.administeredDate).toLocaleDateString()
        : "",
      nextDueDate: vac.nextDueDate ? new Date(vac.nextDueDate).toLocaleDateString() : "",
      notes: vac.notes || "",
    }));

    const petsCSV = convertToCSV(petsData);
    const vetVisitsCSV = convertToCSV(vetVisitsData);
    const weightRecordsCSV = convertToCSV(weightRecordsData);
    const medicationsCSV = convertToCSV(medicationsData);
    const vaccinationsCSV = convertToCSV(vaccinationsData);

    const zip = new JSZip();
    zip.file("pets.csv", petsCSV);
    zip.file("vet_visits.csv", vetVisitsCSV);
    zip.file("weight_records.csv", weightRecordsCSV);
    zip.file("medications.csv", medicationsCSV);
    zip.file("vaccinations.csv", vaccinationsCSV);

    const zipContent: ArrayBuffer = await zip.generateAsync({ type: "arraybuffer" });

    const exportDate = new Date().toISOString().split("T")[0];
    const filename = `pets-export-${exportDate}.zip`;

    const response = new NextResponse(zipContent, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=${encodeURIComponent(filename)}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error exporting pet data:", error);
    return NextResponse.json({ error: "Error exporting pet data" }, { status: 500 });
  }
}
