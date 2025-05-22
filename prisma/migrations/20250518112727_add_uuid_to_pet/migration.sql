/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Pet` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "uuid" UUID NOT NULL DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "Pet_uuid_key" ON "Pet"("uuid");
