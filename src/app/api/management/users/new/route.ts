import { NextRequest, NextResponse } from "next/server";
import { new_user } from "@/src/lib/actions";
import { check_api_authorized } from "@/src/lib/auth";
import { UserFormData } from "@/src/lib/types";
import { HTTPResponseCodes } from "@/src/lib/http";

export async function POST(request: NextRequest) {
	console.log("got POST /api/management/users/new"); // debug
	let res = await check_api_authorized(request);
	if (res) return res;

	let data = await request.formData();
	if (!data) {
		console.log("no form data, bad request"); // debug
		return HTTPResponseCodes.bad_request();
	}

	let user_data = {
		username: data.get("username"),
		password: data.get("password"),
		role: data.get("role"),
		display_name: data.get("display_name"),
		image: data.get("image"),
	};
	console.log("user data:"); // debug
	console.log(user_data);
	// check we have all needed values
	for (let [key, value] of Object.entries(user_data))
		if (key != "image" && !value) return HTTPResponseCodes.bad_request();

	console.log("try creating new user"); // debug
	let is_successful = await new_user(user_data as UserFormData);

	if (is_successful) {
		console.log("got new user, success!"); // debug
		return HTTPResponseCodes.request_success();
	}
	console.log("could not create new user, failure"); // debug
	return HTTPResponseCodes.server_error();
}

// don't allow GET to this path
export async function GET() {
	return HTTPResponseCodes.method_forbidden();
}
