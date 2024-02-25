// import { fileTypeFromBuffer } from "file-type";
import { locales } from "@/i18nConfig";
import { pbkdf2Sync, randomBytes } from "crypto";
import { Locale, UserData } from "./types";
import isSvg from "is-svg";
import { get_user_image } from "./database";

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

export async function get_user_image_as_str(user: UserData): Promise<string> {
	let image = await get_user_image(user.name);
	if (!image) return user.display_name.slice(0, 2);

	let image_str = get_image_buffer_as_str(image);
	return image_str || user.display_name.slice(0, 2);
}

export function get_image_buffer_as_str(image: Buffer): string | undefined {
	let mime_type = file_mime_from_buffer(image);
	if (!mime_type) return;
	return `data:${mime_type};base64,${image.toString("base64")}`;
}

function file_mime_from_buffer(input: Buffer): string | undefined {
	if (!input) return;
	if (input.length <= 1) return;

	// could possibly do that faster, but too much effort
	if (check_buffer_start(input, [0xff, 0xd8, 0xff])) return "image/jpeg";
	if (check_buffer_start(input, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
		return check_png_type(input); // 'image/png' or 'image/apng'
	if (isSvg(input.toString())) return "image/svg+xml";
	if (check_buffer_start(input, [0x0b, 0x77])) return "image/bmp";
	if (
		// -1 is ignored
		check_buffer_start(input, [-1, -1, -1, -1, -1, -1, -1, -1, 0x57, 0x45, 0x42, 0x50])
	)
		return "image/webp";
	if (check_buffer_start(input, [0x47, 0x49, 0x46])) return "image/gif";
	if (check_buffer_start(input, [0x49, 0x49, 0xbc])) return "image/vnd.ms-photo";
	if (check_buffer_start(input, [0xff, 0xd8, 0xff, 0xf7])) return "image/jls";
	if (check_buffer_start(input, [0x46, 0x4c, 0x49, 0x46])) return "image/flif";
	if (check_buffer_start(input, [0x38, 0x42, 0x50, 0x53]))
		return "image/vnd.adobe.photoshop";
}

function check_buffer_start(buffer: Buffer, signature: number[]): boolean {
	if (buffer.length < signature.length) return false;

	for (let i = 0; i < signature.length; ++i) {
		if (signature[i] > 0 && buffer[i] != signature[i]) return false;
	}

	return true;
}

function check_png_type(buffer: Buffer): "image/png" | "image/apng" | undefined {
	let i = 8; // ignore first 8
	while (i + 8 < buffer.length) {
		let length = buffer.subarray(i, i + 4);
		let type = new TextDecoder().decode(buffer.subarray(i + 4, i + 8));
		if (type == "IDAT") return "image/png";
		if (type == "acTL") return "image/apng";

		// skip the length of the chunk & CRC
		i += Buffer.from(length).readInt32BE(0) + 4;
	}
}
