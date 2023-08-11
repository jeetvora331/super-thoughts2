import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "../app/globals.css";
import Nav from "../components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Super Thoughts2",
	description: "Created by Jeet Vora",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				className={`${inter.className} h-full min-h-screen  px-4 mx-6 font-Inter md:max-w-3xl md:mx-auto bg-stone-100  pb-1 relative`}
			>
				<div className="">
					<ToastContainer limit={2} />
					<Toaster />
					<Nav />
					{children}
				</div>
				<div className="w-full ">
					<Footer />
				</div>
			</body>
		</html>
	);
}
