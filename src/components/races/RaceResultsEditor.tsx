import { notFound } from "next/navigation";
import React from "react";
import { database_factory } from "@/src/lib/database";
import { RaceResultsForm } from "./RaceResultsForm";

interface Props {
	id: bigint;
}

export default async function RaceResultsEditor({ id }: Props) {
	const contestants = await database_factory.race_database().get_race_contestants(id);

	if (contestants == null) return notFound();

	return <RaceResultsForm id={id} contestants={contestants} />;
}
