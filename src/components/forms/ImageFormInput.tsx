"use client";
import React, { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import FormInput from "./FormInput";
import IconImage from "../IconImage";
import { get_image_buffer_as_str } from "@/src/lib/utils";

interface Props {
	register?: UseFormRegister<any>;
	field_name: string;
	label: string;
	error?: string;
	preview?: boolean;
	default_display?: Buffer | null;
}

export default function ImageFormInput({
	register,
	field_name,
	label,
	error,
	preview,
	default_display,
}: Props) {
	const [image, set_image] = useState<File | null>(null);
	const default_display_str = default_display && get_image_buffer_as_str(default_display);
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
			{/* if preview: if image chosen, display image. */}
			{/* otherwise, if default display, display it */}
			{preview &&
				(image ? (
					<IconImage icon={image} />
				) : (
					default_display_str && <IconImage icon={default_display_str} />
				))}
		</FormInput>
	);
}
