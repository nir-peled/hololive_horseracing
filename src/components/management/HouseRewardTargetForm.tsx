"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { set_house_reward_target } from "@/src/lib/actions";
import UserSelector from "../users/UserSelector";
import Button from "../Button";

interface Props {
	target: string | null;
}

const namespaces = ["management", "common"];

export default function HouseRewardTargetForm({ target }: Props) {
	const { t } = useTranslation(namespaces);
	const [user, set_user] = useState<string | null>(target);

	async function submit() {
		let result = await set_house_reward_target(user);
		if (result) alert(t("house-reward-target-set-success"));
		else alert(t("house-reward-target-set-fail"));
	}

	return (
		<div>
			<UserSelector set_user={set_user} value={user} />
			<Button onClick={submit} className="bg-primary-content mt-3">
				{t("house-reward-target-submit", { ns: "management" })}
			</Button>
		</div>
	);
}
