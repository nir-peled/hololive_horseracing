"use client";
import React, { ReactNode } from "react";
import { Control, Controller } from "react-hook-form";
import Select, { components, OptionProps } from "react-select";
import FormInput from "./FormInput";

interface OptionState {
	isDisabled: boolean;
	isFocused: boolean;
	isSelected: boolean;
}

type renderer<T> = (data: T, state: OptionState) => ReactNode;

interface Props<T> {
	label?: string;
	error?: string;
	control: Control<any, any>;
	name: string;
	options: T[];
	disabled_options: T[];
	render_option?: renderer<T>;
}

export default function SelectFormInput<T>({
	label,
	error,
	name,
	control,
	options,
	disabled_options,
	render_option,
}: Props<T>) {
	return (
		<FormInput label={label} error={error}>
			<Controller
				name={name}
				control={control}
				render={({ field: { onChange, onBlur, value, name, ref, disabled } }) => (
					<Select
						name={name}
						ref={ref}
						onBlur={onBlur}
						isDisabled={disabled}
						onChange={onChange}
						value={value}
						components={render_option && { Option: option_factory<T>(render_option) }}
						options={options}
						isOptionDisabled={(option) => disabled_options.includes(option)}
					/>
				)}
			/>
		</FormInput>
	);
}

function option_factory<T>(render: renderer<T>) {
	function Option(props: OptionProps<T>) {
		return (
			<components.Option {...props}>
				{render(props.data, {
					isDisabled: props.isDisabled,
					isFocused: props.isFocused,
					isSelected: props.isSelected,
				})}
			</components.Option>
		);
	}

	return Option;
}
