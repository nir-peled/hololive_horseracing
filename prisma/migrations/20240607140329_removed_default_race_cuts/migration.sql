-- AlterTable
ALTER TABLE "Race" ALTER COLUMN "house_cut_percent" DROP NOT NULL,
ALTER COLUMN "house_cut_percent" DROP DEFAULT,
ALTER COLUMN "place_cut_percent" DROP NOT NULL,
ALTER COLUMN "place_cut_percent" DROP DEFAULT,
ALTER COLUMN "show_cut_percent" DROP NOT NULL,
ALTER COLUMN "show_cut_percent" DROP DEFAULT,
ALTER COLUMN "win_cut_percent" DROP NOT NULL,
ALTER COLUMN "win_cut_percent" DROP DEFAULT;
