import React from "react";
import { UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
		let attrs: any = register ? register(name) : { id: name, name: name };
		// add default value if not already given by <register>
		attrs.defaultValue ||= defaultValue ? defaultValue : "no_option";
		// for use without form hook
		if (onChange && !register)
			attrs.onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
				const new_option = event.target.value;
				if (new_option != "no_option") onChange(new_option);
			};

		return attrs;
	};

	return (
		<select {...get_attrs()} className="select select-bordered">
			<option disabled value="no_option">
				{placeholder}
			</option>
			{loading && (
				<option disabled value="">
					<span className="loading loading-spinner loading-sm"></span>
				</option>
			)}
			{!loading &&
				options.map((value, i) => (
					<option value={value} key={i}>
						{labels ? labels[i] : value}
					</option>
				))}
		</select>
	);
}
