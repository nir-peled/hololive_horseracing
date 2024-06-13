import { NextResponse } from "next/server";
import { JsonValue } from "next-auth/adapters";

type Body = JsonValue | null;

export namespace HTTPResponseCodes {
	export function success(body: Body = null) {
		return response_with_status(200, body);
	}

	export function bad_request(body: Body = null) {
		return response_with_status(400, body);
	}

	export function request_unauthorized(body: Body = null) {
		return response_with_status(401, body);
	}

	export function not_found(body: Body = null) {
		return response_with_status(404, body);
	}

	export function method_forbidden(body: Body = null) {
		return response_with_status(405, body);
	}

	export function server_error(body: Body = null) {
		return response_with_status(500, body);
	}

	export function response_with_status(status: number, body: Body = null) {
		let body_raw = body != null ? JSON.stringify(body) : null;
		return new NextResponse<string | null>(body_raw, { status });
	}
}
