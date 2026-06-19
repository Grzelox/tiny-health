-- CreateTable
CREATE TABLE "Medication" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT,
    "frequency" TEXT,
    "route" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "notes" TEXT,
    "vetVisitId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaccination" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "administeredDate" TIMESTAMP(3) NOT NULL,
    "nextDueDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vaccination_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Medication_petId_idx" ON "Medication"("petId");

-- CreateIndex
CREATE INDEX "Vaccination_petId_idx" ON "Vaccination"("petId");

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_vetVisitId_fkey" FOREIGN KEY ("vetVisitId") REFERENCES "VetVisit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill structured medications from existing freeform VetVisit.medication entries.
-- The original VetVisit rows are left untouched so no existing data is lost; this
-- only mirrors non-empty medication strings into the new structured table, using the
-- visit date as the medication start date and linking back to the originating visit.
INSERT INTO "Medication" ("petId", "name", "startDate", "vetVisitId", "createdAt", "updatedAt")
SELECT "petId", btrim("medication"), "date", "id", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "VetVisit"
WHERE "medication" IS NOT NULL AND btrim("medication") <> '';
