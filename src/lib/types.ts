import { locales } from "@/i18nConfig";
import { NextMiddleware } from "next/server";

export type Locale = (typeof locales)[number];

export const userRoles = ["user", "banker", "manager"] as const;
export type UserRole = (typeof userRoles)[number];

export interface UserFormData {
	username: string;
	password: string;
	confirm_password?: string;
	role: UserRole;
	display_name: string;
	image?: File;
}

export interface UserData {
	name: string;
	role: UserRole;
	display_name: string;
	image?: Buffer;
	balance: Number;
	dept: Number;
}

export interface UserDefaultValues {
	username: string;
	role: string;
	display_name: string;
	image?: Buffer | null;
}

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;
