import Link from "next/link";
import React from "react";

const Footer = () => {
	return (
		<Link
			href="https://jeet-dev.vercel.app/"
			target="_blank "
			className="flex justify-center w-full "
		>
			<div className="absolute bottom-0 max-w-3xl w-full p-1  text-center text-gray-100 opacity-40 hover:opacity-100 bg-zinc-800 rounded-t-xl">
				Made with ❤️ by Jeet in India
			</div>
		</Link>
	);
};

export default Footer;
