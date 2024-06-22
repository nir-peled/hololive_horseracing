"use client";
import React from "react";
import Button from "./Button";
import { echo } from "../lib/actions";

export default function TestForm() {
	return (
		<form onSubmit={async () => console.log(await echo("hello"))}>
			<Button type="submit">Submit</Button>
		</form>
	);
}
