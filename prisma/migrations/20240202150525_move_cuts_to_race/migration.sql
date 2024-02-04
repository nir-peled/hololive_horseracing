/*
  Warnings:

  - You are about to drop the column `house_cut_percent` on the `RaceContestant` table. All the data in the column will be lost.
  - You are about to drop the column `place_cut_percent` on the `RaceContestant` table. All the data in the column will be lost.
  - You are about to drop the column `show_cut_percent` on the `RaceContestant` table. All the data in the column will be lost.
  - You are about to drop the column `win_cut_percent` on the `RaceContestant` table. All the data in the column will be lost.
  - Added the required column `house_cut_percent` to the `Race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_cut_percent` to the `Race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `show_cut_percent` to the `Race` table without a default value. This is not possible if the table is not empty.
  - Added the required column `win_cut_percent` to the `Race` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Race" ADD COLUMN     "house_cut_percent" INTEGER NOT NULL,
ADD COLUMN     "place_cut_percent" INTEGER NOT NULL,
ADD COLUMN     "show_cut_percent" INTEGER NOT NULL,
ADD COLUMN     "win_cut_percent" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RaceContestant" DROP COLUMN "house_cut_percent",
DROP COLUMN "place_cut_percent",
DROP COLUMN "show_cut_percent",
DROP COLUMN "win_cut_percent";
