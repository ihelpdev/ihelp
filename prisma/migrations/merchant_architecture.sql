-- ============================================================
-- iHelp Schema Migration — Multi-Tenant Merchant Architecture
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add ACCEPTED and REJECTED to the JobStatus enum
ALTER TYPE "JobStatus" ADD VALUE IF NOT EXISTS 'ACCEPTED';
ALTER TYPE "JobStatus" ADD VALUE IF NOT EXISTS 'REJECTED';

-- 2. Add new columns to the Job table
ALTER TABLE "Job"
  ADD COLUMN IF NOT EXISTS "serviceId"   TEXT,
  ADD COLUMN IF NOT EXISTS "serviceType" TEXT,
  ADD COLUMN IF NOT EXISTS "frequency"   TEXT;

-- 3. Create the MerchantListing table
CREATE TABLE IF NOT EXISTS "MerchantListing" (
  "id"          TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
  "merchantId"  TEXT        NOT NULL,
  "name"        TEXT        NOT NULL,
  "description" TEXT        NOT NULL,
  "category"    TEXT        NOT NULL DEFAULT 'General',
  "baseRateNgn" DOUBLE PRECISION NOT NULL,
  "unit"        TEXT        NOT NULL DEFAULT 'hour',
  "notes"       TEXT        NOT NULL DEFAULT '',
  "details"     JSONB       NOT NULL DEFAULT '{}',
  "isActive"    BOOLEAN     NOT NULL DEFAULT true,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "MerchantListing_pkey" PRIMARY KEY ("id")
);

-- 4. Add foreign key from MerchantListing to User
ALTER TABLE "MerchantListing"
  ADD CONSTRAINT "MerchantListing_merchantId_fkey"
  FOREIGN KEY ("merchantId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 5. Add index on merchantId for fast merchant-scoped queries
CREATE INDEX IF NOT EXISTS "MerchantListing_merchantId_idx"
  ON "MerchantListing"("merchantId");

-- 6. Auto-update updatedAt on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'set_merchant_listing_updated_at'
  ) THEN
    CREATE TRIGGER set_merchant_listing_updated_at
      BEFORE UPDATE ON "MerchantListing"
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;
