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

-- AddForeignKey
ALTER TABLE "RaceContestant" ADD CONSTRAINT "RaceContestant_jockey_id_fkey" FOREIGN KEY ("jockey_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaceContestant" ADD CONSTRAINT "RaceContestant_horse_id_fkey" FOREIGN KEY ("horse_id") REFERENCES "Horse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaceContestant" ADD CONSTRAINT "RaceContestant_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_contestant_id_fkey" FOREIGN KEY ("contestant_id") REFERENCES "RaceContestant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
