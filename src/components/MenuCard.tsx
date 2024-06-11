import React, { ReactNode } from "react";

interface Props {
	title: string;
	children: ReactNode;
	default_open?: boolean;
}

function MenuCard({ title, children, default_open }: Props) {
	return (
		<div className="collapse collapse-arrow bg-base-200">
			<input type="radio" name="my-accordion-2" defaultChecked={default_open} />
			<div className="collapse-title text-xl font-medium">{title}</div>
			<div className="collapse-content">{children}</div>
		</div>
	);
}

export default MenuCard;
