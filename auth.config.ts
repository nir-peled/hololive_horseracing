import { NextAuthConfig, User } from "next-auth";
import { NextResponse } from "next/server";
import CredentialsProvider from "next-auth/providers/credentials";
import { get_user_data, is_user_password } from "@/src/lib/database";
import { UserData } from "@/src/lib/types";
import { get_locale_from_path } from "@/src/lib/i18n";
import { locales } from "./i18nConfig";

export const authConfig: NextAuthConfig = {
	callbacks: {
		// to add: restricting path by user role
		authorized({ auth, request: { nextUrl } }) {
			const user = auth?.user as UserData | undefined;
			const is_logged_in = !!user;
			const is_on_login = nextUrl.pathname.endsWith("/login");
			let locale = get_locale_from_path(nextUrl.pathname);
			console.log(`\n\nnext URL: ${nextUrl.pathname}`); // debug
			console.log(`is logged in: ${is_logged_in}`); // debug
			console.log(`is on login: ${is_on_login}`); // debug
			if (user) {
				console.log("user:");
				console.log(user);
			}

			if (!locale) locale = locales[0];

			// if logged in, can't log in
			if (is_logged_in && is_on_login)
				return NextResponse.redirect(new URL(`/${locale}/`, nextUrl));
			// if not logged in, go to login
			if (!is_logged_in && !is_on_login)
				return NextResponse.redirect(new URL(`/${locale}/login`, nextUrl));

			// console.log("all OK, go on"); // debug
			return true;
		},

		// add user data to token & to session
		async jwt({ token, user }) {
			// console.log("\n\ncallback jwt"); // debug
			// console.log("token:"); // debug
			// console.log(token); // debug
			// console.log(`user:`); // debug
			// console.log(user); // debug
			if (!user) user = token;
			// console.log("jwt get_user_data:"); // debug
			// console.log(user); // debug
			return { ...token, user_data: await get_user_data({ user }) };
		},
		session(params: any) {
			// cannot let me extract token otherwise for some reason
			// console.log("\n\ncallback session"); // debug
			let { session, token } = params;
			// console.log("token:"); // debug
			// console.log(token); // debug
			// console.log("session:"); // debug
			// console.log(session); // debug
			session.user = { name: token.name, ...token.user_data };
			// console.log("session after:"); // debug
			// console.log(session); // debug
			return session;
		},
	},
	providers: [
		CredentialsProvider({
			async authorize(credentials, request): Promise<User | null> {
				if (!credentials?.username || !credentials?.password) {
					console.log(`no username or password`); // debug
					return null;
				}

				let { username, password } = credentials as {
					username: string;
					password: string;
				};
				console.log(`username: ${username}`); // debug
				console.log(`password: ${password}`); // debug

				let is_password = await is_user_password(username, password);
				console.log(`is user password: ${is_password}`); // debug

				if (!is_password) return null;

				return {
					name: username,
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
	trustHost: true,
};
