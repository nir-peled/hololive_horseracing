import React from "react";
import { UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import TextInput from "./TextInput";

const namespaces = ["auth"];

interface Props {
	register?: UseFormRegister<any>;
	errors?: {
		username?: { message?: string };
		password?: { message?: string };
	};
}

export default function FomLoginInputs({ register, errors }: Props) {
	const { t } = useTranslation(namespaces);

	const get_attrs = (field: string) =>
		register ? register(field) : { id: field, name: field };

	return (
		<>
			<TextInput
				label={t("username-label")}
				field_name="username"
				register={register}
				error={errors?.username?.message}
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
