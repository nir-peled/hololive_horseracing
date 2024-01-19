import { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import CredentialsProvider from "next-auth/providers/credentials";
// import { get_locale_from_path } from "@/src/lib/i18n";

export const authConfig: NextAuthConfig = {
	callbacks: {
		// to add: restricting path by user role
		authorized({ auth, request: { nextUrl } }) {
			const is_logged_in = !!auth?.user;
			const is_on_login = nextUrl.pathname.endsWith("/login");
			// const locale = get_locale_from_path(nextUrl.pathname); // don't think it's needed
			// console.log(`\n\nnext URL: ${nextUrl.pathname}`); // debug
			// console.log(`is logged in: ${is_logged_in}`); // debug
			// console.log(`is on login: ${is_on_login}`); // debug
			// console.log(`locale: .${locale}.`);
			// if (auth?.user) {
			// 	console.log("user:");
			// 	console.log(auth.user);
			// }

			// if logged in, can't log in
			if (is_logged_in && is_on_login)
				return NextResponse.redirect(new URL(`/`, nextUrl));
			// if not logged in, go to login
			if (!is_logged_in && !is_on_login)
				return NextResponse.redirect(new URL(`/login`, nextUrl));

			// console.log("all OK, go on"); // debug
			return true;
			// return false;
		},
	},
	providers: [
		CredentialsProvider({
			async authorize(credentials, request) {
				if (!credentials?.username || !credentials?.password) {
					// console.log(`no username or password`); // debug
					return null;
				}

				let { username, password } = credentials;
				// console.log(`username: ${username}`); // debug
				// console.log(`password: ${password}`); // debug

				// for testing
				return {
					id: "1",
					name: "nir",
				};
			},
		}),
	],
	session: {
		maxAge: Number(process.env.SESSION_TTL),
	},
	events: {
		// signOut(message) {
		// 	console.log("signing out"); // debug
		// 	console.log("message:"); // debug
		// 	console.log(message); // debug
		// },
	},
};
