import { NextRequest, NextResponse } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { database_factory } from "@/src/lib/database";
import { bet_manager } from "@/src/lib/bet_manager";
import { HTTPResponseCodes } from "@/src/lib/http";

export async function POST(request: NextRequest) {
	let res = await check_api_authorized(request);
	if (res) return res;

	let races = await database_factory.race_database().close_races_bets_at_deadline();
	await bet_manager.close_races_bets(races);
	return NextResponse.json({ count: races.length });
}

// don't allow GET to this path
export async function GET() {
	return HTTPResponseCodes.method_forbidden();
}
