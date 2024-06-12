import { NextRequest, NextResponse } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { validate_race_form_data } from "@/src/lib/utils";
import { RaceFormData } from "@/src/lib/types";
import { database_factory } from "@/src/lib/database";
import { HTTPResponseCodes } from "@/src/lib/http";

export async function POST(request: NextRequest) {
	let res = await check_api_authorized(request);
	if (res) return res;

	let data = await request.formData();
	if (!data) return HTTPResponseCodes.bad_request();

	// validate & decode data
	let race_data = validate_race_form_data(data);
	if (!race_data) return HTTPResponseCodes.bad_request();
	if (!race_data.name || !race_data.contestants) return HTTPResponseCodes.bad_request();

	let success = await database_factory
		.race_database()
		.create_race(race_data as RaceFormData);
	if (success) return HTTPResponseCodes.success();
	return HTTPResponseCodes.server_error();
}

// don't allow GET to this path
export async function GET() {
	return HTTPResponseCodes.method_forbidden();
}
