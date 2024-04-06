import { NextResponse } from "next/server";

export function request_success() {
	return response_status(200);
}

export function bad_request() {
	return response_status(400);
}

export function request_unauthorized() {
	return response_status(401);
}

export function method_forbidden() {
	return response_status(405);
}

export function server_error() {
	return response_status(500);
}

export function response_status(status: number) {
	return new NextResponse(null, { status });
}
