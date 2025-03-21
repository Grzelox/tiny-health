-- CreateTable
CREATE TABLE "UserShare" (
    "id" SERIAL NOT NULL,
    "ownerId" TEXT NOT NULL,
    "sharedWith" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserShare_sharedWith_idx" ON "UserShare"("sharedWith");

-- CreateIndex
CREATE INDEX "UserShare_ownerId_idx" ON "UserShare"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "UserShare_ownerId_sharedWith_key" ON "UserShare"("ownerId", "sharedWith");
