/*
  Warnings:

  - A unique constraint covering the columns `[orderId,reviewerId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Review_orderId_reviewerId_key" ON "Review"("orderId", "reviewerId");
