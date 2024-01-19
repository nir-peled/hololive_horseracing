import React from "react";

interface Props {
	type?: "info" | "success" | "warning" | "error";
	active?: boolean;
	message?: string;
}

function Alert({ type, active, message }: Props) {
	if (!active) return null;

	let alert_type = type ? `alert-${type}` : "";

	return (
		<div role="alert" className={`alert ${alert_type}`}>
			<span>{message}</span>
		</div>
	);
}

export default Alert;
