-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('IN_PROCESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'PARTIALLY_APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "sn_link" TEXT,
    "center" TEXT,
    "branch" TEXT,
    "mador" TEXT,
    "dc" TEXT,
    "network" TEXT,
    "environment" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'IN_PROCESS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_lines" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "requested_quantity" INTEGER NOT NULL,
    "approved_quantity" INTEGER,
    "unit" TEXT,
    "purpose" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "decision_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "request_lines_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "request_lines" ADD CONSTRAINT "request_lines_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
