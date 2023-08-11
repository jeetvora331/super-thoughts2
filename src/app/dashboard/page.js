"use client";
import "boxicons";

import Message from "@/components/Message";
import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	where,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { VscEdit } from "react-icons/vsc";
import { auth, db } from "../../../utils/firebase";

import React from "react";

const page = () => {
	const route = useRouter();
	const [user, loading] = useAuthState(auth);
	const [userPosts, setUserPosts] = useState([]);

	const getData = async () => {
		if (loading) return;
		if (!user) return route.push("/auth");

		//Get user posts
		const collectionRef = collection(db, "posts");
		const q = query(collectionRef, where("user", "==", user.uid));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			setUserPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		});
		return unsubscribe;
	};

	useEffect(() => {
		getData();
	}, [user, loading]);

	// Handlers
	const deletePost = async (id) => {
		const docRef = doc(db, "posts", id);
		await deleteDoc(docRef);
	};

	return (
		<div>
			<h1 className="text-2xl text-center">Your Posts</h1>
			<div>
				{userPosts.map((post) => {
					return (
						<Message key={post.id} {...post}>
							<div className="flex gap-4">
								<button
									onClick={() => deletePost(post.id)}
									className="flex items-center justify-center gap-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full px-2 py-1"
								>
									DELETE
								</button>
								<Link href={{ pathname: "/post", query: post }}>
									<button className="flex items-center justify-center gap-1 text-sm font-semibold text-cyan-700 bg-gray-100 rounded-full px-2 py-1  ">
										Edit
										<VscEdit />
									</button>
								</Link>
							</div>
						</Message>
					);
				})}
			</div>
			<button
				className="px-4 py-2 my-6 font-medium text-gray-800 bg-gray-200 rounded-full"
				onClick={() => auth.signOut()}
			>
				Sign out
			</button>
		</div>
	);
};

export default page;
