"use client";

import React, { BaseSyntheticEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import FormLoginInputs from "./FormLoginInputs";
import Button from "./Button";
import { UserRole, userRoles } from "@/src/lib/types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "./Alert";
import TextInput from "./TextInput";
import { new_user } from "@/src/lib/actions";
import { TFunction } from "i18next";
import FormInput from "./FormInput";

const namespaces = ["auth"];

interface Props {
	locale: string;
}

interface UserFormData {
	username: string;
	password: string;
	confirm_password?: string;
	role: UserRole;
	display_name: string;
	image?: FileList | null;
}

export default function NewUserForm({ locale }: Props) {
	const { t } = useTranslation(namespaces);
	const UserSchema = create_user_schema(t);

	// type UserFormData = z.infer<typeof UserSchema>;

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitted, isSubmitSuccessful, isValid },
		reset,
	} = useForm<UserFormData>({
		resolver: zodResolver(UserSchema),
	});

	const [isFailed, setIsFailed] = useState<boolean>(false);

	async function submit_form(data: UserFormData, event?: BaseSyntheticEvent) {
		if (event) event.preventDefault();

		console.log(`typeof image is: ${typeof data.image}`); // debug

		let form_data = new FormData();
		for (let [key, value] of Object.entries(data)) {
			if (key != "image" && value) form_data.append(key, value);
		}

		if (data?.image && data.image.length > 0)
			form_data.append("image", data.image.item(0) as File);

		let result = await fetch("/api/users/new", {
			method: "POST",
			body: form_data,
		});
		if (result.ok) {
			reset();
			if (isFailed) setIsFailed(false);
		} else {
			reset(data);
			setIsFailed(true);
		}
	}

	return (
		<form onSubmit={handleSubmit(submit_form)} id="new_user_form">
			<Alert
				type="success"
				message={t("new-user-success")}
				active={isSubmitSuccessful && !isFailed}
			/>
			<Alert type="error" message={t("new-user-fail")} active={isFailed} />
			<label className="form-control w-full max-w-lg">
				{/* input display name */}
				<TextInput
					label={t("user-display-name-label")}
					field_name="display_name"
					register={register}
					error={errors?.display_name?.message}
				/>
				{/* input username & password */}
				<FormLoginInputs register={register} errors={errors} />
				<br />
				{/* input confirm password */}
				<TextInput
					label={t("password-confirm-label")}
					field_name="confirm_password"
					register={register}
					type="password"
					error={errors?.confirm_password?.message}
				/>
				<br />
				{/* select role. perhaps moce to a component? */}
				<div>
					<FormInput label={t("role-label")} error={errors?.role?.message}>
						<select
							className="select select-bordered"
							{...register("role")}
							defaultValue="select_title">
							<option disabled value="select_title">
								{t("role-select")}
							</option>
							{userRoles.map((role, i) => (
								<option value={role} key={i}>
									{t(`role-${role}`)}
								</option>
							))}
						</select>
					</FormInput>
				</div>
				<br />
				{/* upload user avatar */}
				<FormInput label={t("user-image")}>
					<input
						type="file"
						className="file-input file-input-bordered w-full max-w-xs"
						{...register("image")}
					/>
				</FormInput>
				<Button type="submit" disabled={isValid && isSubmitted} className="m-2">
					{t("new-user-submit")}
				</Button>
			</label>
		</form>
	);
}

function create_user_schema(t: TFunction) {
	return z
		.object({
			display_name: z.string().min(3, { message: t("display-name-too-short") }),
			username: z.string().min(3, { message: t("username-too-short") }),
			password: z
				.string()
				.min(8, { message: t("password-too-short") })
				.max(30, { message: t("password-too-long") }),
			confirm_password: z.string(),
			role: z.enum(userRoles, { errorMap: () => ({ message: t("role-not-selected") }) }),
			image: z.any(), // no option for file
		})
		.refine((data) => data.password == data.confirm_password, {
			message: t("password-different-from-confirm"),
			path: ["confirm_password"],
		});
}
