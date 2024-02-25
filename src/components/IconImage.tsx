"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
	icon: string | Blob;
}

export default function IconImage({ icon }: Props) {
	const [image_uri, set_image_uri] = useState<string>("");

	useEffect(() => {
		if (icon instanceof Blob) {
			set_image_uri(URL.createObjectURL(icon));
			return () => URL.revokeObjectURL(image_uri);
		} else set_image_uri(icon);
	}, [icon]);

	if (typeof icon == "string" && !icon.startsWith("data")) return icon;
	// icon is just a string

	return <Image src={image_uri} alt="" width={10} height={10} />;
}
