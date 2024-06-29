import { NextRequest } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { validate_race_form_data } from "@/src/lib/utils";
import { RaceFormData } from "@/src/lib/types";
import { database_factory } from "@/src/lib/database";
import { HTTPResponseCodes } from "@/src/lib/http";
import { bet_manager } from "@/src/lib/bet_manager";

export async function POST(request: NextRequest) {
	let res = await check_api_authorized(request);
	if (res) return res;

	let data = await request.formData();
	if (!data) return HTTPResponseCodes.bad_request();

	// validate & decode data
	let race_data = validate_race_form_data(data);
	if (!race_data) return HTTPResponseCodes.bad_request();
	if (!race_data.name || !race_data.contestants) return HTTPResponseCodes.bad_request();

	let race_id = await database_factory
		.race_database()
		.create_race(race_data as RaceFormData);
	if (race_id === null) return HTTPResponseCodes.server_error();

	await bet_manager.update_race_odds(race_id);
	return HTTPResponseCodes.success();
}

// don't allow GET to this path
export async function GET() {
	return HTTPResponseCodes.method_forbidden();
}
