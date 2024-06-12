import { NextRequest } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { HTTPResponseCodes } from "@/src/lib/http";
import { UserFormData } from "@/src/lib/types";
import { new_user } from "@/src/lib/actions";

export async function POST(request: NextRequest) {
	let res = await check_api_authorized(request);
	if (res) return res;

	let data = await request.formData();
	if (!data) return HTTPResponseCodes.bad_request();

	let user_data = {
		username: data.get("username"),
		password: data.get("password"),
		role: data.get("role"),
		display_name: data.get("display_name"),
		image: data.get("image"),
	};

	// check we have all needed values
	for (let [key, value] of Object.entries(user_data))
		if (key != "image" && !value) return HTTPResponseCodes.bad_request();

	let is_successful = await new_user(user_data as UserFormData);

	if (is_successful) return HTTPResponseCodes.success();

	return HTTPResponseCodes.server_error();
}

// don't allow GET to this path
export async function GET() {
	return HTTPResponseCodes.method_forbidden();
}
