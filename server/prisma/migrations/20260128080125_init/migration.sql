-- CreateTable
CREATE TABLE "Center" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Branch" (
    "name" TEXT NOT NULL,
    "centerName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("name", "centerName"),
    CONSTRAINT "Branch_centerName_fkey" FOREIGN KEY ("centerName") REFERENCES "Center" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Section" (
    "name" TEXT NOT NULL,
    "branchName" TEXT NOT NULL,
    "branchCenter" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("name", "branchName", "branchCenter"),
    CONSTRAINT "Section_branchName_branchCenter_fkey" FOREIGN KEY ("branchName", "branchCenter") REFERENCES "Branch" ("name", "centerName") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Base" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Environment" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Network" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "baseName" TEXT NOT NULL,
    "environmentName" TEXT NOT NULL,
    "networkName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Location_baseName_fkey" FOREIGN KEY ("baseName") REFERENCES "Base" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Location_environmentName_fkey" FOREIGN KEY ("environmentName") REFERENCES "Environment" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Location_networkName_fkey" FOREIGN KEY ("networkName") REFERENCES "Network" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Service" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Resource" (
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("name", "serviceName"),
    CONSTRAINT "Resource_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "Service" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Capacity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locationId" TEXT NOT NULL,
    "resourceName" TEXT NOT NULL,
    "resourceService" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Capacity_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Capacity_resourceName_resourceService_fkey" FOREIGN KEY ("resourceName", "resourceService") REFERENCES "Resource" ("name", "serviceName") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_baseName_environmentName_networkName_key" ON "Location"("baseName", "environmentName", "networkName");

-- CreateIndex
CREATE UNIQUE INDEX "Capacity_locationId_resourceName_resourceService_key" ON "Capacity"("locationId", "resourceName", "resourceService");
