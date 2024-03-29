"use client";

import React, { BaseSyntheticEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { TFunction } from "i18next";
import { z } from "zod";
import useSWR from "swr";
import { UserDefaultValues, UserRole, userRoles } from "@/src/lib/types";
import { json_fetcher } from "@/src/lib/hooks";
import FormLoginInputs from "../forms/FormLoginInputs";
import Button from "../Button";
import Alert from "../Alert";
import TextInput from "../forms/TextFormInput";
import FormInput from "../forms/FormInput";
import SelectOption from "../SelectOption";
import LoadingMarker from "../LoadingMarker";
import ImageFormInput from "../forms/ImageFormInput";

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

export default function UserDetailsForm({ edit_user }: Props) {
	const { t } = useTranslation(namespaces);
	const UserSchema = create_user_schema(t);

	console.log(`edit user = ${edit_user}`); // debug

	// if edit_user is given, those are the user's details.
	// otherwise, they are empty
	const { data: default_values, isLoading } = useSWR<Partial<UserDefaultValues>>(
		"/api/management/users/form_data",
		(url: string) => {
			if (edit_user)
				return json_fetcher(url + "?" + new URLSearchParams({ username: edit_user }));
			else return {};
		}
	);

	console.log("default values = "); // debug
	console.log(default_values); // debug

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
		const endpoint = `/api/management/users/${edit_user ? "edit" : "new"}`;

		let form_data = new FormData();
		for (let [key, value] of Object.entries(data)) {
			if (key != "image" && value)
				if (default_values && value != default_values[key as keyof UserDefaultValues])
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

	if (isLoading) return <LoadingMarker />;

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
					default_value={default_values?.display_name}
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
				<div>
					<FormInput label={t("role-label")} error={errors?.role?.message}>
						<SelectOption
							name="role"
							register={register}
							options={userRoles.map((role) => role)} // copy userRoles
							labels={userRoles.map((role) => t(`role-${role}`))}
							placeholder={t("role-select")}
							defaultValue={default_values?.role}
						/>
					</FormInput>
				</div>
				<br />
				{/* upload user avatar */}
				<ImageFormInput
					label={t("user-image")}
					field_name="image"
					register={register}
					preview={true}
					default_display={default_values?.image}
				/>
				<Button type="submit" disabled={isValid && isSubmitted} className="m-2">
					{t("new-user-submit")}
				</Button>
			</label>
		</form>
	);
}

function create_user_schema(t: TFunction) {
	const max_file_size = process.env.NEXT_PUBLIC_MAX_USER_ICON_SIZE;
	const allowed_files_str = process.env.NEXT_PUBLIC_USER_ICON_TYPES;
	const allowed_files = allowed_files_str && allowed_files_str.split(",");

	return z
		.object({
			display_name: z.string().min(3, { message: t("display-name-too-short") }),
			username: z.string().min(3, { message: t("username-too-short") }),
			password: z
				.string()
				.min(8, { message: t("password-too-short") })
				.max(31, { message: t("password-too-long") }),
			confirm_password: z.string(),
			role: z.enum(userRoles, {
				errorMap: () => ({ message: t("role-not-selected") }),
			}),
			image: z.any(), // no option for file
		})
		.refine((data) => data.password == data.confirm_password, {
			message: t("password-different-from-confirm"),
			path: ["confirm_password"],
		})
		.refine(
			(data) => {
				if (!max_file_size || !data.image) return true;
				let files: FileList = data.image;
				return files.length == 0 || files[0].size <= Number(max_file_size);
			},
			{
				message: t("image-too-large", {
					max_file_size,
				}),
				path: ["image"],
			}
		)
		.refine(
			(data) => {
				let files: FileList = data.image;
				return (
					!allowed_files || files.length == 0 || allowed_files.includes(files[0].type)
				);
			},
			{ message: t("image-type-not-allowed"), path: ["image"] }
		);
}
