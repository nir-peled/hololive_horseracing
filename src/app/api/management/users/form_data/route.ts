import { check_api_authorized } from "@/src/lib/auth";
import { database_factory } from "@/src/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	let res = await check_api_authorized(request);
	if (res) return res;

	const username = request.nextUrl.searchParams.get("username");

	if (!username) return new NextResponse(null, { status: 400 }); // bad request;

	const user_data = await database_factory
		.user_database()
		.get_user_as_form_data(username);

	return NextResponse.json(user_data);
}

// don't allow POST to this path
export async function POST() {
	return new NextResponse(null, { status: 405 }); // method not allowed
}
