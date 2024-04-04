import { NextRequest, NextResponse } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { create_race } from "@/src/lib/database";
import { validate_race_form_data } from "@/src/lib/utils";
import { RaceFormData } from "@/src/lib/types";

export async function POST(request: NextRequest) {
	let res = await check_api_authorized(request);
	if (res) return res;

	let data = await request.formData();
	if (!data) {
		console.log("no form data, bad request"); // debug
		return new NextResponse(null, { status: 400 }); // bad request;
	}

	// validate & decode data
	let race_data = validate_race_form_data(data);
	if (!race_data) return new NextResponse(null, { status: 400 });
	if (!race_data.name || !race_data.contestants)
		return new NextResponse(null, { status: 400 });

	let success = await create_race(race_data as RaceFormData);
	if (success) return new NextResponse(null, { status: 200 });
	return new NextResponse(null, { status: 500 });
}

// don't allow GET to this path
export async function GET() {
	return new NextResponse(null, { status: 405 }); // method not allowed
}
