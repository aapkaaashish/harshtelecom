-- CreateTable
CREATE TABLE "parts_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "technicianName" TEXT NOT NULL,
    "technicianEmail" TEXT NOT NULL,
    "partType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "urgency" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requestTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adminNotes" TEXT,
    "approvedTime" DATETIME,
    "rejectedTime" DATETIME
);
