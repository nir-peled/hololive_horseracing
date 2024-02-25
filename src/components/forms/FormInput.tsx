import React, { ReactNode } from "react";

interface Props {
	label: string;
	error?: string;
	children: ReactNode;
}

export default function FormInput({ label, error, children }: Props) {
	return (
		<div>
			<div className="label">
				<span className="label-text">{label}</span>
			</div>
			{children}
			{error && (
				<div className="label">
					<span className="label-text text-error">{error}</span>
				</div>
			)}
		</div>
	);
}
