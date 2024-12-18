/*
  Warnings:

  - You are about to drop the column `customId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `File` table. All the data in the column will be lost.
  - Added the required column `petId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "customId",
DROP COLUMN "metadata",
ADD COLUMN     "petId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
