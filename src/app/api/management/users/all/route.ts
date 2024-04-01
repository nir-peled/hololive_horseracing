import { fetch_usernames } from "@/src/lib/actions";
import { check_api_authorized } from "@/src/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	let res = await check_api_authorized(request);
	if (res) return res;
	// add select/filter?
	const usernames = await fetch_usernames();
	return NextResponse.json(usernames);
}

// don't allow POST to this path
export async function POST() {
	return new NextResponse(null, { status: 405 }); // method not allowed
}
