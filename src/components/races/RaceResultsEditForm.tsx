"use client";
import { z } from "zod";
import { TFunction } from "i18next";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContestantDisplayData, ContestantPlacementData } from "@/src/lib/types";
import { useSubmitter } from "@/src/lib/hooks";
import SelectFormInput from "../forms/SelectFormInput";
import ContestantSelectOption from "../forms/ContestantSelectOption";
import Button from "../Button";

interface Props {
	id: bigint;
	contestants: ContestantDisplayData[];
}

const namespaces = ["races"];

const positions = ["first", "second", "third"] as const;
// type position_t = (typeof positions)[number];

export function RaceResultsEditForm({ id, contestants }: Props) {
	const { t } = useTranslation(namespaces);
	const schema = create_schema(t);
	const [is_failed, set_is_failed] = useState<boolean>(false);

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitted, isSubmitSuccessful },
		watch,
	} = useForm<Partial<ContestantPlacementData>>({
		resolver: zodResolver(schema),
		defaultValues: {},
	});

	const chosen_ids = [watch("first"), watch("second"), watch("third")];
	// useMemo in order to call it unnecessarily?
	const disabled_options = contestants.filter((con) => chosen_ids.includes(con.id));

	const submit_results = useSubmitter<Partial<ContestantPlacementData>>(
		`/api/management/races/${id}/set_results`,
		{
			is_failed,
			set_is_failed,
			on_success: () => location.assign(`/races/${id}`),
		}
	);

	return (
		<form onSubmit={handleSubmit(submit_results)}>
			{positions.map((position, i) => (
				<SelectFormInput
					key={i}
					name={position}
					label={t(`race-contestant-${position}`)}
					error={errors[position]?.message}
					options={contestants}
					disabled_options={disabled_options}
					control={control}
					render_option={(data, option_state) => (
						<ContestantSelectOption data={data} state={option_state} />
					)}
				/>
			))}
			<Button type="submit" disabled={isSubmitted && !isSubmitSuccessful}>
				{t("race-results-submit-label")}
			</Button>
		</form>
	);
}

function create_schema(t: TFunction) {
	return z
		.object({
			first: z.bigint({ required_error: t("race-contestant_required") }),
			second: z.bigint({ required_error: t("race-contestant_required") }),
			third: z.bigint({ required_error: t("race-contestant_required") }),
		})
		.refine(({ first, second, third }) => first == second || first == third, {
			message: t("race-contestant-duplicate"),
			path: ["first"],
		})
		.refine(({ first, second, third }) => second == first || second == third, {
			message: t("race-contestant-duplicate"),
			path: ["second"],
		})
		.refine(({ first, second, third }) => third == second || first == third, {
			message: t("race-contestant-duplicate"),
			path: ["third"],
		});
}
