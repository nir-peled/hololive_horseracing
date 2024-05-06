"use client";
import React, { ReactNode, useState } from "react";
import FormInput from "./FormInput";

interface Props {
	label: string;
	error?: string;
	default_enabled?: boolean | undefined;
	render: (enabled: boolean) => ReactNode;
}

export default function EnabledFormInput({
	label,
	error,
	default_enabled,
	render,
}: Props) {
	if (default_enabled == undefined) default_enabled = true;
	const [enabled, set_enabled] = useState<boolean>(default_enabled);

	return (
		<FormInput label={label} error={error}>
			<input
				type="checkbox"
				className="checkbox"
				defaultChecked={default_enabled}
				onChange={(e) => {
					set_enabled(e.target.checked);
				}}
			/>
			{render(enabled)}
		</FormInput>
	);
}
