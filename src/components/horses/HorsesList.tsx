import React from "react";
import initTranslations from "@/src/lib/i18n";
import { Locale } from "@/src/lib/types";
import { get_horses } from "@/src/lib/database";
import IconImage from "../IconImage";
import HorseDeleteButton from "./HorseDeleteButton";
import { auth, is_path_authorized } from "@/src/lib/auth";
import { get_image_buffer_as_str } from "@/src/lib/utils";

interface Props {
	locale: Locale;
}

const namespaces = ["races"];

export default async function HorsesList({ locale }: Props) {
	const { t } = await initTranslations(locale, namespaces);
	const horses = await get_horses();
	const user_role = (await auth())?.user?.role;
	const is_with_delete = is_path_authorized("/api/management/horses/delete", user_role);

	if (horses.length == 0) return <h3>{t("horses-table-empty")}</h3>;

	return (
		<div className="overflow-x-auto">
			<table className="table">
				<thead>
					<tr>
						<th>{t("horses-list-header-name")}</th>
						<th>{t("horses-list-header-image")}</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{horses.map((horse) => (
						<tr key={horse.id}>
							<td>{horse.name}</td>
							<td>
								{horse.image && (
									<IconImage icon={get_image_buffer_as_str(horse.image) || ""} />
								)}
							</td>
							<td>
								<HorseDeleteButton name={horse.name} hidden={!is_with_delete} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
