"use client";
import React, { ReactNode } from "react";
import { Control, Controller, ControllerRenderProps } from "react-hook-form";
import Select, { components, OptionProps, SingleValueProps } from "react-select";
import { SelectOptionState } from "@/src/lib/types";
import FormInput from "./FormInput";
import { fields } from "@hookform/resolvers/ajv/src/__tests__/__fixtures__/data.js";
import { SingleValue } from "react-select/animated";

type option_renderer<T> = (data: T, state: SelectOptionState) => ReactNode;
type label_renderer<T> = (data: T) => ReactNode;
type with_wrapped<T, TWrapped extends boolean> = TWrapped extends true ? { value: T } : T;

interface Props<
	T,
	TControl extends Control<any, any> | undefined,
	TWrapped extends boolean = false
> {
	label?: string;
	error?: string;
	placeholder?: string;
	control?: TControl;
	name: string;
	options: T[];
	disabled_options?: T[];
	render_option?: option_renderer<T>;
	render_label?: label_renderer<T>;
	value?: TControl extends undefined ? T : never;
	onChange?: TControl extends undefined ? (new_value: T) => void : never;
	default_value?: T;
	filter?: (data: T, input: string) => boolean;
	wrapped?: TWrapped;
}

export default function SelectFormInput<
	T,
	TControl extends Control<any, any> | undefined,
	TWrapped extends boolean = false
>({
	label,
	error,
	placeholder,
	name,
	control,
	options,
	disabled_options,
	render_option,
	render_label,
	value,
	onChange,
	default_value,
	filter,
	wrapped,
}: Props<T, TControl, TWrapped>) {
	const make_select = (
		fields:
			| ControllerRenderProps<any, string>
			| { value: T | undefined; onChange: ((new_value: T) => void) | undefined }
	) => (
		<Select<with_wrapped<T, TWrapped>>
			{...fields}
			menuPortalTarget={document.body}
			components={{
				Option:
					render_option &&
					option_factory<T, TWrapped>(render_option, !!wrapped as TWrapped),
				SingleValue: render_label
					? label_factory<T, TWrapped>(render_label, !!wrapped as TWrapped)
					: SingleValue,
			}}
			options={options.map(
				(data) => add_wrapper(data, !!wrapped) as with_wrapped<T, TWrapped>
			)}
			isOptionDisabled={(option) =>
				!!disabled_options &&
				disabled_options.includes(
					remove_wrapper<T, TWrapped>(option, !!wrapped as TWrapped)
				)
			}
			placeholder={placeholder}
			defaultValue={
				default_value === undefined
					? undefined
					: (add_wrapper(default_value, !!wrapped) as with_wrapped<T, TWrapped>)
			}
			filterOption={
				filter &&
				(({ data }, input) => !input || filter(remove_wrapper(data, !!wrapped), input))
			}
			value={fields?.value && add_wrapper(fields?.value, !!wrapped)}
			onChange={
				fields.onChange &&
				((new_value) =>
					(fields.onChange as (data: T) => void)(
						remove_wrapper(new_value, !!wrapped) as T
					))
			}
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

function remove_wrapper<T, TWrapped extends boolean>(
	data: with_wrapped<T, TWrapped>,
	wrapped: TWrapped
): T {
	if (wrapped) return (data as with_wrapped<T, true>).value;
	return data as T;
}

// function add_wrapper<T>(data: T, wrapper: true): { value: T };
// function add_wrapper<T>(data: T, wrapper: false): T;
function add_wrapper<T, TWrapped extends boolean>(
	data: T,
	wrapped: TWrapped
): with_wrapped<T, TWrapped> {
	if (wrapped) return { value: data } as any;
	return data as any;
}

function option_factory<T, TWrapped extends boolean>(
	render: option_renderer<T>,
	wrapped: TWrapped
) {
	function Option(props: OptionProps<with_wrapped<T, TWrapped>>) {
		return (
			<components.Option {...props}>
				{render(remove_wrapper(props.data, wrapped), {
					isDisabled: props.isDisabled,
					isFocused: props.isFocused,
					isSelected: props.isSelected,
				})}
			</components.Option>
		);
	}

	return Option;
}

function label_factory<T, TWrapped extends boolean>(
	render: label_renderer<T>,
	wrapped: TWrapped
) {
	function Label(props: SingleValueProps<with_wrapped<T, TWrapped>>) {
		return (
			<components.SingleValue {...props}>
				{render(remove_wrapper(props.data, wrapped))}
			</components.SingleValue>
		);
	}

	return Label;
}
