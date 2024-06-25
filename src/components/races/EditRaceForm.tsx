"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { z } from "zod";
import { date_to_datetime_local, datetime_local_to_date, sum } from "@/src/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitter } from "@/src/lib/hooks";
import { RaceFormData } from "@/src/lib/types";
import Button from "../Button";
import Alert from "../Alert";
import TextFormInput from "../forms/TextFormInput";
import EnabledFormInput from "../forms/EnabledFormInput";
import AddContestantSelect from "./AddContestantSelect";
import EditRaceContestantsTable from "./EditRaceContestantsTable";
import RaceCutsInput from "./RaceCutsInput";

interface Props {
	id?: number;
	default_values?: RaceFormData;
}

const namespaces = ["management"];

export default function EditRaceForm({ id, default_values }: Props) {
	const { t } = useTranslation(namespaces);
	const race_schema = create_race_schema(t);
	const endpoint = useMemo<string>(() => {
		if (id)
			return "/api/management/races/edit?" + new URLSearchParams({ id: String(id) });
		return "/api/management/races/new";
	}, [id]);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isSubmitSuccessful, isLoading },
		reset,
		resetField,
		setValue,
	} = useForm<RaceFormData>({
		resolver: zodResolver(race_schema),
		defaultValues: {
			...default_values,
			deadline: default_values?.deadline || undefined,
			contestants: [],
		},
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

	useEffect(() => {
		if (!default_values || contestants.length == default_values.contestants.length)
			return;
		new_contestant(default_values.contestants);
	}, [id]);

	const [is_failed, set_is_failed] = useState<boolean>(false);

	const submit_form = useSubmitter<RaceFormData>(endpoint, {
		is_failed,
		set_is_failed,
		default_values,
		reset,
	});

	return (
		<form onSubmit={handleSubmit(submit_form)} id="edit_race_form">
			<Alert
				type="success"
				message={t("new-race-success")}
				active={isSubmitSuccessful && !is_failed}
			/>
			<Alert type="error" message={t("new-race-fail")} active={is_failed} />
			<label className="form-control w-full max-w-lg">
				{/* input race name */}
				<TextFormInput
					label={t("race-name-label")}
					field_name="name"
					register={register}
					error={errors?.name?.message}
				/>
				<br />
				{/* input race deadline, if it has */}
				<EnabledFormInput
					label={t("race-deadline-input", {
						timezone: process.env.NEXT_PUBLIC_DEADLINE_TIMEZONE,
					})}
					error={errors?.deadline?.message}
					default_checked={!!default_values?.deadline}
					render={(enabled) => {
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
								step={process.env.NEXT_PUBLIC_DATETIME_STEP}
							/>
						);
					}}
					onChange={(enabled) => {
						if (!enabled) resetField("deadline", { defaultValue: null });
					}}
				/>
				<br />
				{/* input race cuts, if not default */}
				<RaceCutsInput
					default_values={default_values}
					set_field={setValue}
					register={register}
					errors={errors}
				/>
				<br />
				{/* input contestants list */}
				<AddContestantSelect contestants={contestants} add_contestant={new_contestant} />
				<br />
				<EditRaceContestantsTable
					contestants={contestants}
					remove_contestant={remove_contestant}
				/>
				<br />
				<Button type="submit" disabled={isLoading} className="m-2">
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
			name: z.string().min(3, t("race-name-too-short")),
			deadline: z.string().optional().nullable(),
			house_cut: z.number().min(0, t("race-cut-negative-error")).optional(),
			win_cut: z.number().min(0, t("race-cut-negative-error")).optional(),
			place_cut: z.number().min(0, t("race-cut-negative-error")).optional(),
			show_cut: z.number().min(0, t("race-cut-negative-error")).optional(),
			contestants: contestant_schema.array(),
		})
		.refine(
			(data) => !data.deadline || datetime_local_to_date(data.deadline) < new Date(),
			{
				message: t("race-deadline-passed"),
				path: ["deadline"],
			}
		)
		.refine(
			(data) =>
				data.house_cut === undefined ||
				![data.house_cut, data.win_cut, data.place_cut, data.show_cut].includes(
					undefined
				),
			{
				message: t("race-cuts-one-or-all"),
				path: ["house_cut"],
			}
		)
		.refine(
			(data) =>
				data.house_cut == null ||
				sum(
					[data.house_cut, data.win_cut, data.place_cut, data.show_cut],
					(n: number | undefined) => n || 0
				) < 100,
			{
				message: t("race-cuts-exceed-100"),
				path: ["house_cut"],
			}
		);
}
