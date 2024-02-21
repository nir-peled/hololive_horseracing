import React from "react";
import { UseFormRegister } from "react-hook-form";
import FormInput from "./FormInput";

interface Props {
	label: string;
	field_name: string;
	register?: UseFormRegister<any>;
	error?: string;
	type?: "text" | "password";
	default_value?: string | undefined;
	disabled?: boolean;
}

export default function TextInput({
	label,
	field_name,
	register,
	error,
	type = "text",
	default_value,
	disabled,
}: Props) {
	const get_attrs = () =>
		register ? register(field_name) : { id: field_name, name: field_name };

	return (
		<FormInput label={label} error={error}>
			<input
				{...get_attrs()}
				type={type}
				className="input input-bordered w-full max-w-xs"
				disabled={disabled}
				defaultValue={default_value}
			/>
		</FormInput>
	);
}
