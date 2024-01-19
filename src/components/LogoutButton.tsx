"use client";

import React from "react";
import Button from "./Button";
import { logout } from "@/src/lib/actions";
import { Locale } from "@/src/lib/types";

const namespaces = ["common"];

interface Props {
	label: string;
	locale: Locale;
}

function LogoutButton({ label, locale }: Props) {
	async function submit() {
		logout(locale);
	}
	// const { t } = useTranslation(namespaces);

	return (
		<form action={submit}>
			<Button>{label}</Button>
		</form>
	);
}

export default LogoutButton;
