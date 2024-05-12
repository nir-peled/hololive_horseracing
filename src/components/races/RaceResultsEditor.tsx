import { notFound } from "next/navigation";
import React from "react";
import { database_factory } from "@/src/lib/database";
import { RaceResultsEditForm } from "./RaceResultsEditForm";

interface Props {
	id: bigint;
}

export default async function RaceResultsEditor({ id }: Props) {
	const contestants = await database_factory
		.race_database()
		.get_contestants_display_data(id);

	if (contestants == null) return notFound();

	return <RaceResultsEditForm id={id} contestants={contestants} />;
}
