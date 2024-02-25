"use client";
import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import FormInput from "./FormInput";
import IconImage from "../IconImage";

interface Props {
	register?: UseFormRegister<any>;
	field_name: string;
	label: string;
	error?: string;
	preview?: boolean;
}

export default function ImageFormInput({
	register,
	field_name,
	label,
	error,
	preview,
}: Props) {
	const [image, set_image] = useState<File | null>(null);
	const get_attr = () => {
		let attrs: any = register ? register(field_name) : { name: field_name };
		if (preview) {
			const base_on_change = attrs.onChange;
			attrs.onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
				if (base_on_change) base_on_change(event);
				let files = event.target.files;
				if (files && files.length > 0) set_image(files[0]);
				else set_image(null);
			};
		}

		return attrs;
	};

	return (
		<FormInput label={label} error={error}>
			<input
				type="file"
				accept="image/*"
				className="file-input file-input-bordered w-full max-w-xs"
				{...get_attr()}
			/>
			{preview && image && <IconImage icon={image} />}
		</FormInput>
	);
}
