import { NextRequest, NextResponse } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { HTTPResponseCodes } from "@/src/lib/http";
import { database_factory } from "@/src/lib/database";

// don't allow GET to this path
export async function POST(request: NextRequest) {
	let res = await check_api_authorized(request);
	if (res) return res;

	let count = await database_factory.race_database().close_races_bets_at_deadline();
	return NextResponse.json({ count });
}

// don't allow GET to this path
export async function GET() {
	return HTTPResponseCodes.method_forbidden();
}
