import { check_api_authorized } from "@/src/lib/auth";
import { try_delete_horse } from "@/src/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	let res = await check_api_authorized(request);
	if (res) return res;

	let form_data = await request.formData();
	if (!form_data) {
		console.log("no form data, bad request"); // debug
		return new NextResponse(null, { status: 400 }); // bad request;
	}

	let name = form_data.get("name");
	if (!name || typeof name !== "string") {
		console.log("no form data, bad request"); // debug
		return new NextResponse(null, { status: 400 }); // bad request;
	}

	let is_successful = await try_delete_horse(name);
	if (!is_successful) return NextResponse.error();

	console.log("got new horse, success!"); // debug
	return new NextResponse(null, { status: 200 });
}

// don't allow GET to this path
export async function GET() {
	return new NextResponse(null, { status: 405 }); // method not allowed
}
