import { NextRequest, NextResponse } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { validate_race_form_data } from "@/src/lib/utils";
import { database_factory } from "@/src/lib/database";

export async function POST(request: NextRequest) {
	// return new NextResponse(null, { status: 405 }); // method not allowed
	let res = await check_api_authorized(request);
	if (res) return res;

	const id_raw = request.nextUrl.searchParams.get("id");
	if (!id_raw) return new NextResponse(null, { status: 400 }); // bad request;
	let id: bigint;
	try {
		id = BigInt(id_raw);
	} catch (e) {
		return new NextResponse(null, { status: 400 }); // bad request;
	}

	let data = await request.formData();
	if (!data) {
		console.log("no form data, bad request"); // debug
		return new NextResponse(null, { status: 400 }); // bad request;
	}

	let race_data = validate_race_form_data(data);
	if (!race_data) return new NextResponse(null, { status: 400 });

	let success = await database_factory.race_database().try_edit_race(id, race_data);
	if (success) return new NextResponse(null, { status: 200 });
	return new NextResponse(null, { status: 500 });
}

// don't allow GET to this path
export async function GET() {
	return new NextResponse(null, { status: 405 }); // method not allowed
}
