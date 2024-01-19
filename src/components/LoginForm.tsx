"use client";

import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "../lib/actions";
import { useTranslation } from "react-i18next";
import Alert from "./Alert";
import Button from "./Button";

const namespaces = ["auth"];

interface Props {
	locale: string;
}

export default function LoginForm({ locale }: Props) {
	async function login(prevState: string | undefined, form_data: FormData) {
		form_data.append("redirectTo", `/${locale}`);
		return await authenticate(prevState, form_data);
	}
	const [error_message, dispatch] = useFormState(login, undefined);
	const { pending } = useFormStatus();
	const { t } = useTranslation(namespaces);

	return (
		<form action={dispatch} id="login_form">
			<label className="form-control w-full max-w-lg">
				<Alert type="error" active={!!error_message} message={t("login-failed")} />
				<div>
					<div className="label">
						<span className="label-text">{t("username-label")}</span>
					</div>
					<input
						type="text"
						id="username"
						name="username"
						className="input input-bordered w-full max-w-xs"
					/>
				</div>
				<br />
				<div>
					<div className="label">
						<span className="label-text">{t("password-label")}</span>
					</div>
					<input
						type="password"
						id="password"
						name="password"
						className="input input-bordered w-full max-w-xs"
					/>
				</div>
				<Button type="submit" disabled={pending}>
					{t("login-submit")}
				</Button>
			</label>
		</form>
	);
}
