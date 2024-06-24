"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetch_horse_image, fetch_user_data } from "@/src/lib/actions";
import { UserData } from "@/src/lib/types";
import LoadingMarker from "../LoadingMarker";
import IconImage from "../IconImage";
import Button from "../Button";

const namespaces = ["management"];

interface Props {
	jockey: string;
	horse: string;
	remove: () => void;
}

export default function RaceContestantRow({ jockey, horse, remove }: Props) {
	const { t } = useTranslation(namespaces);
	const [user_data, set_user_data] = useState<UserData | null>(null);
	const [horse_image, set_horse_image] = useState<string | null | undefined>(null);
	useEffect(() => {
		fetch_user_data(jockey).then((result) => set_user_data(result));
		fetch_horse_image(horse).then((image) => set_horse_image(image));
	}, [jockey, horse]);

	if (user_data === null || horse_image == null)
		return (
			<tr>
				<LoadingMarker />
			</tr>
		);

	return (
		<tr>
			<td>
				{user_data && user_data.image && <IconImage icon={user_data.image} />}
				<div className="font-bold">{user_data?.display_name}</div>
			</td>
			<td>
				{horse_image && <IconImage icon={horse_image} />}
				<div className="font-bold">{horse}</div>
			</td>
			<td>
				<Button className="btn-primary" onClick={remove}>
					{t("race-remove-contestant")}
				</Button>
			</td>
		</tr>
	);
}
