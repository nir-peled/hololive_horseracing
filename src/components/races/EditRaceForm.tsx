"use client";
import React, { BaseSyntheticEvent, useState } from "react";
import useSWR from "swr";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { TFunction } from "i18next";
import { z } from "zod";
import { json_fetcher } from "@/src/lib/hooks";
import { RaceFormData } from "@/src/lib/types";
import {
	date_to_datetime_local,
	datetime_local_to_date,
	join_with_separator,
} from "@/src/lib/utils";
import LoadingMarker from "../LoadingMarker";
import Alert from "../Alert";
import Button from "../Button";
import TextFormInput from "../forms/TextFormInput";
import EnabledFormInput from "../forms/EnabledFormInput";
import AddContestantSelect from "./AddContestantSelect";
import ContestantsTable from "./ContestantsTable";
import RaceCutsInput from "./RaceCutsInput";

interface Props {
	id?: number;
}

const namespaces = ["races", "management"];

export default function EditRaceForm({ id }: Props) {
	const { t } = useTranslation(namespaces);
	const race_schema = create_race_schema(t);

	const { data: default_values, isLoading } = useSWR<Partial<RaceFormData>>(
		"/api/management/races/form_data",
		(url: string) => {
			if (id) return json_fetcher(url + "?" + new URLSearchParams({ id: String(id) }));
			else return {};
		}
	);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isSubmitted, isSubmitSuccessful, isValid },
		reset,
		resetField,
	} = useForm<RaceFormData>({
		resolver: zodResolver(race_schema),
	});

	const {
		fields: contestants,
		append: new_contestant,
		remove: remove_contestant,
	} = useFieldArray<RaceFormData>({
		control,
		name: "contestants",
		shouldUnregister: true,
	});

	const [is_failed, set_is_failed] = useState<boolean>(false);

	async function submit_form(data: RaceFormData, event?: BaseSyntheticEvent) {
		if (event) event.preventDefault();

		let endpoint = `/api/management/races/${id ? "edit" : "new"}`;
		if (id) endpoint += "?" + encodeURIComponent(id);

		let form_data = new FormData();
		for (let [key, value] of Object.entries(data))
			if (
				value != undefined &&
				(!default_values || default_values[key as keyof RaceFormData] != value)
			)
				form_data.append(key, JSON.stringify(value));

		let result = await fetch(endpoint, {
			method: "POST",
			body: form_data,
		});

		if (result.ok) {
			// if form is used for new user, reset the form to empty
			if (!id) reset();
			if (is_failed) set_is_failed(false);
		} else {
			reset(data);
			set_is_failed(true);
		}
	}

	if (isLoading) return <LoadingMarker />;

	return (
		<form onSubmit={handleSubmit(submit_form)} id="edit_race_form">
			<Alert
				type="success"
				message={t("new-race-success", { ns: "management" })}
				active={isSubmitSuccessful && !is_failed}
			/>
			<Alert
				type="error"
				message={t("new-race-fail", { ns: "management" })}
				active={is_failed}
			/>
			<label className="form-control w-full max-w-lg">
				{/* input race name */}
				<TextFormInput
					label={t("race-name-label", { ns: "races" })}
					field_name="name"
					register={register}
					error={errors?.name?.message}
					default_value={default_values?.name}
				/>
				<br />
				{/* input race deadline, if it has */}
				<EnabledFormInput
					label={t("race-deadline-input", { ns: "races" })}
					error={errors?.deadline?.message}
					default_enabled={!!default_values?.deadline}
					render={(enabled) => {
						if (!enabled) resetField("deadline", { defaultValue: null });

						return (
							<TextFormInput
								label=""
								field_name="deadline"
								type="datetime-local"
								register={register}
								default_value={
									default_values?.deadline
										? date_to_datetime_local(default_values.deadline)
										: undefined
								}
								disabled={!enabled}
							/>
						);
					}}
				/>
				<br />
				{/* input race cuts, if not default */}
				<RaceCutsInput
					default_values={default_values}
					reset={resetField}
					register={register}
					errors={errors}
				/>
				<br />
				{/* input contestants list */}
				<AddContestantSelect contestants={contestants} add_contestant={new_contestant} />
				<br />
				<ContestantsTable
					contestants={contestants}
					remove_contestant={remove_contestant}
				/>
				<br />
				<Button type="submit" disabled={isValid && isSubmitted} className="m-2">
					{t("new-race-submit")}
				</Button>
			</label>
		</form>
	);
}

function create_race_schema(t: TFunction) {
	const contestant_schema = z.object({
		jockey: z.string(),
		horse: z.string(),
	});

	return z
		.object({
			name: z.string().min(3, t("race-name-too-short", { ns: "management" })),
			deadline: z.string().optional(),
			house_cut: z
				.number()
				.min(0, t("race-cut-negative-error", { ns: "management" }))
				.optional(),
			win_cut: z
				.number()
				.min(0, t("race-cut-negative-error", { ns: "management" }))
				.optional(),
			place_cut: z
				.number()
				.min(0, t("race-cut-negative-error", { ns: "management" }))
				.optional(),
			show_cut: z
				.number()
				.min(0, t("race-cut-negative-error", { ns: "management" }))
				.optional(),
			contestants: contestant_schema.array(),
		})
		.refine(
			(data) => data.deadline && datetime_local_to_date(data.deadline) < new Date(),
			{
				message: t("race-deadline-passed", { ns: "management" }),
				path: ["deadline"],
			}
		);
}