import { NextResponse } from "next/server";
import { NextAuthConfig, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { locales } from "@/i18nConfig";
import { UserRole } from "@/src/lib/types";
import { is_path_authorized } from "@/src/lib/auth";
import { get_locale_from_path } from "@/src/lib/i18n";
import { database_factory } from "@/src/lib/database";

export const authConfig: NextAuthConfig = {
	callbacks: {
		async authorized({ auth, request: { nextUrl } }) {
			const user = auth?.user;
			const is_logged_in = !!user;
			const is_on_login = nextUrl.pathname.endsWith("/login");
			let locale = get_locale_from_path(nextUrl.pathname);
			let user_role: UserRole | undefined;
			const page = locale ? nextUrl.pathname.replace(`/${locale}`, "") : nextUrl.pathname;
			// console.log(`\n\nnext URL: ${nextUrl.pathname}`); // debug
			// console.log(`is logged in: ${is_logged_in}`); // debug
			// console.log(`is on login: ${is_on_login}`); // debug
			// console.log(`page: ${page}`); // debug
			if (user) {
				// console.log("user:");
				// console.log(user.name);
				user_role = user.role;
			}

			// default locale in not included, to avoid double redirect
			if (!locale) locale = locales[0];

			// if logged in, can't log in
			if (is_logged_in && is_on_login)
				return NextResponse.redirect(new URL(`/${locale}/`, nextUrl));
			// if not logged in, go to login
			if (!is_logged_in && !is_on_login)
				return NextResponse.redirect(new URL(`/${locale}/login`, nextUrl));
			// check user is authorized to go to this page
			// if not logged in, already handled
			if (is_logged_in && !is_path_authorized(page, user_role))
				return NextResponse.redirect(new URL(`/${locale}/`, nextUrl), { status: 401 });

			// console.log("all OK, go on"); // debug
			return true;
		},

		// add user data to token & to session
		async jwt({ token, user }) {
			// if (!user) user = token;
			let username = user ? user.name : token.name;
			if (!username) return token; // should never happen
			let user_data = await database_factory
				.user_database()
				.get_user_data({ user: username, to_token: true });
			if (user_data && "image" in Object.keys(user_data)) delete user_data.image;

			return {
				...token,
				user_data,
			};
		},

		// add user data to session from token, plus user image
		async session(params: any) {
			let { session, token } = params;
			session.user = { ...token.user_data };
			return session;
		},
	},
	providers: [
		CredentialsProvider({
			// check if credentials are authorized. return user or null
			async authorize(credentials, request): Promise<User | null> {
				if (!credentials?.username || !credentials?.password) {
					// console.log(`no username or password`); // debug
					return null;
				}

				let { username, password } = credentials as {
					username: string;
					password: string;
				};

				let is_password = await database_factory
					.user_database()
					.is_user_password(username, password);
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
