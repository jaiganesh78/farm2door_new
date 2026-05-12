-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "webhookProcessed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpayOrderId_key" ON "Payment"("razorpayOrderId");

