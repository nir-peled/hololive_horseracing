import React from "react";
import initTranslations from "@/src/lib/i18n";
import { Locale } from "@/src/lib/types";
import IconImage from "../IconImage";
import HorseDeleteButton from "./HorseDeleteButton";
import { auth, is_path_authorized } from "@/src/lib/auth";
import { get_image_buffer_as_str } from "@/src/lib/images";
import { database_factory } from "@/src/lib/database";
import TranslationsProvider from "../TranslationProvider";

interface Props {
	locale: Locale;
}

const namespaces = ["management"];

export default async function HorsesList({ locale }: Props) {
	const { t, resources } = await initTranslations(locale, namespaces);
	const horses = await database_factory.horse_database().get_horses();
	const user_role = (await auth())?.user?.role;
	const is_delete_enabled = is_path_authorized(
		"/api/management/horses/delete",
		user_role
	);

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
					<TranslationsProvider
						namespaces={namespaces}
						locale={locale}
						resources={resources}>
						{horses.map((horse) => (
							<tr key={horse.id}>
								<td>{horse.name}</td>
								<td>
									{horse.image && (
										<IconImage icon={get_image_buffer_as_str(horse.image) || ""} />
									)}
								</td>
								<td>
									<HorseDeleteButton name={horse.name} hidden={!is_delete_enabled} />
								</td>
							</tr>
						))}
					</TranslationsProvider>
				</tbody>
			</table>
		</div>
	);
}
