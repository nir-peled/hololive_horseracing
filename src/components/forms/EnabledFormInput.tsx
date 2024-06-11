"use client";
import React, { ReactNode, useState } from "react";
import FormInput from "./FormInput";

interface Props {
	label: string;
	checkbox_label?: string;
	error?: string;
	default_checked?: boolean | undefined;
	render: (checked: boolean) => ReactNode;
}

export default function EnabledFormInput({
	label,
	checkbox_label,
	error,
	default_checked,
	render,
}: Props) {
	if (default_checked == undefined) default_checked = true;
	const [checked, set_checked] = useState<boolean>(default_checked);

	return (
		<FormInput label={label} error={error}>
			<div className="form-control">
				<label className="label cursor-pointer">
					{checkbox_label && <span className="label-text">{checkbox_label}</span>}
					<input
						type="checkbox"
						className="checkbox"
						defaultChecked={default_checked}
						onChange={(e) => {
							set_checked(e.target.checked);
						}}
					/>
				</label>
			</div>

			{render(checked)}
		</FormInput>
	);
}
