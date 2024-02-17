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
				message={t("new-user-success", { ns: "management" })}
				active={isSubmitSuccessful && !isFailed}
			/>
			<Alert
				type="error"
				message={t("new-user-fail", { ns: "management" })}
				active={isFailed}
			/>
			<label className="form-control w-full max-w-lg">
				{/* input display name */}
				<TextInput
					label={t("user-display-name-label", { ns: "management" })}
					field_name="display_name"
					register={register}
					error={errors?.display_name?.message}
				/>
				{/* input username & password */}
				<FormLoginInputs register={register} errors={errors} />
				<br />
				{/* input confirm password */}
				<TextInput
					label={t("password-confirm-label", { ns: "management" })}
					field_name="confirm_password"
					register={register}
					type="password"
					error={errors?.confirm_password?.message}
				/>
				<br />
				{/* select role. perhaps moce to a component? */}
				<div>
					<FormInput
						label={t("role-label", { ns: "management" })}
						error={errors?.role?.message}>
						<select
							className="select select-bordered"
							{...register("role")}
							defaultValue="select_title">
							<option disabled value="select_title">
								{t("role-select", { ns: "management" })}
							</option>
							{userRoles.map((role, i) => (
								<option value={role} key={i}>
									{t(`role-${role}`, { ns: "management" })}
								</option>
							))}
						</select>
					</FormInput>
				</div>
				<br />
				{/* upload user avatar */}
				<FormInput label={t("user-image", { ns: "management" })}>
					<input
						type="file"
						className="file-input file-input-bordered w-full max-w-xs"
						{...register("image")}
					/>
				</FormInput>
				<Button type="submit" disabled={isValid && isSubmitted} className="m-2">
					{t("new-user-submit", { ns: "management" })}
				</Button>
			</label>
		</form>
	);
}

function create_user_schema(t: TFunction) {
	return z
		.object({
			display_name: z
				.string()
				.min(3, { message: t("display-name-too-short", { ns: "management" }) }),
			username: z
				.string()
				.min(3, { message: t("username-too-short", { ns: "management" }) }),
			password: z
				.string()
				.min(8, { message: t("password-too-short", { ns: "management" }) })
				.max(30, { message: t("password-too-long", { ns: "management" }) }),
			confirm_password: z.string(),
			role: z.enum(userRoles, {
				errorMap: () => ({ message: t("role-not-selected", { ns: "management" }) }),
			}),
			image: z.any(), // no option for file
		})
		.refine((data) => data.password == data.confirm_password, {
			message: t("password-different-from-confirm", { ns: "management" }),
			path: ["confirm_password"],
		});
}
