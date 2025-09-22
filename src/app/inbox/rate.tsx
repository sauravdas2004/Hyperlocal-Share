"use client";
import { useState } from "react";

export default function RateUser({ rateeId, itemId, onDone }: { rateeId: string; itemId?: string; onDone?: ()=>void }) {
	const [score, setScore] = useState(5);
	const [comment, setComment] = useState("");
	const [submitting, setSubmitting] = useState(false);

	async function submit() {
		setSubmitting(true);
		try {
			const res = await fetch("/api/ratings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ rateeId, itemId, score, comment }),
			});
			if (res.ok) {
				alert("Thanks for your rating!");
				onDone?.();
			}
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="border p-3 rounded space-y-2">
			<div className="font-medium">Rate your exchange</div>
			<input className="border p-2 w-24" type="number" min={1} max={5} value={score} onChange={(e)=>setScore(Number(e.target.value))} />
			<textarea className="border p-2 w-full" placeholder="Optional comment" value={comment} onChange={(e)=>setComment(e.target.value)} />
			<button className="px-3 py-2 bg-black text-white rounded" onClick={submit} disabled={submitting}>Submit</button>
		</div>
	);
}



