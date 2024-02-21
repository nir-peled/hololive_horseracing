"use client";

import React, { BaseSyntheticEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { TFunction } from "i18next";
import { z } from "zod";
import { UserRole, userRoles } from "@/src/lib/types";
import FormLoginInputs from "../forms/FormLoginInputs";
import Button from "../Button";
import Alert from "../Alert";
import TextInput from "../forms/TextFormInput";
import FormInput from "../forms/FormInput";
import SelectOption from "../SelectOption";
import useSWR from "swr";
import { json_fetcher } from "@/src/lib/hooks";

const namespaces = ["management"];

interface Props {
	edit_user?: string;
}

interface UserFormData {
	username: string;
	password: string;
	confirm_password?: string;
	role: UserRole;
	display_name: string;
	image: FileList | null;
}

export default async function UserDetailsForm({ edit_user }: Props) {
	const { t } = useTranslation(namespaces);
	const UserSchema = create_user_schema(t);

	// if edit_user is given, those are the user's details.
	// otherwise, they are empty
	const { data: default_values } = useSWR<Partial<UserFormData>>(
		"/api/users/form_data",
		(url: string) => {
			if (edit_user)
				return json_fetcher(url + "?" + new URLSearchParams({ username: edit_user }));
			else return {};
		}
	);

	// get user values every time edit_user changes
	// inelegant react way of doing things
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitted, isSubmitSuccessful, isValid },
		reset,
	} = useForm<UserFormData>({
		resolver: zodResolver(UserSchema),
		defaultValues: default_values,
	});

	const [isFailed, setIsFailed] = useState<boolean>(false);

	async function submit_form(data: UserFormData, event?: BaseSyntheticEvent) {
		if (event) event.preventDefault();
		const endpoint = `/api/users/${edit_user ? "edit" : "new"}`;

		let form_data = new FormData();
		for (let [key, value] of Object.entries(data)) {
			if (key != "image" && value)
				if (default_values && value != default_values[key as keyof UserFormData])
					form_data.append(key, value);
		}

		if (data?.image && data.image.length > 0)
			form_data.append("image", data.image.item(0) as File);

		let result = await fetch(endpoint, {
			method: "POST",
			body: form_data,
		});

		if (result.ok) {
			// if form is used for new user, reset the form to empty
			if (!edit_user) reset();
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
				<FormLoginInputs
					register={register}
					errors={errors}
					username={default_values?.username}
				/>
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
				{/* select role. perhaps move to a component? */}
				<div>
					<FormInput label={t("role-label")} error={errors?.role?.message}>
						<SelectOption
							name="role"
							register={register}
							options={userRoles.map((role) => role)} // copy userRoles
							labels={userRoles.map((role) => t(`role-${role}`))}
							placeholder={t("role-select")}
						/>
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
			role: z.enum(userRoles, {
				errorMap: () => ({ message: t("role-not-selected") }),
			}),
			image: z.any(), // no option for file
		})
		.refine((data) => data.password == data.confirm_password, {
			message: t("password-different-from-confirm"),
			path: ["confirm_password"],
		});
}
