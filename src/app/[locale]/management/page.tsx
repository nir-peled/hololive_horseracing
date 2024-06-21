import { generate_locale_params } from "@/src/lib/utils";
import { Locale } from "@/src/lib/types";
import ProtectedLink from "@/src/components/ProtectedLink";
import initTranslations from "@/src/lib/i18n";

interface Props {
	params: {
		locale: Locale;
	};
}

export async function generateStaticParams() {
	return generate_locale_params();
}

const namespaces = ["management"];

export default async function ManagementPage({ params: { locale } }: Props) {
	// temporary
	const { t } = await initTranslations(locale, namespaces);
	return (
		<div className="flex flex-wrap lg:grid lg:grid-cols-2 place-content-between gap-4 mt-5">
			<ProtectedLink href="/management/users" locale={locale} className="btn">
				{t("managemen-users-link")}
			</ProtectedLink>
			<ProtectedLink href="/management/races" locale={locale} className="btn">
				{t("managemen-races-link")}
			</ProtectedLink>
			<ProtectedLink href="/management/horses" locale={locale} className="btn">
				{t("managemen-horses-link")}
			</ProtectedLink>
			<ProtectedLink href="/management/settings" locale={locale} className="btn">
				{t("managemen-settings-link")}
			</ProtectedLink>
		</div>
	);
}
