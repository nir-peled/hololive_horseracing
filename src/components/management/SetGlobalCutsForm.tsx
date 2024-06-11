"use client";
import { z } from "zod";
import React from "react";
import { TFunction } from "i18next";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { set_global_cuts } from "@/src/lib/actions";
import { Cuts } from "@/src/lib/types";
import TextFormInput from "../forms/TextFormInput";

interface Props {
	cuts: Cuts;
}

interface FormValues {
	house: number;
	first: number;
	second: number;
	third: number;
}

const namespaces = ["management"];

export default function SetGlobalCutsForm({ cuts }: Props) {
	const { t } = useTranslation(namespaces);
	const schema = make_schema(t);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: cuts,
	});

	async function submit(values: FormValues) {
		let cuts: Cuts = {
			house: values.house,
			jockeys: [values.first, values.second, values.third],
		};

		let result = await set_global_cuts(cuts);
		if (result) alert(t("set-global-cuts-success"));
		else alert(t("set-global-cuts-fail"));
	}

	return (
		<form onSubmit={handleSubmit(submit)}>
			<TextFormInput
				type="number"
				label={t("house-cut-label")}
				field_name="house"
				register={register}
				error={errors?.house?.message}
				default_value={cuts.house}
			/>
			<TextFormInput
				type="number"
				label={t("first-cut-label")}
				field_name="first"
				register={register}
				error={errors?.first?.message}
				default_value={cuts.jockeys[0]}
			/>
			<TextFormInput
				type="number"
				label={t("second-cut-label")}
				field_name="second"
				register={register}
				error={errors?.second?.message}
				default_value={cuts.jockeys[1]}
			/>
			<TextFormInput
				type="number"
				label={t("third-cut-label")}
				field_name="third"
				register={register}
				error={errors?.third?.message}
				default_value={cuts.jockeys[2]}
			/>
		</form>
	);
}

function make_schema(t: TFunction) {
	return z
		.object({
			house: z.number().min(0, t("race-cut-negative-error")),
			first: z.number().min(0, t("race-cut-negative-error")),
			second: z.number().min(0, t("race-cut-negative-error")),
			third: z.number().min(0, t("race-cut-negative-error")),
		})
		.refine((data) => data.first + data.second + data.third + data.house <= 100, {
			message: t("race-cuts-exceed-100"),
			path: ["house"],
		});
}
