"use client";
import React, { ReactNode } from "react";

interface Props {
	type?: "submit" | "reset" | "button" | undefined;
	className?: string;
	children?: ReactNode;
	disabled?: boolean;
	onClick?: () => void;
}

function Button({ type, className, children, disabled, onClick }: Props) {
	return (
		<button
			className={`btn ${className}`}
			type={type}
			disabled={disabled}
			onClick={onClick}>
			{children}
		</button>
	);
}

export default Button;
