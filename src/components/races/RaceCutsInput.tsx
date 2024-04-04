"use client";
import { join_with_separator } from "@/src/lib/utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { UseFormRegister } from "react-hook-form";
import { Concat } from "@/src/lib/types";
import EnabledFormInput from "../forms/EnabledFormInput";
import TextFormInput from "../forms/TextFormInput";

const namespaces = ["races"];

const cuts_names = ["house", "win", "place", "show"] as const;

type cut_name_t = Concat<[(typeof cuts_names)[number], "_cut"]>;

interface Props {
	default_values?: Partial<Record<cut_name_t, number | undefined>>;
	reset: (name: cut_name_t, opt: { defaultValue?: number }) => void;
	register?: UseFormRegister<any>;
	errors: Partial<Record<cut_name_t, { message?: string }>>;
}

export default function RaceCutsInput({
	default_values,
	reset,
	register,
	errors,
}: Props) {
	const { t } = useTranslation(namespaces);
	return (
		<EnabledFormInput
			label={t("race-cuts-input", { ns: "races" })}
			default_enabled={default_values?.house_cut !== undefined}
			render={(enabled) => {
				if (!enabled) {
					cuts_names.forEach((taker) =>
						reset(as_cut(taker), {
							defaultValue: undefined,
						})
					);
				}

				return cuts_names.map((taker, i) => {
					let field_name = as_cut(taker);
					return (
						<TextFormInput
							key={i}
							label={t(`${taker}-cut-label`, { ns: "races" })}
							field_name={field_name}
							type="number"
							register={register}
							error={errors[field_name]?.message}
							default_value={default_values && default_values[field_name]}
							disabled={!enabled}
						/>
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
