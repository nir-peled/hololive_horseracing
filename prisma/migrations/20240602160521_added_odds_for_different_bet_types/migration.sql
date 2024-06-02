/*
  Warnings:

  - You are about to drop the column `odds_denominator` on the `RaceContestant` table. All the data in the column will be lost.
  - You are about to drop the column `odds_numerator` on the `RaceContestant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RaceContestant" DROP COLUMN "odds_denominator",
DROP COLUMN "odds_numerator",
ADD COLUMN     "place_denominator" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "place_numerator" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "show_denominator" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "show_numerator" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "win_denominator" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "win_numerator" INTEGER NOT NULL DEFAULT 0;
