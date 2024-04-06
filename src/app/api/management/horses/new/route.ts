import { NextRequest, NextResponse } from "next/server";
import { bad_request, request_success } from "@/src/lib/http";
import { check_api_authorized } from "@/src/lib/auth";
import { database_factory } from "@/src/lib/database";
import { image_as_buffer } from "@/src/lib/images";

export async function POST(request: NextRequest) {
	let res = await check_api_authorized(request);
	if (res) return res;

	let form_data = await request.formData();
	if (!form_data) {
		console.log("no form data, bad request"); // debug
		return bad_request();
	}

	let name = form_data.get("name");
	let image = form_data.get("image");
	if (!name || typeof image == "string" || typeof name != "string") return bad_request();

	let horse_data = {
		name,
		image: await image_as_buffer(image),
	};

	let is_successful = await database_factory.horse_database().create_horse(horse_data);
	if (!is_successful) return NextResponse.error();

	console.log("got new horse, success!"); // debug
	return request_success();
}

// don't allow GET to this path
export async function GET() {
	return new NextResponse(null, { status: 405 }); // method not allowed
}
