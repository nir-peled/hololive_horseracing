"use client";
import React, { BaseSyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { refine_schema_for_image } from "@/src/lib/images";
import Alert from "../Alert";
import ImageFormInput from "../forms/ImageFormInput";
import TextFormInput from "../forms/TextFormInput";
import Button from "../Button";

const namespaces = ["management"];

interface HorseFormData {
	name: string;
	image: FileList | null;
}

export default function NewHorseForm() {
	const { t } = useTranslation(namespaces);
	const schema = get_horse_schema(t);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitted, isSubmitSuccessful, isValid },
		reset,
	} = useForm<HorseFormData>({
		resolver: zodResolver(schema),
	});

	const [isFailed, setIsFailed] = useState<boolean>(false);

	async function submit_form(data: HorseFormData, event?: BaseSyntheticEvent) {
		console.log("try submit new horse"); // debug
		if (event) event.preventDefault();

		let form_data = new FormData();
		form_data.append("name", data.name);
		if (data.image && data.image.length > 0) form_data.append("image", data.image[0]);

		let result = await fetch("/api/management/horses/new", {
			method: "POST",
			body: form_data,
		});

		if (result.ok) {
			reset();
			if (isFailed) setIsFailed(false);
		} else setIsFailed(true);
	}

	// console.log("new horse form"); // debug
	return (
		<form onSubmit={handleSubmit(submit_form)} id="new_horse_form">
			<Alert
				type="success"
				message={t("new-horse-success")}
				active={isSubmitSuccessful && !isFailed}
			/>
			<Alert type="error" message={t("new-horse-fail")} active={isFailed} />
			<label className="form-control w-full max-w-lg">
				<TextFormInput
					label={t("horse-name-label")}
					field_name="name"
					register={register}
					error={errors?.name?.message}
				/>
				<br />
				<ImageFormInput
					label={t("horse-image")}
					field_name="image"
					register={register}
					error={errors?.image?.message}
					preview={true}
				/>
				<Button type="submit" disabled={isValid && isSubmitted} className="m-2">
					{t("new-horse-submit")}
				</Button>
			</label>
		</form>
	);
}

function get_horse_schema(t: TFunction) {
	let schema = z.object({
		name: z.string().min(2, { message: t("horse-name-too-short") }),
		image: z.instanceof(FileList),
	});

	return refine_schema_for_image(schema, t);
}
