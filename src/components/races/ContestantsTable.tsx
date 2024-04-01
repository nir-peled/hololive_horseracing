"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { ContestantFromType } from "@/src/lib/types";
import { fetch_user_data, fetch_horse_image } from "@/src/lib/actions";
import { get_image_buffer_as_str } from "@/src/lib/utils";
import IconImage from "../IconImage";
import Button from "../Button";

interface Props {
	contestants: (ContestantFromType & { id: string })[];
	remove_contestant: (index: number) => void;
}

const namespaces = ["races", "management"];

/** TODO: change images to large once I manage to implement it
 *
 */
export default function ContestantsTable({ contestants, remove_contestant }: Props) {
	const { t } = useTranslation(namespaces);

	return (
		<div className="overflow-x-auto">
			<table className="table table-zebra">
				<thead>
					<tr>
						<th>{t("jockey-title", { ns: "races" })}</th>
						<th>{t("horse-title", { ns: "races" })}</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{contestants.map(async ({ id, jockey, horse }, i) => {
						// for ech of jockey, horse: display name, and image only if exists
						let jockey_data = await fetch_user_data(jockey);
						let jockey_image =
							jockey_data?.image && get_image_buffer_as_str(jockey_data.image);
						let horse_data = { name: horse, image: await fetch_horse_image(horse) };
						let horse_image =
							horse_data.image && get_image_buffer_as_str(horse_data.image);

						return (
							<tr key={id}>
								<td>
									{jockey_image && <IconImage icon={jockey_image} />}
									<div className="font-bold">{jockey_data?.display_name}</div>
								</td>
								<td>
									{horse_image && <IconImage icon={horse_image} />}
									<div className="font-bold">{horse}</div>
								</td>
								<td>
									<Button className="btn-primary" onClick={() => remove_contestant(i)}>
										{t("race-remove-contestant", { ns: "management" })}
									</Button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
