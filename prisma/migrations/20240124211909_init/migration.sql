-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "image" BYTEA,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "dept" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Horse" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" BYTEA NOT NULL,

    CONSTRAINT "Horse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Race" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isOpenBets" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Race_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaceContestant" (
    "id" BIGSERIAL NOT NULL,
    "jockey_id" BIGINT NOT NULL,
    "horse_id" BIGINT NOT NULL,
    "race_id" BIGINT NOT NULL,
    "place" INTEGER,
    "odds_denominator" INTEGER NOT NULL,
    "odds_numerator" INTEGER NOT NULL,
    "house_cut_percent" INTEGER NOT NULL,
    "win_cut_percent" INTEGER NOT NULL,
    "place_cut_percent" INTEGER NOT NULL,
    "show_cut_percent" INTEGER NOT NULL,

    CONSTRAINT "RaceContestant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "contestant_id" BIGINT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Horse_name_key" ON "Horse"("name");

-- CreateIndex
CREATE INDEX "Horse_name_idx" ON "Horse"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Race_name_key" ON "Race"("name");

-- CreateIndex
CREATE INDEX "Race_name_idx" ON "Race"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RaceContestant_race_id_jockey_id_key" ON "RaceContestant"("race_id", "jockey_id");

-- CreateIndex
CREATE UNIQUE INDEX "RaceContestant_race_id_horse_id_key" ON "RaceContestant"("race_id", "horse_id");

-- CreateIndex
CREATE UNIQUE INDEX "Bet_user_id_contestant_id_key" ON "Bet"("user_id", "contestant_id");

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
