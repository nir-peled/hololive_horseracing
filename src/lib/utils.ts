import { locales } from "@/i18nConfig";
import { ConcatSeperator, Locale, RaceFormData } from "./types";

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

export function join_with_separator<S extends string>(separator: S) {
	return function <T extends string[]>(...strings: T): ConcatSeperator<T, S> {
		return strings.join(separator) as ConcatSeperator<T, S>;
	};
}

/** converts a datetime-local string to a Date object, using the
 * timezone in env.NEXT_PUBLIC_TIMEZONE
 *
 * @param datetime_str datetime-local string without timezone
 * @returns A Date object of the datetime_str in timezone
 * env.NEXT_PUBLIC_TIMEZONE
 */
export function datetime_local_to_date(datetime_str: string) {
	let date = new Date(datetime_str + process.env.NEXT_PUBLIC_TIMEZONE);
	return date;
}

/** Converts a Date object to a datetime-local string in the
 * timezone env.NEXT_PUBLIC_TIMEZONE
 *
 * @param date The Date object
 * @returns datetime-local string of date in timezone env.NEXT_PUBLIC_TIMEZONE
 */
export function date_to_datetime_local(date: Date) {
	const OFFSET_TO_UTC_OFFSET = 60000; // minutes to milliseconds
	let epoch_offset = new Date("01 Jan 1970 00:00:00" + process.env.NEXT_PUBLIC_TIMEZONE);

	let original_offset = date.getTimezoneOffset() * OFFSET_TO_UTC_OFFSET;

	let fixed_date = new Date(date.getTime() - original_offset + epoch_offset.getTime());
	return fixed_date.toISOString().slice(0, 16).replace("T", " ");
}

export function validate_race_form_data(
	data: FormData,
	is_edit?: boolean
): Partial<RaceFormData> | undefined {
	let name = data.get("name");
	let contestants_raw = data.get("contestants");
	let contestants = null;
	let cuts_raw = {
		house_cut: data.get("house_cut"),
		win_cut: data.get("win_cut"),
		place_cut: data.get("place_cut"),
		show_cut: data.get("show_cut"),
	};

	if (!is_edit) if (!contestants_raw || !name) return undefined;
	if (contestants_raw !== null && typeof contestants_raw != "string") return undefined;
	if (name !== null && typeof name != "string") return undefined;

	try {
		contestants = contestants_raw ? JSON.parse(contestants_raw) : undefined;
	} catch (e) {
		console.log(e); // debug
		return undefined;
	}

	let cuts = check_cuts(cuts_raw);
	if (cuts === undefined) return undefined;

	let deadline_raw = data.get("deadline");
	if (typeof deadline_raw !== "string" || deadline_raw.length == 0) return undefined;
	let deadline = deadline_raw && datetime_local_to_date(deadline_raw);

	return {
		name: name || undefined,
		deadline,
		contestants,
		...cuts,
	} as Partial<RaceFormData>;
}

export function arr_diff<T>(arr1: T[], arr2: T[]): T[] {
	return arr1.filter((new_val) =>
		arr2.find((old_val) => JSON.stringify(new_val) == JSON.stringify(old_val))
	);
}

export function to_lowercase<T extends string>(str: T): Lowercase<T> {
	return str.toLowerCase() as Lowercase<T>;
}

export function to_uppercase<T extends string>(str: T): Uppercase<T> {
	return str.toUpperCase() as Uppercase<T>;
}

// type transform_func<T, D> = (data: T) => D;

export function sum<T>(
	arr: T[],
	...transform: T extends number
		? [transform?: (data: T) => number]
		: [transform: (data: T) => number]
) {
	let trans = transform[0];
	return arr.reduce(
		(total, elem) => (trans ? total + trans(elem) : total + (elem as number)),
		0
	);
}

export function init_object<TKey extends string, TValue>(
	keys: readonly TKey[],
	value: (key: TKey) => TValue
): Record<TKey, TValue> {
	return keys.reduce((obj, key) => ({ ...obj, [key]: value(key) }), {}) as Record<
		TKey,
		TValue
	>;
}

interface form_cuts_t {
	house_cut?: FormDataEntryValue | null;
	win_cut?: FormDataEntryValue | null;
	place_cut?: FormDataEntryValue | null;
	show_cut?: FormDataEntryValue | null;
}

interface cuts_t {
	house_cut?: number;
	win_cut?: number;
	place_cut?: number;
	show_cut?: number;
}

function check_cuts(cuts: form_cuts_t): cuts_t | undefined {
	let result: cuts_t = {};
	for (let [key, value] of Object.entries(cuts)) {
		if (value instanceof File) return undefined;
		if (value === null || value === undefined) continue;

		let num = Number(value);
		if (Number.isNaN(num)) return undefined;
		result[key as keyof cuts_t] = num;
	}

	return result;
}
