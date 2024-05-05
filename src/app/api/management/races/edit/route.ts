import { NextRequest } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { validate_race_form_data } from "@/src/lib/utils";
import { database_factory } from "@/src/lib/database";
import { HTTPResponseCodes } from "@/src/lib/http";

export async function POST(request: NextRequest) {
	// return new NextResponse(null, { status: 405 }); // method not allowed
	let res = await check_api_authorized(request);
	if (res) return res;

	const id_raw = request.nextUrl.searchParams.get("id");
	if (!id_raw) return HTTPResponseCodes.bad_request();
	let id: bigint;
	try {
		id = BigInt(id_raw);
	} catch (e) {
		return HTTPResponseCodes.bad_request();
	}

	let data = await request.formData();
	if (!data) {
		console.log("no form data, bad request"); // debug
		return HTTPResponseCodes.bad_request();
	}

	let race_data = validate_race_form_data(data);
	if (!race_data) return HTTPResponseCodes.bad_request();

	let success = await database_factory.race_database().try_edit_race(id, race_data);
	if (success) return HTTPResponseCodes.success();
	return HTTPResponseCodes.server_error();
}

// don't allow GET to this path
export async function GET() {
	return HTTPResponseCodes.method_forbidden();
}
