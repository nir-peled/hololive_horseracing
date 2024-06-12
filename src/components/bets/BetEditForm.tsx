"use client";
import { z } from "zod";
import { TFunction } from "i18next";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useSubmitter } from "@/src/lib/hooks";
import {
	FullBetData,
	ContestantDisplayData,
	FullBetFormData,
	BETS_TYPES,
	bet_type,
} from "@/src/lib/types";
import ContestantSelectOption from "../forms/ContestantSelectOption";
import SelectFormInput from "../forms/SelectFormInput";
import FormInput from "../forms/FormInput";
import Button from "../Button";
import { make_full_bet } from "@/src/lib/actions";
import { sum } from "@/src/lib/utils";

const namespaces = ["bets"];

interface Props {
	user: string;
	race: bigint;
	contestants: ContestantDisplayData[];
	balance: number;
	existing_bet?: FullBetData | undefined;
}

type bet_form_data = Omit<Omit<FullBetFormData, "user">, "race">;

export default function BetEditForm({
	user,
	race,
	contestants,
	balance,
	existing_bet,
}: Props) {
	const { t } = useTranslation(namespaces);
	const bet_schema = create_bet_schema(t, balance, existing_bet);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isSubmitted, isValid },
		reset,
		resetField,
		watch,
	} = useForm<bet_form_data>({
		resolver: zodResolver(bet_schema),
	});

	const [is_failed, set_is_failed] = useState<boolean>(false);

	const submit_form = useSubmitter<bet_form_data>(
		(data: bet_form_data) => make_full_bet(user, race, data),
		{
			is_failed,
			set_is_failed,
			default_values: existing_bet,
			reset,
			on_success: () => location.assign("/races"),
		}
	);

	const options = contestants.map((c) => c.id);

	return (
		<form onSubmit={handleSubmit(submit_form)}>
			{/* index is OK here for key, because it's constant order */}
			{BETS_TYPES.map((bet_type, idx) => (
				<FormInput
					key={idx}
					className={`flex flex-row ${
						!watch(bet_type) && "border-gray-500 text-gray-500"
					}`}
					label={t(`bet-${bet_type}`)}
					error={
						errors[bet_type]?.message ||
						errors[bet_type]?.amount?.message ||
						errors[bet_type]?.contestant?.message
					}>
					{/* Select contestant */}
					<SelectFormInput
						control={control}
						name={`${bet_type}.contestant`}
						placeholder={t("bet-select-contestant-placeholder")}
						options={options}
						// disabled_options={chosen_options}
						render_option={(data, option_state) => {
							const contestant = contestants.find((c) => c.id == data);
							if (!contestant) return;

							return <ContestantSelectOption data={contestant} state={option_state} />;
						}}
					/>
					{/* Bet amount */}
					<input type="number" {...register(`${bet_type}.amount`)} />
					{/* Clear this bet */}
					<Button
						className="btn-square btn-outline btn-error"
						onClick={() => resetField(bet_type)}>
						{/* X symbol */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</Button>
				</FormInput>
			))}
			<Button type="submit" disabled={isValid && isSubmitted} className="m-2">
				{t("edit-bet-submit")}
			</Button>
		</form>
	);
}

function all_bets_amount(
	bet: Partial<Record<bet_type, { amount: number } | undefined>> | undefined
) {
	return bet
		? sum(
				[bet?.place?.amount, bet?.show?.amount, bet?.win?.amount],
				(e: number | undefined) => e || 0
		  )
		: 0;
}

function create_bet_schema(
	t: TFunction,
	balance: number,
	existing_bet: FullBetData | undefined
) {
	const create_bet_details_shcema = () =>
		z.object({
			contestant: z.bigint(),
			amount: z.number().int(t("bet-must-be-integer")).min(1, t("bet-must-be-positive")),
		});

	let base_schema = z.object({
		win: create_bet_details_shcema().optional(),
		place: create_bet_details_shcema().optional(),
		show: create_bet_details_shcema().optional(),
	});

	type data_t = z.infer<typeof base_schema>;
	type schema_t = z.ZodType<data_t>;

	const refine_unique_contestant = (schema: schema_t, field: keyof data_t) =>
		// if field exists in data, make sure no other field has the same contestant
		schema.refine(
			(data) =>
				data[field] !== undefined &&
				Object.values(data).filter((e) => e.contestant == data[field]?.contestant)
					.length == 1,
			{
				message: t("bet-edit-contestant-duplicate"),
				path: [field],
			}
		);

	let med_shcema = BETS_TYPES.reduce<schema_t>(
		(schema, type) => refine_unique_contestant(schema, type),
		base_schema
	);

	const existing_bet_amount = all_bets_amount(existing_bet);
	const max_bet_amount = balance + existing_bet_amount;

	return med_shcema.refine((data) => all_bets_amount(data) <= max_bet_amount, {
		message: t("bet-amount-exceeds-max"),
		path: ["win"],
	});
}
