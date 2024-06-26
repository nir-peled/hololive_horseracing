import React from "react";
import { HorseData, UserData } from "@/src/lib/types";
import { database_factory } from "@/src/lib/database";
import IconImage from "../IconImage";

interface Props {
	user: UserData;
	horse: HorseData;
}

export default async function RaceRowRacer({ user, horse }: Props) {
	const user_image = await database_factory.user_database().get_user_image_as_str(user);
	const horse_image = await database_factory
		.horse_database()
		.get_horse_image_as_str(horse);

	return (
		<>
			<div>
				<IconImage icon={user_image} />
				<b>{user.display_name}</b>
			</div>
			<div>
				<IconImage icon={horse_image} />
				<b>{horse.name}</b>
			</div>
		</>
	);
}
