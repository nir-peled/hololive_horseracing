import { NextRequest, NextResponse } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { HTTPResponseCodes } from "@/src/lib/http";
import { database_factory } from "@/src/lib/database";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
	let res = await check_api_authorized(request);
	if (res) return res;
	// add select/filter?
	const users = await database_factory.user_database().get_user_data_all();
	return NextResponse.json(
		users.map((user) => ({
			...user,
			id: Number(user.id),
		}))
	);
}

// don't allow POST to this path
export async function POST() {
	return HTTPResponseCodes.method_forbidden();
}
