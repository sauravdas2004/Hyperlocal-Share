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
		<div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3 shadow-[var(--shadow-sm)]">
			<div className="font-medium text-[var(--foreground)]">Rate your exchange</div>
			<input
				className="input-base w-24"
				type="number"
				min={1}
				max={5}
				value={score}
				onChange={(e)=>setScore(Number(e.target.value))}
			/>
			<textarea
				className="input-base min-h-[80px] resize-none"
				placeholder="Optional comment"
				value={comment}
				onChange={(e)=>setComment(e.target.value)}
			/>
			<button className="btn-primary" onClick={submit} disabled={submitting}>
				Submit
			</button>
		</div>
	);
}
