import { fetch_usernames } from "@/src/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	// add select/filter?
	const usernames = await fetch_usernames();
	return NextResponse.json(usernames);
}

// don't allow GET to this path
export async function POST() {
	return new NextResponse(null, { status: 405 }); // method not allowed
}
