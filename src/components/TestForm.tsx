"use client";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Button from "./Button";
import { echo } from "../lib/actions";
import { RaceFormData } from "../lib/types";
import AddContestantSelect from "./races/AddContestantSelect";
import EditRaceContestantsTable from "./races/EditRaceContestantsTable";

export default function TestForm() {
	// return <Button onClick={async () => alert(await echo("Hello, World!"))}>Echo</Button>;

	const { control, handleSubmit } = useForm<Partial<RaceFormData>>({});

	const {
		fields: contestants,
		append: new_contestant,
		remove: remove_contestant,
	} = useFieldArray<Partial<RaceFormData>>({
		control,
		name: "contestants",
		shouldUnregister: true,
	});

	async function submit(data: Partial<RaceFormData>) {
		console.log("submit");
		alert(JSON.stringify(await echo(data)));
	}

	return (
		<form onSubmit={handleSubmit(submit)}>
			<AddContestantSelect contestants={contestants} add_contestant={new_contestant} />
			<br />
			<EditRaceContestantsTable
				contestants={contestants}
				remove_contestant={remove_contestant}
			/>
			<Button type="submit">Submit</Button>
		</form>
	);
}
