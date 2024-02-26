import { UserData } from "../src/lib/types";

declare module "next-auth" {
	interface Session {
		user: Omit<UserData, "image">;
	}
}
