import { HorseData, UserData } from "./types";
import { get_user_image } from "./database";
import { get_image_buffer_as_str } from "./utils";

export async function get_user_image_as_str(user: UserData | HorseData): Promise<string> {
	let image = user.image || (await get_user_image(user.name));
	if (!image) return default_user_image(user);

	let image_str = get_image_buffer_as_str(image);
	return image_str || default_user_image(user);
}

export function default_user_image(user: UserData | HorseData): string {
	if ("display_name" in user && user.display_name) return user.display_name.slice(0, 2);
	return user.name.slice(0, 2);
}
