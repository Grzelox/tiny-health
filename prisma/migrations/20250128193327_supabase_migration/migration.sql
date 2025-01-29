/*
  Warnings:

  - You are about to drop the column `birthDate` on the `Pet` table. All the data in the column will be lost.
  - Added the required column `metadata` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bornAt` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "metadata" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "birthDate",
ADD COLUMN     "bornAt" TIMESTAMP(3) NOT NULL;
