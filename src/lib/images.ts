import { TFunction } from "i18next";
import isSvg from "is-svg";
import { z } from "zod";
import { HorseData, UserData } from "./types";

export function default_user_image(user: UserData | HorseData): string {
	if ("display_name" in user && user.display_name) return user.display_name.slice(0, 2);
	return user.name.slice(0, 2);
} // using NEXT_PUBLIC_ so the variables will also be available in
// a browser environment - replaced with values at build time
// for more flexible usage, should use database

export function get_file_limitations() {
	const max_file_size = process.env.NEXT_PUBLIC_MAX_USER_ICON_SIZE;
	const allowed_files_str = process.env.NEXT_PUBLIC_USER_ICON_TYPES;
	const allowed_files = allowed_files_str && allowed_files_str.split(",");

	return { max_file_size, allowed_files };
}

export function refine_schema_for_image<
	SchemaType extends z.ZodType<Record<FieldName, FileList>>,
	FieldName extends string = "image"
>(schema: SchemaType, t: TFunction, field_name?: FieldName) {
	if (!field_name) field_name = "image" as FieldName;
	const { max_file_size, allowed_files } = get_file_limitations();

	return schema
		.refine(
			(data) => {
				if (!max_file_size || !data[field_name]) return true;
				let files = data[field_name];
				return files.length == 0 || files[0].size <= Number(max_file_size);
			},
			{
				message: t("image-too-large", {
					max_file_size,
				}),
				path: [field_name],
			}
		)
		.refine(
			(data) => {
				let files = data[field_name];
				return (
					!allowed_files || files.length == 0 || allowed_files.includes(files[0].type)
				);
			},
			{ message: t("image-type-not-allowed"), path: [field_name] }
		);
}

export function get_image_buffer_as_str(image: Buffer): string | undefined {
	let mime_type = file_mime_from_buffer(image);
	if (!mime_type) return;
	return `data:${mime_type};base64,${image.toString("base64")}`;
}

// using this instead of a package because the package doesn't fit
// a browser environment
function file_mime_from_buffer(input: Buffer): string | undefined {
	if (!input) return;
	if (input.length <= 1) return;

	// could possibly do that faster, but too much effort
	if (check_buffer_start(input, [255, 216, 255])) return "image/jpeg";
	if (check_buffer_start(input, [137, 80, 78, 71, 13, 10, 26, 10])) {
		let type = check_png_type(input);
		if (type) return type;
	}
	if (isSvg(input.toString())) return "image/svg+xml";
	if (check_buffer_start(input, [11, 119])) return "image/bmp";
	// empty cells are ignored
	if (check_buffer_start(input, [, , , , , , , , 87, 69, 66, 80])) return "image/webp";
	if (check_buffer_start(input, [71, 73, 70])) return "image/gif";
	if (check_buffer_start(input, [73, 73, 188])) return "image/vnd.ms-photo";
	if (check_buffer_start(input, [255, 216, 255, 247])) return "image/jls";
	if (check_buffer_start(input, [70, 76, 73, 70])) return "image/flif";
	if (check_buffer_start(input, [56, 66, 80, 83])) return "image/vnd.adobe.photoshop";
	// can add more, but probably no reason to
}

function check_buffer_start(buffer: Buffer, signature: (number | undefined)[]): boolean {
	if (buffer.length < signature.length) return false;

	for (let i = 0; i < signature.length; ++i) {
		if (signature[i] && buffer[i] != signature[i]) return false;
	}

	return true;
}

function check_png_type(buffer: Buffer): "image/png" | "image/apng" | undefined {
	let i = 8; // ignore first 8

	// check buffer by chunks. return type according to chunk start, if found
	while (i + 8 < buffer.length) {
		let length = buffer.subarray(i, i + 4);
		let type = new TextDecoder().decode(buffer.subarray(i + 4, i + 8));
		if (type == "IDAT") return "image/png";
		if (type == "acTL") return "image/apng";

		// skip the length of the chunk & CRC
		i += Buffer.from(length).readInt32BE(0) + 4;
	}
}

export async function image_as_buffer(
	image: File | Blob | null | undefined
): Promise<Buffer | null> {
	if (!image) return null;

	let array_buffer = await image.arrayBuffer();
	return Buffer.from(array_buffer);
}
