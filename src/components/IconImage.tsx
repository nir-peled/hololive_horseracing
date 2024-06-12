"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { get_image_buffer_as_str } from "../lib/images";

interface Props {
	icon: string | Blob | Buffer;
	size?: "regular" | "small" | "large";
}

// ADD SOME WAY TO DISPLAY DIFFERENT IMAGE SIZES
export default function IconImage({ icon, size }: Props) {
	const [image_uri, set_image_uri] = useState<string>("");

	if (size == "small") throw Error("CANNOT DISPLAY SMALL IMAGES");
	if (size == "large") throw Error("CANNOT DISPLAY LARGE IMAGES");

	useEffect(() => {
		if (icon instanceof Blob) {
			set_image_uri(URL.createObjectURL(icon));
			return () => URL.revokeObjectURL(image_uri);
		} else if (icon instanceof Buffer) {
			set_image_uri(get_image_buffer_as_str(icon) || "");
		} else set_image_uri(icon);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [icon]);

	if (typeof icon == "string" && !icon.startsWith("data")) return icon;
	// icon is just a string

	return <Image src={image_uri} alt="" height={50} width={50} />;
}
