import { locales } from "@/i18nConfig";
import { NextMiddleware } from "next/server";

export type Locale = (typeof locales)[number];

export interface UserData {
	id: string;
	role: "user" | "banker" | "manager";
	display_name: string;
	image: string;
}

export interface User extends UserData {
	name: string;
	password: string;
}

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;
