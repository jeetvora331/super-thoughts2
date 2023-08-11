"use client";
import "react-toastify/dist/ReactToastify.css";

import Message from "@/components/Message";
import {
	arrayUnion,
	doc,
	getDoc,
	onSnapshot,
	Timestamp,
	updateDoc,
} from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { auth, db } from "../../../utils/firebase";

const Details = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const routerData = {
		id: searchParams.get("id"),
		description: searchParams.get("description"),
		avatar: searchParams.get("avatar"),
		current_timestamp: searchParams.get("current_timestamp"),
		slug: searchParams.get("slug"),
		timeStamp: searchParams.get("timeStamp"),
		user: searchParams.get("user"),
		username: searchParams.get("username"),
	};

	const [message, setMessage] = useState("");
	const [allMessages, setAllMessages] = useState([]);

	const getComments = async () => {
		const docRef = doc(db, "posts", routerData?.id);
		const unsubscribe = onSnapshot(docRef, (snapshot) => {
			if (!snapshot.data()) return;
			setAllMessages(snapshot.data().comments);
			// console.log("docSnap.data?.comments :>> ", snapshot.data().comments);
		});
		return unsubscribe;
	};

	useEffect(() => {
		// if (!router.isReady) return;
		getComments();
		// console.log("router readt  :>> ", router.isReady);
	}, [router.isReady]);

	const submitComment = async () => {
		if (!auth.currentUser) return router.push("/auth");
		if (!message) {
			toast.error("Please write something");
			return;
		}
		const docRef = doc(db, "posts", routerData.id);
		await updateDoc(docRef, {
			comments: arrayUnion({
				message,
				avatar: auth.currentUser.photoURL,
				username: auth.currentUser.displayName,
				time: Timestamp.now(),
			}),
		});
		setMessage("");
	};

	return (
		<div>
			<h1>Comments</h1>
			<Message {...routerData}>
				<div className="my-4 ">
					<div className="flex rounded-full">
						<input
							className="bg-gray-100 p-2 px-4 w-full rounded-l-full text-sm "
							type="text"
							placeholder="Write Comment Here...."
							value={message}
							onChange={(e) => {
								setMessage(e.target.value);
							}}
						/>
						<button
							onClick={submitComment}
							className="bg-cyan-100 py-2 px-4 text-sm rounded-r-full"
						>
							Submit
						</button>
					</div>
				</div>
			</Message>
			<div>
				{allMessages ? (
					<h1 className="px-6 pt-2 ml-8 font-bold align-baseline">Comments</h1>
				) : (
					""
				)}
				{console.log("allMessages", allMessages)}
				{allMessages?.map((message) => (
					<div>
						<div
							className="bg-white p-4 pl-12 my-2 ml-8 rounded-lg "
							key={message.time}
						>
							<div className="flex items-center gap-2 mb-4">
								<img
									className="w-6 rounded-full"
									src={message.avatar}
									alt="user image "
								/>
								<h2 className="">{message.username}</h2>
							</div>
							<h2 className="text-sm">{message.message}</h2>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Details;
