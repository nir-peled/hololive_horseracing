import { check_api_authorized } from "@/src/lib/auth";
import { database_factory } from "@/src/lib/database";
import { bad_request, method_forbidden } from "@/src/lib/http";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	let res = await check_api_authorized(request);
	if (res) return res;

	const username = request.nextUrl.searchParams.get("username");

	if (!username) return bad_request();

	const user_data = await database_factory
		.user_database()
		.get_user_as_form_data(username);

	return NextResponse.json(user_data);
}

// don't allow POST to this path
export async function POST() {
	return method_forbidden();
}
