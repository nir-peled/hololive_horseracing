import React, { ReactNode, useContext } from "react";
import { UseFormRegister } from "react-hook-form";
import FormInput from "./FormInput";

const possible_value_types = ["text", "password", "datetime-local", "number"] as const;
type value_t = (typeof possible_value_types)[number];

interface Props<T extends value_t> {
	label: string;
	field_name: string;
	register?: UseFormRegister<any>;
	error?: string;
	type?: T;
	default_value?: (T extends "number" ? number : string) | undefined;
	readonly?: boolean;
	disabled?: boolean;
	step?: string;
	className?: string;
	// clear?: () => void;
	marker_before?: ReactNode;
	marker_after?: ReactNode;
}

export default function TextFormInput<T extends value_t = "text">({
	label,
	field_name,
	register,
	error,
	type,
	default_value,
	readonly,
	disabled,
	step,
	className,
	marker_before,
	marker_after,
}: Props<T>) {
	// const context_disabled = !useContext(EnableInputContext);

	const get_attrs = () =>
		register
			? register(field_name, { valueAsNumber: type == "number" })
			: { id: field_name, name: field_name };

	// if (register) console.log(`register as ${field_name}`); // debug

	return (
		<FormInput label={label} error={error}>
			{marker_before}
			<input
				{...get_attrs()}
				type={type || "text"}
				className={`input input-bordered w-full max-w-xs ${className}`}
				readOnly={readonly}
				// disabled={disabled || context_disabled}
				disabled={disabled}
				defaultValue={default_value}
				step={step}
			/>
			{marker_after}
		</FormInput>
	);
}
