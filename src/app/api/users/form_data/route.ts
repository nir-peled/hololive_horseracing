import { get_user_as_form_data } from "@/src/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const username = request.nextUrl.searchParams.get("username");

	if (!username) return new NextResponse(null, { status: 400 }); // bad request;

	const user_data = await get_user_as_form_data(username);

	return NextResponse.json({ ...user_data, password: "", confirm_password: "" });
}

// don't allow GET to this path
export async function POST() {
	return new NextResponse(null, { status: 405 }); // method not allowed
}
