import Link from "next/link";
import Image from "next/image";
import React from "react";

function Navbar() {
	return (
		<div className="navbar bg-base-100">
			<div className="flex-1">
				<div className="avatar">
					<div className="w-10 h-12">
						<Image
							src="/logo.svg"
							alt="Hololive Horseracing Logo"
							width={40}
							height={50}
							priority
						/>
					</div>
				</div>
			</div>
			<div className="flex-none">
				<ul className="menu menu-horizontal px-1">
					<li>
						<Link href="/races">Races</Link>
					</li>
					<li>
						<Link href="/bets">Bets</Link>
					</li>
					<li>
						<Link href="/bank">Bank</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default Navbar;
