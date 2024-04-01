import React from "react";
import { HorseData, UserData } from "@/src/lib/types";
import { get_user_image_as_str } from "@/src/lib/images";
import IconImage from "../IconImage";

interface Props {
	user: UserData;
	horse: HorseData;
}

export default async function RaceRowRacer({ user, horse }: Props) {
	const user_image = await get_user_image_as_str(user);
	const horse_image = await get_user_image_as_str(horse);
	return (
		<>
			<div>
				<IconImage icon={user_image} size="small" />
			</div>
			<div>
				<IconImage icon={horse_image} size="small" />
			</div>
		</>
	);
}
