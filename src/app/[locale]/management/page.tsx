import { Locale } from "@/src/lib/types";
import { generate_locale_params } from "@/src/lib/utils";
import Link from "next/link";

interface Props {
	params: {
		locale: Locale;
	};
}

export async function generateStaticParams() {
	return generate_locale_params();
}

export default async function ManagementPage({ params: { locale } }: Props) {
	<Link href="./users">Users</Link>;
}
