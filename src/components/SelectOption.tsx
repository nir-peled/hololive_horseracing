"use client";
import React from "react";
import Select from "react-select";
import { RefCallBack } from "react-hook-form";
import LoadingMarker from "./LoadingMarker";

interface Props {
	name?: string;
	value?: string | null;
	placeholder?: string;
	options: string[];
	labels: string[];
	disabled_options?: string[];
	onChange?: (new_option: string | null) => void;
	loading?: boolean;
	defaultValue?: string | null;
	filter?: boolean;
	onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
	ref?: RefCallBack;
}

type value_t = { value: string; label: string };

export default function SelectOption({
	name,
	value,
	placeholder,
	options,
	labels,
	disabled_options,
	onChange,
	loading,
	defaultValue,
	filter,
	onBlur,
	ref,
}: Props) {
	if (loading) return <LoadingMarker />;

	let using_options = options.map((value, i) => ({ value, label: labels[i] }));

	return (
		<Select<value_t, false>
			name={name}
			menuPortalTarget={document.body}
			styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
			// className="select select-bordered"
			options={using_options}
			defaultValue={
				typeof defaultValue == "string"
					? using_options.find((op) => op.value === defaultValue)
					: defaultValue
			}
			isSearchable={filter}
			isClearable={true}
			filterOption={(option, input) => option.label.includes(input)}
			isOptionDisabled={(option) =>
				!!disabled_options && disabled_options.includes(option.value)
			}
			placeholder={placeholder}
			value={
				typeof value == "string" ? using_options.find((op) => op.value == value) : value
			}
			onChange={(option) => onChange && onChange(option ? option.value : null)}
			onBlur={onBlur}
			ref={ref}
		/>
	);
	// <select {...get_attrs()} className="select select-bordered">
	// 	<option disabled value="no_option">
	// 		{placeholder}
	// 	</option>
	// 	{!loading &&
	// 		options.map((value, i) => (
	// 			<option value={value} key={i}>
	// 				{labels ? labels[i] : value}
	// 			</option>
	// 		))}
	// </select>;
}
