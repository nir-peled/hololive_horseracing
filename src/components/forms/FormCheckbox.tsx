import React from "react";
import { UseFormRegister } from "react-hook-form";

interface Props {
	label: string;
	default_value?: boolean;
	register?: UseFormRegister<any>;
	field_name?: string;
	error?: string;
	onChange?: (value: boolean) => void;
}

function FormCheckbox({
	label,
	default_value,
	register,
	field_name,
	error,
	onChange,
}: Props) {
	const get_attrs = () => {
		if (register && field_name) return register(field_name);
		return {
			id: field_name,
			name: field_name,
			onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
				onChange && onChange(e.target.checked),
		};
	};

	return (
		<div className="form-control">
			<label className="label cursor-pointer">
				<span className="label-text">{label}</span>
				<input
					type="checkbox"
					defaultChecked={default_value}
					{...get_attrs()}
					className="checkbox"
				/>
			</label>
			{error && (
				<div className="label">
					<span className="label-text text-error">{error}</span>
				</div>
			)}
		</div>
	);
}

export default FormCheckbox;
