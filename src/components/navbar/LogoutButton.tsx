"use client";
import React from "react";
import Button from "../Button";
import { logout } from "@/src/lib/actions";
import { Locale } from "@/src/lib/types";

interface Props {
	label: string;
	locale: Locale;
}

export default function LogoutButton({ label, locale }: Props) {
	async function submit() {
		logout(locale);
	}

	return (
		<form action={submit}>
			<Button>{label}</Button>
		</form>
	);
}
