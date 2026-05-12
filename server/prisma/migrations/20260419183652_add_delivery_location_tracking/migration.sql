-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "lastLat" DOUBLE PRECISION,
ADD COLUMN     "lastLng" DOUBLE PRECISION,
ADD COLUMN     "lastUpdatedAt" TIMESTAMP(3);
