import { NextRequest, NextResponse } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { image_as_buffer } from "@/src/lib/utils";
import { create_horse } from "@/src/lib/database";

export async function POST(request: NextRequest) {
	let res = await check_api_authorized(request);
	if (res) return res;

	let form_data = await request.formData();
	if (!form_data) {
		console.log("no form data, bad request"); // debug
		return new NextResponse(null, { status: 400 }); // bad request;
	}

	let name = form_data.get("name");
	let image = form_data.get("image");
	if (!name || typeof image == "string" || typeof name != "string")
		return new NextResponse(null, { status: 400 }); // bad request

	let horse_data = {
		name,
		image: await image_as_buffer(image),
	};

	let is_successful = await create_horse(horse_data);
	if (!is_successful) return NextResponse.error();

	console.log("got new horse, success!"); // debug
	return new NextResponse(null, { status: 200 });
}

// don't allow GET to this path
export async function GET() {
	return new NextResponse(null, { status: 405 }); // method not allowed
}
