/*
  Warnings:

  - You are about to drop the column `currentState` on the `Pet` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "currentState",
ADD COLUMN     "ownerId" TEXT NOT NULL;
