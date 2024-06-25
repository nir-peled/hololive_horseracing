import { NextRequest } from "next/server";
import { validate_race_form_data } from "@/src/lib/utils";
import { check_api_authorized } from "@/src/lib/auth";
import { database_factory } from "@/src/lib/database";
import { HTTPResponseCodes } from "@/src/lib/http";
import { bet_manager } from "@/src/lib/bet_manager";

export async function POST(request: NextRequest) {
	// return new NextResponse(null, { status: 405 }); // method not allowed
	let res = await check_api_authorized(request);
	if (res) return res;

	const id_raw = request.nextUrl.searchParams.get("id");
	if (!id_raw) return HTTPResponseCodes.bad_request({ message: "no id" });
	let id: bigint;
	try {
		id = BigInt(id_raw);
	} catch (e) {
		return HTTPResponseCodes.bad_request({ message: "id not number" });
	}

	let data = await request.formData();
	if (!data) return HTTPResponseCodes.bad_request({ message: "no form data" });
	console.log(data);

	let race_data = validate_race_form_data(data, true);
	if (!race_data)
		return HTTPResponseCodes.bad_request({ message: "form data incorrect" });

	let success = await database_factory.race_database().try_edit_race(id, race_data);
	if (!success) return HTTPResponseCodes.server_error();

	await bet_manager.update_race_odds(id);
	return HTTPResponseCodes.success();
}

// don't allow GET to this path
export async function GET() {
	return HTTPResponseCodes.method_forbidden();
}
