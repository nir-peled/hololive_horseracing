import { locales } from "@/i18nConfig";
import { pbkdf2Sync, randomBytes } from "crypto";
import { Locale } from "./types";

export async function hash_password(
	password: string,
	salt: string | undefined = undefined
): Promise<string> {
	if (!salt) salt = randomBytes(Number(process.env.SALT_BYTES)).toString("hex");
	let hash = pbkdf2Sync(
		password,
		salt,
		Number(process.env.HASH_ROUNDS),
		Number(process.env.HASH_KEYLEN),
		process.env.HASH_METHOD as string
	).toString(`hex`);

	return `${salt}#${hash}`;
}

export async function compare_passwords(
	password: string,
	hash: string
): Promise<boolean> {
	let [salt] = hash.split("#");

	let hashed_new_pass = await hash_password(password, salt);
	return hashed_new_pass == hash;
}

export async function image_as_buffer(
	image: File | Blob | null | undefined
): Promise<Buffer | null> {
	if (!image) return null;

	let array_buffer = await image.arrayBuffer();
	return Buffer.from(array_buffer);
}

export async function generate_locale_params() {
	return locales.map((locale: Locale) => ({
		locale,
	}));
}

export function users_filtered_by_display_name<
	PartialUser extends { display_name: string }
>(users: PartialUser[], filter: string): PartialUser[] {
	filter = filter.toLowerCase();
	return users.filter((user) => user.display_name.toLowerCase().includes(filter));
}
