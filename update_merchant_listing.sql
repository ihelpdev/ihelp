ALTER TABLE "MerchantListing" 
ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "coverImageUrl" TEXT;
