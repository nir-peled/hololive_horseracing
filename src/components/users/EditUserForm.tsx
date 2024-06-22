"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import UserDetailsForm from "./UserDetailsForm";

export default function EditUserForm() {
	const search_params = useSearchParams();
	const user = search_params.get("user");
	if (!user) throw new Error("bad-request-parameters");

	return <UserDetailsForm edited_user={user} />;
}
