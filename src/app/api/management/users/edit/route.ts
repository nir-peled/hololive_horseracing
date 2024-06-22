import { NextRequest, NextResponse } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { database_factory } from "@/src/lib/database";
import { HTTPResponseCodes } from "@/src/lib/http";
import { UserFormData } from "@/src/lib/types";

export async function POST(request: NextRequest) {
	// return HTTPResponseCodes.method_forbidden();
	// /*
	console.log("got POST /api/management/users/new"); // debug
	let res = await check_api_authorized(request);
	if (res) return res;

	let data = await request.formData();
	if (!data) {
		console.log("no form data, bad request"); // debug
		return HTTPResponseCodes.bad_request();
	}

	let username = data.get("username");
	if (!username || typeof username != "string" || username == "")
		return HTTPResponseCodes.bad_request();

	let user_data = {
		password: data.get("password"),
		role: data.get("role"),
		display_name: data.get("display_name"),
		image: data.get("image"),
	};
	for (let [key, value] of Object.entries(user_data)) {
		console.log(`key: ${key}. value:`); // debug
		console.log(value); // debug
		if (key != "image" && value instanceof File) return HTTPResponseCodes.bad_request();
		if (key == "image" && !(value instanceof File || value === null))
			return HTTPResponseCodes.bad_request();
	}

	console.log("try creating new user"); // debug
	let is_successful = await database_factory
		.user_database()
		.edit_user(username, user_data as Partial<UserFormData>);

	if (is_successful) {
		console.log("got new user, success!"); // debug
		return HTTPResponseCodes.success();
	}
	console.log("could not create new user, failure"); // debug
	return NextResponse.error();
	// */
}

// don't allow GET to this path
export async function GET() {
	return HTTPResponseCodes.method_forbidden();
}
