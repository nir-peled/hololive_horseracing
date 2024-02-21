import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
	name: string;
	update_filter: (filter: string) => void;
}

const namespaces = ["management"];

export default function FilterSearchBar({ name, update_filter }: Props) {
	const { t } = useTranslation(namespaces);

	return (
		<label className="input input-bordered flex items-center gap-2">
			{/* search icon */}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				fill="currentColor"
				className="w-4 h-4 opacity-70">
				<path
					fillRule="evenodd"
					d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
					clipRule="evenodd"
				/>
			</svg>
			<input
				type="text"
				className="grow"
				placeholder={t(`${name}-search-placeholder`)}
				onChange={(event) => update_filter(event.target.value)}
			/>
		</label>
	);
}
