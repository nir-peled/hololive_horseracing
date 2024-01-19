import { Session } from "next-auth";
import { auth } from "./auth";
import { UserData } from "./types";

// to be written
export async function get_user_data(session?: Session | null): Promise<UserData | null> {
	if (!session) session = await auth();
	// console.log("session:"); // deubg
	// console.log(session); // debug
	const name = session?.user?.name;
	if (!name) return null;

	// for testing
	return {
		id: "1",
		display_name: "nir",
		image: "",
		role: "manager",
	};
}
