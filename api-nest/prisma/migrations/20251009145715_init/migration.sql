-- CreateEnum
CREATE TYPE "Status" AS ENUM ('open', 'closed', 'in_progress');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('medium', 'low', 'high');

-- CreateTable
CREATE TABLE "Issues" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'open',
    "priority" "Priority" NOT NULL DEFAULT 'medium',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "issueId" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Issues_status_idx" ON "Issues"("status");

-- CreateIndex
CREATE INDEX "Issues_priority_idx" ON "Issues"("priority");

-- CreateIndex
CREATE INDEX "Issues_createdAt_idx" ON "Issues"("createdAt");

-- CreateIndex
CREATE INDEX "Comments_issueId_idx" ON "Comments"("issueId");

-- CreateIndex
CREATE INDEX "Comments_createdAt_idx" ON "Comments"("createdAt");

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
