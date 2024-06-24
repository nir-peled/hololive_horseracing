"use client";
import React, { useMemo, useRef } from "react";
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
	inner_ref?: RefCallBack;
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
	inner_ref,
}: Props) {
	const using_options = useMemo(
		() => options.map((value, i) => ({ value, label: labels[i] })),
		[options]
	);

	if (loading) return <LoadingMarker />;

	// const using_options = ;

	return (
		<div onClick={(e) => e.preventDefault()}>
			<Select
				name={name}
				menuPortalTarget={document.body}
				styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
				// className="select select-bordered"
				options={using_options}
				defaultValue={using_options.find((op) => op.value === defaultValue)}
				isSearchable={filter}
				isClearable={true}
				filterOption={(option, input) => option.label.includes(input)}
				isOptionDisabled={(option) =>
					!!disabled_options && disabled_options.includes(option.value)
				}
				placeholder={placeholder}
				value={
					typeof value == "string" ? using_options.find((op) => op.value == value) : null
				}
				onChange={(option) => onChange && onChange(option ? option.value : null)}
				onBlur={onBlur}
				ref={inner_ref}
			/>
		</div>
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
