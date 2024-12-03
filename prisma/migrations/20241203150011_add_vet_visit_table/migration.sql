-- CreateTable
CREATE TABLE "VetVisit" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "medication" TEXT NOT NULL,

    CONSTRAINT "VetVisit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VetVisit" ADD CONSTRAINT "VetVisit_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
