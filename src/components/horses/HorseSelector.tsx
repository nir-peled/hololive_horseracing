import React from "react";
import { useTranslation } from "react-i18next";
import { useHorsesList } from "@/src/lib/hooks";
import SelectOption from "../SelectOption";

interface Props {
	field_name?: string;
	value?: string | null;
	set_horse?: (name: string | null) => void;
	disabled_options?: string[];
}

const namespaces = ["management"];

export default function HorseSelector({
	field_name,
	value,
	set_horse,
	disabled_options,
}: Props) {
	const { t } = useTranslation(namespaces);
	const { data, loading } = useHorsesList();

	return (
		<div>
			<SelectOption
				name={field_name}
				loading={loading}
				onChange={set_horse}
				options={data}
				labels={data}
				placeholder={t("horse-selector-placeholder")}
				value={value}
				filter={true}
				disabled_options={disabled_options}
			/>
		</div>
	);
}
