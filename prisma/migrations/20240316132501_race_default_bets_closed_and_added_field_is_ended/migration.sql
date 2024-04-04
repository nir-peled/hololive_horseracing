-- AlterTable
ALTER TABLE "Race" ADD COLUMN     "isEnded" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "isOpenBets" SET DEFAULT false;
