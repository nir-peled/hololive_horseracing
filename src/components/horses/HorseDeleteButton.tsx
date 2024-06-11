"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { useTranslation } from "react-i18next";
import Button from "../Button";

interface Props {
	name: string;
	on_delete?: (name: string) => void;
	on_error?: (error: string) => void;
	hidden?: boolean | undefined;
}

const namespaces = ["management"];

export default function HorseDeleteButton({ name, on_delete, on_error, hidden }: Props) {
	const { t } = useTranslation(namespaces);
	const { pending } = useFormStatus();

	if (hidden) return;

	async function send_delete() {
		if (!confirm(t("horse-delete-confirm", { name }))) return;
		const response = await fetch("/api/management/horses/delete", {
			method: "POST",
			body: JSON.stringify({ name }),
		});

		if (response.ok && on_delete) return on_delete(name);
		if (on_error) {
			response
				.json()
				.then((data) => on_error(data.message))
				.catch(() => on_error("horse-delete-error"));
		}
	}

	return (
		<form action={send_delete}>
			<Button disabled={pending}>{t("horse-delete-button")}</Button>
		</form>
	);
}
