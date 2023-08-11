"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../../../utils/firebase";

export default function Login() {
	// Sign in with Google
	const googleProvider = new GoogleAuthProvider();
	const router = useRouter();
	const [user, loading] = useAuthState(auth);

	//Handling function
	const GoogleLogin = async () => {
		try {
			const result = await signInWithPopup(auth, googleProvider);
			router.push("/");
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (user) {
			router.push("/");
		} else {
			console.log("user not found");
		}
	}, [user]);

	return (
		<div className="p-10 mt-12 text-gray-700 shadow-xl rounded-2xl">
			<img src="/public/logo.png" alt="" className="h-80 mx-auto" />
			<h2 className="text-4xl font-semibold text-center">Join Today !</h2>
			<div className="py-4 text-xl text-center">
				<h3 className="py-4">SignIn to Continue</h3>
				<button
					onClick={GoogleLogin}
					className="text-lg font-semibold flex items-center w-full gap-4 p-4 py-3 my-3  text-white rounded-full bg-slate-700"
				>
					<FcGoogle className="p-1 -m-1 text-3xl bg-white rounded-full " />
					SignIn with Google
				</button>
			</div>
			{/* email form */}
			<div></div>
		</div>
	);
}
