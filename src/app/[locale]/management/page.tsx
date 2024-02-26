import { generate_locale_params } from "@/src/lib/utils";
import { Locale } from "@/src/lib/types";
import Button from "@/src/components/Button";
import ProtectedLink from "@/src/components/ProtectedLink";

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
				<ProtectedLink href={`${locale}/management/users`}>Users</ProtectedLink>
			</Button>
		</main>
	);
}
