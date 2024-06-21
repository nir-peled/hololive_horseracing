import { database_factory } from "@/src/lib/database";
import { HTTPResponseCodes } from "@/src/lib/http";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const is_with_image = searchParams.get("image") == "true";
	const from = searchParams.get("from");
	const to = searchParams.get("to");

	const results = await database_factory
		.horse_database()
		.get_horses(from ? Number(from) : undefined, to ? Number(to) : undefined);

	if (!is_with_image)
		return NextResponse.json(results.map(({ id, name }) => ({ id, name })));
	else {
		const results_with_images = Promise.all(
			results.map(async (horse) => ({
				id: horse.id,
				name: horse.name,
				image: await database_factory.horse_database().get_horse_image_as_str(horse),
			}))
		);

		return NextResponse.json(results_with_images);
	}
}

// don't allow POST to this path
export async function POST() {
	return HTTPResponseCodes.method_forbidden();
}
