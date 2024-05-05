import { NextRequest, NextResponse } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { database_factory } from "@/src/lib/database";
import { HTTPResponseCodes } from "@/src/lib/http";
// import { RaceData } from "@/src/lib/types";

interface PostParams {
	params: {
		id: string;
	};
}

export async function GET(request: NextRequest, { params: { id } }: PostParams) {
	let res = await check_api_authorized(request);
	if (res) return res;

	if (!id) return HTTPResponseCodes.bad_request();
	// ignore select for now
	// const select_str = request.nextUrl.searchParams.get("select");
	// let select: { [key in keyof RaceData]?: true } | undefined = undefined;
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
	return HTTPResponseCodes.method_forbidden();
}
