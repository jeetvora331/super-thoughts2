"use client";
import { Inter } from "@next/font/google";
import {
	collection,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import "../app/globals.css";
import Message from "../components/Message";

export default function Home() {
	const [allPosts, setAllPosts] = useState([]);
	const getPosts = async () => {
		const collectionRef = collection(db, "posts");
		const q = query(collectionRef, orderBy("timeStamp", "desc"));
		const unsubscribe = onSnapshot(q, (snapshot) => {
			setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		});
		return unsubscribe;
	};

	useEffect(() => {
		getPosts();
	}, []);

	return (
		<main>
			<div className="my-12 text-lg font-medium">
				<h2 className="pb-2 text-center">See what others are thinking</h2>
				{allPosts.map((post) => (
					<Message key={post.id} {...post}>
						<Link
							href={{ pathname: `/${post.id}`, query: post }}
							className="text-xs bg-gray-100 px-2 rounded-full py-1 border-cyan-300 border-0
				"
						>
							{post.comments?.length} Comments
						</Link>
					</Message>
				))}
			</div>
		</main>
	);
}
