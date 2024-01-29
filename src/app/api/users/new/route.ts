import { new_user } from "@/src/lib/actions";
import { UserFormData, UserRole } from "@/src/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	console.log("got POST /api/users/new"); // debug
	let data = await request.formData();
	if (!data) {
		console.log("no form data, bad request"); // debug
		return new NextResponse(null, { status: 400 }); // bad request;
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
		if (key != "image" && !value) return new NextResponse(null, { status: 400 }); // bad request

	console.log("try creating new user"); // debug
	let is_successful = await new_user(user_data as UserFormData);

	if (is_successful) {
		console.log("got new user, success!"); // debug
		return new NextResponse(null, { status: 200 });
	}
	console.log("could not create new user, failure"); // debug
	return NextResponse.error();
}

// don't allow GET to this path
export async function GET() {
	return new NextResponse(null, { status: 405 }); // method not allowed
}
