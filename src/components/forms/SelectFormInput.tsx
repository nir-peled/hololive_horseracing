"use client";
import React, { ReactNode } from "react";
import { Control, Controller } from "react-hook-form";
import Select, { components, OptionProps } from "react-select";
import { SelectOptionState } from "@/src/lib/types";
import FormInput from "./FormInput";

type renderer<T> = (data: T, state: SelectOptionState) => ReactNode;

interface Props<T, TControl extends Control<any, any> | undefined> {
	label?: string;
	error?: string;
	placeholder?: string;
	control?: TControl;
	name: string;
	options: T[];
	disabled_options?: T[];
	render_option?: renderer<T>;
	value?: TControl extends undefined ? T : never;
	onChange?: TControl extends undefined ? (new_value: T) => void : never;
	default_value?: T;
}

export default function SelectFormInput<
	T,
	TControl extends Control<any, any> | undefined
>({
	label,
	error,
	placeholder,
	name,
	control,
	options,
	disabled_options,
	render_option,
	value,
	onChange,
	default_value,
}: Props<T, TControl>) {
	const make_select = (fields?: Record<string, any>) => (
		<Select
			{...fields}
			menuPortalTarget={document.body}
			components={render_option && { Option: option_factory<T>(render_option) }}
			options={options}
			isOptionDisabled={(option) =>
				!!disabled_options && disabled_options.includes(option)
			}
			placeholder={placeholder}
			defaultValue={default_value}
		/>
	);

	if (!control) return make_select({ value, onChange });

	return (
		<FormInput label={label} error={error}>
			<Controller
				name={name}
				control={control}
				render={({ field }) => make_select(field)}
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
