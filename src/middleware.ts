import { i18nRouter } from "next-i18n-router";
import i18nConfig from "../i18nConfig";
import { NextRequest } from "next/server";
// import { NextAuthRequest } from "next-auth/src/lib";
import { auth } from "./lib/auth";

export default auth((request) => {
	return i18nRouter(request, i18nConfig);
});

/* old tries. might change again later. probably not
function i18_middleware(request: NextRequest) {
	return i18nRouter(request, i18nConfig);
}

const middlewares = [NextAuth(authConfig).auth, i18_middleware];

export function middleware(request: NextRequest) {
	NextAuth(authConfig).auth
	return i18nRouter(request, i18nConfig);
}
*/

// applies this middleware only to files in the app directory
export const config = {
	matcher: "/((?!api|static|.*\\..*|_next|favicon.ico).*)",
};
