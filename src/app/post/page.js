"use client";
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	Timestamp,
	updateDoc,
} from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthStateHook, useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { auth, db } from "../../../utils/firebase";

const Post = () => {
	const [post, setPost] = useState({ description: "" });
	const [user, loading] = useAuthState(auth);
	const route = useRouter();

	const searchParams = useSearchParams();
	const routeData = {
		id: searchParams.get("id"),
		description: searchParams.get("description"),
	};

	console.log("routeData", routeData);
	// handlers
	const submitPost = async (e) => {
		e.preventDefault();

		if (!post.description) {
			toast.error("Post description is required", {
				position: "top-center",
				autoClose: 1500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
				limit: 2,
			});
			return;
		}

		if (post.description > 300) {
			toast.error("Description too long", {
				position: "top-center",
				autoClose: 1500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
				limit: 2,
			});
			return;
		}

		// converting time stamp
		function convertTimestamp(seconds) {
			creation = new Date(creation.seconds * 1000);
			const formattedDate = creation.toLocaleDateString("en-US");
			const formattedTime = creation.toLocaleString("en-US", {
				hour: "numeric",
				minute: "numeric",
				hour12: true,
			});
			const newDate = `${formattedDate} ${formattedTime}`;
			return newDate;
		}

		// Update post
		if (post?.hasOwnProperty("id")) {
			const docRef = doc(db, "posts", post.id);
			const updatedPost = { ...post, timeStamp: serverTimestamp() };
			await updateDoc(docRef, updatedPost);
			return route.push("/");
		} else {
			// Creating new post
			const collectionRef = collection(db, "posts");
			await addDoc(collectionRef, {
				...post,
				timeStamp: serverTimestamp(),
				current_timestamp: Timestamp.fromDate(new Date()),
				user: user.uid,
				avatar: user.photoURL,
				username: user.displayName,
			});
			setPost({ description: "" });
			return route.push("/");
		}
	};

	useEffect(() => {
		if (loading) return;
		if (!user) route.push("/auth");
		if (routeData.id) {
			setPost({ description: routeData.description, id: routeData.id });
		}
	}, [user, loading]);

	return (
		<div className="max-w-md p-12 mx-auto my-20 rounded-lg shadow-lg">
			<form action="" onSubmit={submitPost}>
				<h1 className="text-2xl font-bold">
					{post.hasOwnProperty("id") ? "Edit your post" : "Create a new post"}
					{/* {routeData.id ? "Edit post" : "Create New Post"} */}
				</h1>
				<div className="py-2">
					<h3 className="py-2 text-lg font-medium">Description</h3>
					<textarea
						value={post.description}
						onChange={(e) => {
							setPost({ ...post, description: e.target.value });
						}}
						placeholder="Write your post here"
						className={`w-full h-48 p-2 text-sm rounded-lg shadow-inner bg-slate-200 ${
							post.description.length > 300 ? "bg-red-300" : ""
						}`}
					></textarea>
					<p className="text-sm ">{post.description.length}/300</p>
				</div>
				<button className="w-full gap-2 p-2 my-3 text-sm text-white rounded-full bg-slate-700">
					Submit
				</button>
			</form>
		</div>
	);
};

export default Post;
