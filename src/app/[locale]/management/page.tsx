import Link from "next/link";
import { generate_locale_params } from "@/src/lib/utils";
import { Locale } from "@/src/lib/types";
import Button from "@/src/components/Button";

interface Props {
	params: {
		locale: Locale;
	};
}

export async function generateStaticParams() {
	return generate_locale_params();
}

export default async function ManagementPage({ params: { locale } }: Props) {
	// temporary
	return (
		<main className="flex min-h-screen flex-col items-center p-24 w-fit self-center">
			<Button>
				<Link href={`${locale}/management/users`}>Users</Link>
			</Button>
		</main>
	);
}
