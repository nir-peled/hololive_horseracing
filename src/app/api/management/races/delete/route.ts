import { NextRequest, NextResponse } from "next/server";
import { check_api_authorized } from "@/src/lib/auth";
import { HTTPResponseCodes } from "@/src/lib/http";

export async function POST(request: NextRequest) {
	return HTTPResponseCodes.method_forbidden();
	// let res = await check_api_authorized(request);
	// if (res) return res;

	// const id = request.nextUrl.searchParams.get("id");
	// if (!id) return bad_request();

	// const success = await try_delete_race(BigInt(id));
	// if (success) return new NextResponse(null, { status: 200 });
	// return new NextResponse(null, { status: 500 }); // server error
}

// don't allow GET to this path
export async function GET() {
	return HTTPResponseCodes.method_forbidden();
}
