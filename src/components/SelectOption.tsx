import React from "react";
import { UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import LoadingMarker from "./LoadingMarker";

interface Props {
	register?: UseFormRegister<any>;
	name: string;
	placeholder?: string;
	options: string[];
	labels?: string[];
	onChange?: (new_option: string) => void;
	loading?: boolean;
	defaultValue?: string | null;
}

export default function SelectOption({
	register,
	name,
	placeholder,
	options,
	labels,
	onChange,
	loading,
	defaultValue,
}: Props) {
	const get_attrs = () => {
		let attrs: any = register ? register(name) : { name: name };
		// add default value if not already given by <register>
		// attrs.defaultValue ||= defaultValue ? defaultValue : "no_option";
		if (!attrs.defaultValue) attrs.defaultValue = defaultValue || "no_option";
		// for use without form hook
		const former_on_change = attrs.onChange;
		if (onChange)
			attrs.onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
				if (former_on_change) former_on_change(event);
				const new_option = event.target.value;
				if (new_option != "no_option") onChange(new_option);
			};

		return attrs;
	};

	if (loading) return <LoadingMarker />;

	return (
		<select {...get_attrs()} className="select select-bordered">
			<option disabled value="no_option">
				{placeholder}
			</option>
			{!loading &&
				options.map((value, i) => (
					<option value={value} key={i}>
						{labels ? labels[i] : value}
					</option>
				))}
		</select>
	);
}
