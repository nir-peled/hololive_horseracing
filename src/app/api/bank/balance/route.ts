import { database_factory } from "@/src/lib/database";
import { HTTPResponseCodes } from "@/src/lib/http";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const user = searchParams.get("user");

	if (user == undefined) return HTTPResponseCodes.bad_request();
	try {
		const user_id = BigInt(user);
		const result = await database_factory.user_database().get_user_balance(user_id);
		if (result == null) return HTTPResponseCodes.not_found();

		return HTTPResponseCodes.success(result);
	} catch (e) {
		console.log(e); // debug
		return HTTPResponseCodes.bad_request();
	}
}

// don't allow POST to this path
export async function POST() {
	return HTTPResponseCodes.method_forbidden();
}
