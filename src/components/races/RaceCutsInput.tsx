"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { UseFormRegister } from "react-hook-form";
import { join_with_separator } from "@/src/lib/utils";
import { Concat } from "@/src/lib/types";
import EnabledFormInput from "../forms/EnabledFormInput";
import TextFormInput from "../forms/TextFormInput";

const namespaces = ["management"];

const cuts_names = ["house", "win", "place", "show"] as const;

type cut_name_t = Concat<[(typeof cuts_names)[number], "_cut"]>;
type base_t = { [K in cut_name_t]?: number | null | undefined };

interface Props<T extends base_t> {
	default_values?: base_t;
	set_field: (name: cut_name_t, new_val: number | undefined) => void;
	register?: UseFormRegister<T>;
	errors: Partial<Record<cut_name_t, { message?: string }>>;
}

export default function RaceCutsInput<T extends base_t>({
	default_values,
	set_field,
	register,
	errors,
}: Props<T>) {
	const { t } = useTranslation(namespaces);
	return (
		<EnabledFormInput
			label={t("race-cuts-input")}
			checkbox_label={t("race-cuts-checkbox-label")}
			default_checked={!!default_values}
			onChange={(enabled) => {
				if (!enabled) cuts_names.forEach((taker) => set_field(as_cut(taker), undefined));
			}}
			render={(enabled) => {
				let text_style = "text-slate-300";
				if (!enabled) text_style = "text-black";

				return cuts_names.map((taker, i) => {
					let field_name = as_cut(taker);
					return (
						// <label
						// 	className={`input input-bordered flex items-center gap-2 ${text_style}`}
						// 	key={i}>
						<div key={i}>
							<TextFormInput
								label={t(`${taker}-cut-label`)}
								field_name={field_name}
								type="number"
								register={register}
								error={errors[field_name]?.message}
								default_value={
									enabled
										? undefined
										: (default_values && default_values[field_name]) || undefined
								}
								disabled={!enabled}
								marker_after={<span className="badge">%</span>}
							/>
						</div>
						// </label>
					);
				});
			}}
		/>
	);
}

// function as_cut<T extends string>(taker: T): Concat<[T, "_cut"]> {
// 	return (taker + "_cut") as Concat<[T, "_cut"]>;
// }

function as_cut<T extends string>(taker: T) {
	return join_with_separator("")(taker, "_cut");
}
