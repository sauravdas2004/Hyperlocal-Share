"use client";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

export default function MessageOwnerButton({ ownerId, itemId }: { ownerId: string; itemId: string }) {
	const [loading, setLoading] = useState(false);

	async function startConversation() {
		setLoading(true);
		try {
			const res = await fetch("/api/conversations", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: ownerId, itemId }),
			});
			if (res.status === 401) {
				alert("Please log in to message the owner.");
				location.href = "/login";
				return;
			}
			if (res.ok) {
				location.href = "/inbox";
			} else {
				const error = await res.text();
				console.error("Conversation error:", error);
				alert("Could not start conversation: " + error);
			}
		} catch (err) {
			console.error("Network error:", err);
			alert("Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<button
			className="btn-primary w-full"
			onClick={startConversation}
			disabled={loading}
		>
			<MessageSquare className="h-4 w-4" />
			{loading ? "Starting..." : "Message owner"}
		</button>
	);
}
