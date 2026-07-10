-- AlterTable: support OAuth users and optional passwords
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';

-- Add OAuth provider fields
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "provider" TEXT NOT NULL DEFAULT 'local';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "providerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_provider_providerId_key" ON "User"("provider", "providerId");
