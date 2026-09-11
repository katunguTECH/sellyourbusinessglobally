/*
  Warnings:

  - A unique constraint covering the columns `[externalId,platform]` on the table `SocialMention` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "KeywordAlert" ADD COLUMN     "businessContext" TEXT,
ADD COLUMN     "subreddits" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "SocialMention" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "isRelevant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "keywordAlertId" TEXT,
ADD COLUMN     "numComments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "relevanceScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "suggestedReply" TEXT,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "upvotes" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "SocialMention_keywordAlertId_idx" ON "SocialMention"("keywordAlertId");

-- CreateIndex
CREATE INDEX "SocialMention_isRelevant_relevanceScore_idx" ON "SocialMention"("isRelevant", "relevanceScore");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMention_externalId_platform_key" ON "SocialMention"("externalId", "platform");

-- AddForeignKey
ALTER TABLE "SocialMention" ADD CONSTRAINT "SocialMention_keywordAlertId_fkey" FOREIGN KEY ("keywordAlertId") REFERENCES "KeywordAlert"("id") ON DELETE CASCADE ON UPDATE CASCADE;
