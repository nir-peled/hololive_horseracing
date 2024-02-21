"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import UserDetailsForm from "./UserDetailsForm";
import UserSelector from "./UserSelector";

export default function EditUserForm() {
	const search_params = useSearchParams();
	const default_user = search_params.get("user");
	const [user, set_user] = useState<string | null>(default_user);

	return (
		<div>
			<UserSelector set_user={set_user} />
			{user && <UserDetailsForm edit_user={user} />}
		</div>
	);
}
