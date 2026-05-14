-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN "pickupOtp" TEXT,
ADD COLUMN "pickupOtpExpiry" TIMESTAMP(3);
