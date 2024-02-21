import React from "react";
import { UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import TextInput from "./TextFormInput";

const namespaces = ["auth"];

interface Props {
	register?: UseFormRegister<any>;
	errors?: {
		username?: { message?: string };
		password?: { message?: string };
	};
	username?: string | undefined;
}

export default function FomLoginInputs({ register, errors, username }: Props) {
	const { t } = useTranslation(namespaces);

	return (
		<>
			<TextInput
				label={t("username-label")}
				field_name="username"
				register={register}
				error={errors?.username?.message}
				default_value={username && ""}
				disabled={!!username}
			/>
			{/* <br /> */}
			<TextInput
				label={t("password-label")}
				field_name="password"
				type="password"
				register={register}
				error={errors?.password?.message}
			/>
		</>
	);
}
