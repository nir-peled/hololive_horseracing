import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { UserRole } from "./types";
import { UrlObject } from "url";
import { HTTPResponseCodes } from "./http";

export const { auth, signIn, signOut } = NextAuth(authConfig);

export function is_path_authorized(
	url: string | UrlObject,
	role: UserRole | undefined,
	apikey?: string | null
): boolean {
	let path: string;
	if (typeof url == "string") path = url;
	else if (url.pathname) path = url.pathname;
	else return false;

	if (!role) return false;
	if (path.startsWith("/api")) path = path.replace("/api", "");

	if (path == "/login") return role == undefined;
	if (path.startsWith("/jobs")) return apikey == process.env.JOBS_API_KEY;
	if (path.startsWith("/management")) return check_role_authorized("manager", role);
	if (path.startsWith("/bank")) return check_role_authorized("banker", role);
	return check_role_authorized("user", role);
}

export async function check_api_authorized(
	request: NextRequest
): Promise<NextResponse | undefined> {
	const user = (await auth())?.user;
	const apikey = request.headers.get("API-Key");
	if (!is_path_authorized(request.nextUrl.pathname, user?.role, apikey))
		return HTTPResponseCodes.request_unauthorized();
}

function check_role_authorized(
	required_role: UserRole | undefined,
	user_role: UserRole | undefined
): boolean {
	if (!required_role) return true;
	if (!user_role) return !required_role;

	switch (required_role) {
		case "manager":
			return user_role == "manager";
		case "banker":
			return ["banker", "manager"].includes(user_role);
		case "user":
			return ["user", "banker", "manager"].includes(user_role);
		default: // just in case
			return false;
	}
}

export async function check_server_action_authorized(
	required_role?: UserRole | undefined
): Promise<void> {
	let user_role = (await auth())?.user?.role;
	let is_allowed = check_role_authorized(required_role, user_role);
	if (!is_allowed) throw new Error("unauthorized");
}
