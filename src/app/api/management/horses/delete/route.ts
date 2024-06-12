import { NextRequest, NextResponse } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { database_factory } from "@/src/lib/database";
import { HTTPResponseCodes } from "@/src/lib/http";

export async function POST(request: NextRequest) {
	let res = await check_api_authorized(request);
	if (res) return res;

	let form_data = await request.formData();
	if (!form_data) return HTTPResponseCodes.bad_request();

	let name = form_data.get("name");
	if (!name || typeof name !== "string") return HTTPResponseCodes.bad_request();

	let is_successful = await database_factory.horse_database().try_delete_horse(name);
	if (!is_successful) return NextResponse.error();

	return HTTPResponseCodes.success();
}

// don't allow GET to this path
export async function GET() {
	return HTTPResponseCodes.method_forbidden();
}
