-- DropForeignKey
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_contestant_id_fkey";

-- DropForeignKey
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_user_id_fkey";

-- DropForeignKey
ALTER TABLE "RaceContestant" DROP CONSTRAINT "RaceContestant_horse_id_fkey";

-- DropForeignKey
ALTER TABLE "RaceContestant" DROP CONSTRAINT "RaceContestant_jockey_id_fkey";

-- DropForeignKey
ALTER TABLE "RaceContestant" DROP CONSTRAINT "RaceContestant_race_id_fkey";

-- AlterTable
ALTER TABLE "Race" ALTER COLUMN "house_cut_percent" SET DEFAULT 0,
ALTER COLUMN "place_cut_percent" SET DEFAULT 0,
ALTER COLUMN "show_cut_percent" SET DEFAULT 0,
ALTER COLUMN "win_cut_percent" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "RaceContestant" ALTER COLUMN "odds_denominator" SET DEFAULT 0,
ALTER COLUMN "odds_numerator" SET DEFAULT 0;

-- CreateIndex
CREATE INDEX "Bet_user_id_idx" ON "Bet"("user_id");

-- CreateIndex
CREATE INDEX "RaceContestant_race_id_idx" ON "RaceContestant"("race_id");

-- AddForeignKey
ALTER TABLE "RaceContestant" ADD CONSTRAINT "RaceContestant_jockey_id_fkey" FOREIGN KEY ("jockey_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaceContestant" ADD CONSTRAINT "RaceContestant_horse_id_fkey" FOREIGN KEY ("horse_id") REFERENCES "Horse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaceContestant" ADD CONSTRAINT "RaceContestant_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "Race"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_contestant_id_fkey" FOREIGN KEY ("contestant_id") REFERENCES "RaceContestant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
