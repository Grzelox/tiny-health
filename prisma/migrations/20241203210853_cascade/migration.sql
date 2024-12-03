-- DropForeignKey
ALTER TABLE "VetVisit" DROP CONSTRAINT "VetVisit_petId_fkey";

-- AddForeignKey
ALTER TABLE "VetVisit" ADD CONSTRAINT "VetVisit_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
