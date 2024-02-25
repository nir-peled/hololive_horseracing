import { Session, User as AuthUser } from "next-auth";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { auth } from "./auth";
import { UserData, UserFormData, UserDefaultValues } from "./types";
import { compare_passwords, hash_password, image_as_buffer } from "./utils";

interface UserDataOps {
	session?: Session | null;
	user?: AuthUser;
	to_token?: boolean;
}

const prisma = new PrismaClient().$extends(withAccelerate());

export async function is_user_password(name: string, password: string) {
	console.log("check if user password"); // debug

	let user = await prisma.user.findUnique({
		where: { name },
		select: { name: true, password: true },
	});
	if (!user) {
		console.log(`user .${name}. not found`); // debug
		return false;
	}

	console.log("found user, comparing passwords"); // debug
	return await compare_passwords(password, user.password);
}

export async function is_user_exists(name: string) {
	let user = await prisma.user.findUnique({ where: { name }, select: { name: true } });
	return user != null;
}

export async function create_user(params: UserFormData) {
	let hashed_pass = await hash_password(params.password);
	let image_buffer = await image_as_buffer(params.image);

	let user_params: Prisma.UserCreateInput = {
		name: params.username,
		password: hashed_pass,
		display_name: params.display_name,
		role: params.role,
		image: image_buffer,
	};

	let user = await prisma.user.create({ data: user_params });
	return !!user;
}

// to be written
export async function get_user_data({
	session,
	user,
	to_token,
}: UserDataOps = {}): Promise<UserData | null> {
	if (!user) {
		if (!session) session = await auth();
		// console.log("session: "); // debug
		// console.log(session); // debug
		user = session?.user;
		if (!user) return null;
	}

	if (!user.name) return null;

	let user_data = (await prisma.user.findUnique({
		where: { name: user.name },
		select: {
			name: true,
			role: true,
			display_name: true,
			balance: true,
			dept: true,
			image: !to_token,
		},
	})) as UserData | null;

	return user_data;
}

export async function get_user_image(name: string): Promise<Buffer | null> {
	let user_data = await prisma.user.findUnique({
		where: { name },
		select: { image: true },
	});

	if (!user_data?.image) return null;
	return user_data.image;
}

export async function get_user_as_form_data(
	username: string | undefined
): Promise<UserDefaultValues> {
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// TEMPORATY, FILL LATER
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	const result =
		username &&
		(await prisma.user.findUnique({
			where: { name: username },
			select: {
				name: true,
				display_name: true,
				role: true,
				image: true,
			},
		}));

	if (!result)
		return {
			username: "",
			role: "select_role",
			display_name: "",
		};

	return {
		username: result.name,
		role: result.role,
		display_name: result.display_name,
		image: result.image,
	};
}

export async function get_usernames({
	filter,
	select,
}: {
	filter?: string;
	select?: Partial<{ [key in keyof UserData]: true }>;
} = {}): Promise<{ name: string; display_name: string }[]> {
	if (!filter) filter = "";
	if (!select) select = { name: true, display_name: true };

	let data = await prisma.user.findMany({
		select: select,
		where: {
			name: { contains: filter },
		},
	});

	return data;
}
