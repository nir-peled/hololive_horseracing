"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TFunction } from "i18next";
import useSWR from "swr";
import { z } from "zod";
import {
	UserDefaultValues,
	UserEditFormData,
	UserFormData,
	UserRole,
	userRoles,
} from "@/src/lib/types";
import { json_fetcher, useSubmitter } from "@/src/lib/hooks";
import { refine_schema_for_image } from "@/src/lib/images";
import ImageFormInput from "../forms/ImageFormInput";
import TextFormInput from "../forms/TextFormInput";
import FormInput from "../forms/FormInput";
import SelectOption from "../SelectOption";
import LoadingMarker from "../LoadingMarker";
import Button from "../Button";
import Alert from "../Alert";
import { edit_user, new_user } from "@/src/lib/actions";

const namespaces = ["management"];

interface Props {
	edited_user?: string;
}

interface UserDetailsFormData {
	username: string;
	password: string;
	confirm_password: string;
	role: UserRole;
	display_name: string;
	image: FileList | null;
}

export default function UserDetailsForm({ edited_user }: Props) {
	const { t } = useTranslation(namespaces);
	const UserSchema = create_user_schema(t, !!edited_user);

	// if edit_user is given, those are the user's details.
	// otherwise, they are empty
	const { data: default_values, isLoading } = useSWR<Partial<UserDefaultValues>>(
		"/api/management/users/form_data",
		(url: string) => {
			if (edited_user)
				return json_fetcher(url + "?" + new URLSearchParams({ username: edited_user }));
			else return {};
		}
	);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isSubmitSuccessful, isSubmitting },
		reset,
	} = useForm<UserDetailsFormData>({
		resolver: zodResolver(UserSchema),
		defaultValues: default_values as Partial<UserDetailsFormData>,
	});

	const [isFailed, setIsFailed] = useState<boolean>(false);
	const endpoint = `/api/management/users/${edited_user ? "edit" : "new"}`;
	// const endpoint = edited_user ? edit_user : new_user;
	const submit_form = useSubmitter<UserDetailsFormData, UserFormData>(endpoint, {
		transform(data) {
			return {
				...data,
				image: data.image && data.image.length > 0 ? data.image[0] : null,
			};
		},
		is_failed: isFailed,
		set_is_failed: setIsFailed,
		default_values: {
			...default_values,
			role: default_values?.role as UserRole | undefined,
			image: default_values?.image as unknown as Buffer,
		},
		reset,
	});

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
				<TextFormInput
					label={t("user-display-name-label")}
					field_name="display_name"
					register={register}
					error={errors?.display_name?.message}
					default_value={default_values?.display_name}
				/>
				{/* input username & password */}
				<TextFormInput
					label={t("username-label")}
					field_name="username"
					register={register}
					error={errors?.username?.message}
					default_value={default_values?.username}
					readonly={!!default_values?.username}
				/>
				{/* <br /> */}
				<TextFormInput
					label={t("password-label")}
					field_name="password"
					type="password"
					register={register}
					error={errors?.password?.message}
				/>
				<br />
				{/* input confirm password */}
				<TextFormInput
					label={t("password-confirm-label")}
					field_name="confirm_password"
					register={register}
					type="password"
					error={errors?.confirm_password?.message}
				/>
				<br />
				<div>
					<FormInput label={t("role-label")} error={errors?.role?.message}>
						<Controller
							name="role"
							control={control}
							defaultValue={
								default_values?.role ? (default_values.role as UserRole) : undefined
							}
							render={({ field: { onChange, value, onBlur, ref, name } }) => (
								<SelectOption
									name={name}
									options={userRoles.map((role) => role)} // copy userRoles
									labels={userRoles.map((role) => t(`role-${role}`))}
									placeholder={t("role-select")}
									defaultValue={default_values?.role}
									onChange={onChange}
									value={value}
									onBlur={onBlur}
									inner_ref={ref}
								/>
							)}
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
				<Button type="submit" disabled={isSubmitting} className="m-2">
					{t("new-user-submit")}
				</Button>
			</label>
		</form>
	);
}

function create_user_schema(t: TFunction, is_edit: boolean = false) {
	let password_schema = z
		.string()
		.min(8, { message: t("password-too-short") })
		.max(31, { message: t("password-too-long") });

	let schema = z
		.object({
			display_name: z.string().min(3, { message: t("display-name-too-short") }),
			username: z
				.string()
				.min(3, { message: t("username-too-short") })
				.regex(new RegExp("[wd_]+"), t("username-illegal-characters")),
			password: is_edit ? password_schema.or(z.enum([""])) : password_schema,
			confirm_password: z.string(),
			role: z.enum(userRoles, {
				errorMap: () => ({ message: t("role-not-selected") }),
			}),
			image: z.any(),
		})
		.refine((data) => data.password == data.confirm_password, {
			message: t("password-different-from-confirm"),
			path: ["confirm_password"],
		});

	return refine_schema_for_image(schema, t);
}
