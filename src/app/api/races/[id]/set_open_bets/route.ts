import { NextRequest, NextResponse } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { database_factory } from "@/src/lib/database";
import {
	bad_request,
	method_forbidden,
	request_success,
	server_error,
} from "@/src/lib/http";

interface PostParams {
	params: {
		id: string;
	};
}

export async function POST(request: NextRequest, { params: { id } }: PostParams) {
	let res = await check_api_authorized(request);
	if (res) return res;

	let raw_data = await request.json();
	if (!raw_data) return bad_request(); // bad request;
	let isOpenBets = raw_data.isOpenBets;
	if (!id || typeof isOpenBets != "boolean") return bad_request(); // bad request;

	let status = database_factory
		.race_database()
		.set_race_parameters(BigInt(id), { isOpenBets });

	if (!status) return request_success();
	return server_error();
}

// don't allow POST to this path
export async function GET() {
	return method_forbidden();
}
