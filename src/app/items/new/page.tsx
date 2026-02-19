"use client";
import { useState } from "react";
import { ArrowLeft, Upload, MapPin, Tag, Type } from "lucide-react";
import Link from "next/link";

export default function NewItemPage() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [exchangeType, setExchangeType] = useState<"BORROW"|"GIVE"|"TRADE">("GIVE");
	const [tradeFor, setTradeFor] = useState("");
	const [lat, setLat] = useState<number | "">("");
	const [lng, setLng] = useState<number | "">("");
	const [photos, setPhotos] = useState("");
	const [loading, setLoading] = useState(false);

	async function submit() {
		if (!title || !description || !category) {
			alert("Please fill title, description, and category.");
			return;
		}
		if (lat === "" || lng === "") {
			alert("Please provide latitude and longitude (or use your location).");
			return;
		}
		setLoading(true);
		try {
			const res = await fetch("/api/items", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title, description, category, exchangeType,
					tradeFor: exchangeType === "TRADE" ? tradeFor : undefined,
					lat: Number(lat), lng: Number(lng),
					photos: photos.split(",").map((s)=>s.trim()).filter(Boolean),
				}),
			});
			if (res.status === 401) {
				alert("Please log in to create an item.");
				location.href = "/login";
				return;
			}
			if (res.ok) {
				location.href = "/";
				return;
			}
			const msg = await res.text();
			alert(msg || "Failed to create item");
		} finally {
			setLoading(false);
		}
	}

	const inputClass = "w-full px-4 py-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)] transition-all duration-200";

	return (
		<div className="min-h-screen bg-gradient-to-br from-[var(--brand-muted)]/20 via-[var(--background)] to-[var(--accent-muted)]/10 py-10">
			<div className="max-w-2xl mx-auto px-4">
				<div className="bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] border border-[var(--border)] p-6 md:p-8">
					<div className="flex items-center gap-4 mb-8">
						<Link href="/" className="p-2 rounded-[var(--radius)] text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)] transition-colors">
							<ArrowLeft className="h-5 w-5" />
						</Link>
						<h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">Create new item</h1>
					</div>

					<div className="space-y-5">
						<div className="space-y-2">
							<label className="text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
								<Type className="h-4 w-4 text-[var(--brand)]" />
								Title
							</label>
							<input className={inputClass} placeholder="What are you offering?" value={title} onChange={(e)=>setTitle(e.target.value)} />
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-[var(--foreground)]">Description</label>
							<textarea className={inputClass + " h-24 resize-none"} placeholder="Describe your item in detail..." value={description} onChange={(e)=>setDescription(e.target.value)} />
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
								<Tag className="h-4 w-4 text-[var(--brand)]" />
								Category
							</label>
							<input className={inputClass} placeholder="electronics, books, tools, furniture..." value={category} onChange={(e)=>setCategory(e.target.value)} />
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-[var(--foreground)]">Exchange type</label>
							<select className={inputClass} value={exchangeType} onChange={(e)=>setExchangeType(e.target.value as "BORROW"|"GIVE"|"TRADE")}>
								<option value="GIVE">Give away (free)</option>
								<option value="BORROW">Borrow (temporary)</option>
								<option value="TRADE">Trade (exchange)</option>
							</select>
						</div>
						{exchangeType === "TRADE" && (
							<div className="space-y-2">
								<label className="text-sm font-medium text-[var(--foreground)]">Looking for…</label>
								<input className={inputClass} placeholder="What would you like in return?" value={tradeFor} onChange={(e)=>setTradeFor(e.target.value)} />
							</div>
						)}
						<div className="space-y-2">
							<label className="text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
								<MapPin className="h-4 w-4 text-[var(--brand)]" />
								Location
							</label>
							<div className="grid grid-cols-2 gap-3">
								<input className={inputClass} placeholder="Latitude" value={lat} onChange={(e)=>setLat(e.target.value ? Number(e.target.value) : "")} />
								<input className={inputClass} placeholder="Longitude" value={lng} onChange={(e)=>setLng(e.target.value ? Number(e.target.value) : "")} />
							</div>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
								<Upload className="h-4 w-4 text-[var(--brand)]" />
								Photo URLs
							</label>
							<input className={inputClass} placeholder="Paste image URLs separated by commas" value={photos} onChange={(e)=>setPhotos(e.target.value)} />
						</div>
						<button className="btn-primary w-full py-4 text-lg" onClick={submit} disabled={loading}>
							{loading ? "Creating…" : "Create item"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
