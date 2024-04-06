import { NextRequest, NextResponse } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { database_factory } from "@/src/lib/database";

export async function GET(request: NextRequest) {
	let res = await check_api_authorized(request);
	if (res) return res;

	const id = request.nextUrl.searchParams.get("id");
	// const select_str = request.nextUrl.searchParams.get("select");
	// let select: { [key in keyof RaceData]?: true } | undefined = undefined;
	if (!id) return new NextResponse(null, { status: 400 }); // bad request;
	// if (select_str) {
	// 	select = {};
	// 	let select_keys = select_str.split("-");
	// 	for (let key in select_keys) select[key as keyof RaceData] = true;
	// }

	const race_data = await database_factory.race_database().get_race_data(BigInt(id));

	return NextResponse.json(race_data);
}

// don't allow POST to this path
export async function POST() {
	return new NextResponse(null, { status: 405 }); // method not allowed
}
