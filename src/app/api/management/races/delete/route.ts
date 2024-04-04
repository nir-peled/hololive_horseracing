import { NextRequest, NextResponse } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { try_delete_race } from "@/src/lib/database";

export async function POST(request: NextRequest) {
	return new NextResponse(null, { status: 405 }); // method not allowed
	// let res = await check_api_authorized(request);
	// if (res) return res;

	// const id = request.nextUrl.searchParams.get("id");
	// if (!id) return new NextResponse(null, { status: 400 }); // bad request;

	// const success = await try_delete_race(BigInt(id));
	// if (success) return new NextResponse(null, { status: 200 });
	// return new NextResponse(null, { status: 500 }); // server error
}

// don't allow GET to this path
export async function GET() {
	return new NextResponse(null, { status: 405 }); // method not allowed
}
