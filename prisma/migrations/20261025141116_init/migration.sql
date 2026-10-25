-- CreateEnum
CREATE TYPE "AreaLevel" AS ENUM ('REGION', 'PROVINCE', 'CITY');

-- CreateTable
CREATE TABLE "Area" (
    "psgc" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" "AreaLevel" NOT NULL,
    "parentPsgc" TEXT,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("psgc")
);

-- CreateTable
CREATE TABLE "Spot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "cityPsgc" TEXT NOT NULL,

    CONSTRAINT "Spot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "supabaseId" TEXT NOT NULL,
    "name" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stamp" (
    "userId" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,

    CONSTRAINT "Stamp_pkey" PRIMARY KEY ("userId","spotId")
);

-- CreateIndex
CREATE INDEX "Area_parentPsgc_idx" ON "Area"("parentPsgc");

-- CreateIndex
CREATE INDEX "Spot_cityPsgc_idx" ON "Spot"("cityPsgc");

-- CreateIndex
CREATE UNIQUE INDEX "User_supabaseId_key" ON "User"("supabaseId");

-- CreateIndex
CREATE INDEX "Stamp_spotId_idx" ON "Stamp"("spotId");

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_parentPsgc_fkey" FOREIGN KEY ("parentPsgc") REFERENCES "Area"("psgc") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spot" ADD CONSTRAINT "Spot_cityPsgc_fkey" FOREIGN KEY ("cityPsgc") REFERENCES "Area"("psgc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stamp" ADD CONSTRAINT "Stamp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stamp" ADD CONSTRAINT "Stamp_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
