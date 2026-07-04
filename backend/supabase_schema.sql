-- SQL Schema for AromaTrace Batch Registry
-- Paste this script into the Supabase SQL Editor to initialize the database.

-- Drop the table if it already exists to allow clean schema rebuilds
DROP TABLE IF EXISTS "Batch" CASCADE;

-- Create the "Batch" table matching the Prisma definitions
CREATE TABLE "Batch" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Add database constraints to ensure data integrity
ALTER TABLE "Batch" ADD CONSTRAINT "chk_batch_quantity_positive" CHECK ("quantity" >= 0);

-- Create indexes on frequently searched and sorted columns to optimize performance
CREATE INDEX IF NOT EXISTS "idx_batch_name_trgm" ON "Batch" USING btree ("name");
CREATE INDEX IF NOT EXISTS "idx_batch_status" ON "Batch" USING btree ("status");
CREATE INDEX IF NOT EXISTS "idx_batch_created_at" ON "Batch" USING btree ("createdAt" DESC);
