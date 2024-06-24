import React, { ReactNode } from "react";

interface Props {
	className?: string;
	label?: string;
	error?: string;
	children: ReactNode;
}

export default function FormInput({ className, label, error, children }: Props) {
	return (
		<div>
			{label && (
				<div className="label">
					<span className="label-text">{label}</span>
				</div>
			)}
			<div className={className}>{children}</div>
			{error && (
				<div className="label">
					<span className="label-text text-error">{error}</span>
				</div>
			)}
		</div>
	);
}
