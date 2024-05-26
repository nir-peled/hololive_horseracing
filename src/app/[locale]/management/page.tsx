import { generate_locale_params } from "@/src/lib/utils";
import { Locale } from "@/src/lib/types";
import Button from "@/src/components/Button";
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
	const { t, resources } = await initTranslations(locale, namespaces);
	return (
		<>
			<Button>
				<ProtectedLink href="/management/users" locale={locale}>
					{t("managemen-users-link")}
				</ProtectedLink>
			</Button>
			<Button>
				<ProtectedLink href="/management/races" locale={locale}>
					{t("managemen-races-link")}
				</ProtectedLink>
			</Button>
			<Button>
				<ProtectedLink href="/management/horses" locale={locale}>
					{t("managemen-horses-link")}
				</ProtectedLink>
			</Button>
		</>
	);
}
