"use client";
import React, { ReactNode } from "react";

interface Props {
	type?: "submit" | "reset" | "button" | undefined;
	className?: string;
	children?: ReactNode;
	disabled?: boolean;
	onClick?: () => void | Promise<void>;
}

function Button({ type, className, children, disabled, onClick }: Props) {
	function on_click(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		if (onClick) {
			e.preventDefault();
			onClick();
		}
	}
	return (
		<button
			className={`btn ${className ? className : ""}`}
			type={type}
			disabled={disabled}
			onClick={on_click}>
			{children}
		</button>
	);
}

export default Button;
