"use client";
import React, {
	Children,
	ReactNode,
	// createContext,
	isValidElement,
	useState,
} from "react";
import FormInput from "./FormInput";

// export const EnableInputContext = createContext<boolean>(true);

interface Props {
	label: string;
	error?: string;
	default_enabled?: boolean;
	render: (enabled: boolean) => ReactNode;
}

export default function EnabledFormInput({
	label,
	error,
	default_enabled = true,
	render,
}: Props) {
	const [enabled, set_enabled] = useState<boolean>(default_enabled);

	return (
		<FormInput label={label} error={error}>
			<input
				type="checkbox"
				className="checkbox"
				defaultChecked={default_enabled}
				onChange={(e) => {
					set_enabled(e.target.checked);
					// onCheck(e.target.checked);
					// Children.forEach(
					// 	children,
					// 	(child) => isValidElement(child) && child.props.reset && child.props.reset()
					// );
				}}
			/>
			{/* <EnableInputContext.Provider value={enabled}>
				{children}
			</EnableInputContext.Provider> */}
			{render(enabled)}
		</FormInput>
	);
}
