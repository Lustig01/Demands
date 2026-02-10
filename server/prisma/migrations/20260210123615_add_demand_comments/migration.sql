-- CreateTable
CREATE TABLE "DemandComment" (
    "id" SERIAL NOT NULL,
    "demandId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemandComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DemandComment_demandId_idx" ON "DemandComment"("demandId");

-- AddForeignKey
ALTER TABLE "DemandComment" ADD CONSTRAINT "DemandComment_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "Demand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
