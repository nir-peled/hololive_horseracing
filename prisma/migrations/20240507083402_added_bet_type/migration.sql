/*
  Warnings:

  - Added the required column `type` to the `Bet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BetType" AS ENUM ('WIN', 'PLACE', 'SHOW');

-- AlterTable
ALTER TABLE "Bet" ADD COLUMN     "type" "BetType" NOT NULL;
