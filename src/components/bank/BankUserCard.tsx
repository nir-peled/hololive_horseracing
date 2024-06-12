"use client";
import { z } from "zod";
import { TFunction } from "i18next";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { deposit_to_user, withdraw_from_user } from "@/src/lib/actions";
import { useSubmitter } from "@/src/lib/hooks";
import { UserData } from "@/src/lib/types";
import TextFormInput from "../forms/TextFormInput";
import AmountDisplay from "../AmountDisplay";
import IconImage from "../IconImage";
import Button from "../Button";
import Alert from "../Alert";

const namespaces = ["bank"];

interface Props {
	user: UserData;
}

export default function BankUserCard({ user }: Props) {
	const { t } = useTranslation(namespaces);
	const [action, set_action] = useState<"deposit" | "withdrawal">("deposit");
	const [balance, set_balance] = useState<number>(user.balance);
	const [is_failed, set_is_failed] = useState<boolean>(false);
	const schema = create_schema(t, action, user.balance);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitted, isSubmitSuccessful, isValid },
	} = useForm<{ amount: number }>({
		resolver: zodResolver(schema),
	});

	// async function submit({ amount }: { amount: number }) {
	// 	let action_func = action == "deposit" ? deposit_to_user : withdraw_from_user;
	// 	let result = await action_func(user.name, amount);
	// }

	const submit_form = useSubmitter<{ amount: number }>(
		async ({ amount }) => {
			let action_func = action == "deposit" ? deposit_to_user : withdraw_from_user;
			return action_func(user.name, amount);
		},
		{
			is_failed,
			set_is_failed,
			on_success({ amount }) {
				if (!amount) return;
				if (action == "deposit") set_balance(balance + amount);
				else set_balance(balance - amount);
			},
		}
	);

	return (
		<div>
			{isSubmitSuccessful && (
				<Alert type="success" message={t("bank-balance-update-success")} />
			)}
			{is_failed && <Alert type="error" message={t("bank-balance-update-success")} />}
			{user.image && <IconImage icon={user.image} />}
			<h4>{user.display_name || user.name}</h4>
			<div className="stats shadow">
				<div className="stat">
					<div className="stat-title">{t("bank-user-balance")}</div>
					<div className="stat-value">
						<AmountDisplay amount={balance} />
					</div>
				</div>
			</div>
			<fieldset>
				<div>
					<input
						type="radio"
						name="action"
						value="deposit"
						checked={action == "deposit"}
						id="action_deposit"
						onChange={() => set_action("deposit")}
					/>
					<label htmlFor="action_deposit">{t("bank-action-deposit-label")}</label>
				</div>
				<div>
					<input
						type="radio"
						name="action"
						value="withdrawal"
						checked={action == "withdrawal"}
						id="action_withdrawal"
						onChange={() => set_action("withdrawal")}
					/>
					<label htmlFor="action_withdrawal">{t("bank-action-withdrawal-label")}</label>
				</div>
			</fieldset>
			<form onSubmit={handleSubmit(submit_form)}>
				<TextFormInput
					type="number"
					field_name="amount"
					register={register}
					label={t("bank-deposit-amount-label")}
					error={errors?.amount?.message}
				/>
				<Button type="submit">{t("bank-deposit-submit")}</Button>
			</form>
		</div>
	);
}

function create_schema(t: TFunction, action: "deposit" | "withdrawal", balance: number) {
	let amount = z
		.number()
		.int(t("deposit-must-be-int"))
		.min(1, t("deposit-must-be-positive"));
	return z.object({
		amount:
			action == "deposit"
				? amount
				: amount.max(balance, t("withdrawal-capped-at-balanced")),
	});
}
