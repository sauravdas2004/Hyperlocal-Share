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

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
			<div className="max-w-2xl mx-auto px-4 py-8">
				<div className="bg-white rounded-2xl shadow-lg p-8">
					<div className="flex items-center gap-4 mb-8">
						<Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
							<ArrowLeft className="h-5 w-5" />
						</Link>
						<h1 className="text-3xl font-bold text-gray-900">Create New Item</h1>
					</div>

					<div className="space-y-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
								<Type className="h-4 w-4" />
								Title
							</label>
							<input 
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
								placeholder="What are you offering?" 
								value={title} 
								onChange={(e)=>setTitle(e.target.value)} 
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Description</label>
							<textarea 
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none" 
								placeholder="Describe your item in detail..." 
								value={description} 
								onChange={(e)=>setDescription(e.target.value)} 
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
								<Tag className="h-4 w-4" />
								Category
							</label>
							<input 
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
								placeholder="electronics, books, tools, furniture..." 
								value={category} 
								onChange={(e)=>setCategory(e.target.value)} 
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Exchange Type</label>
							<select 
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
								value={exchangeType} 
								onChange={(e)=>setExchangeType(e.target.value as any)}
							>
								<option value="GIVE">Give away (free)</option>
								<option value="BORROW">Borrow (temporary)</option>
								<option value="TRADE">Trade (exchange)</option>
							</select>
						</div>

						{exchangeType === "TRADE" && (
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">Looking for...</label>
								<input 
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
									placeholder="What would you like in return?" 
									value={tradeFor} 
									onChange={(e)=>setTradeFor(e.target.value)} 
								/>
							</div>
						)}

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
								<MapPin className="h-4 w-4" />
								Location
							</label>
							<div className="grid grid-cols-2 gap-3">
								<input 
									className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
									placeholder="Latitude" 
									value={lat} 
									onChange={(e)=>setLat(e.target.value ? Number(e.target.value) : "")} 
								/>
								<input 
									className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
									placeholder="Longitude" 
									value={lng} 
									onChange={(e)=>setLng(e.target.value ? Number(e.target.value) : "")} 
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
								<Upload className="h-4 w-4" />
								Photo URLs
							</label>
							<input 
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
								placeholder="Paste image URLs separated by commas" 
								value={photos} 
								onChange={(e)=>setPhotos(e.target.value)} 
							/>
						</div>

						<button 
							className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg disabled:opacity-50" 
							onClick={submit} 
							disabled={loading}
						>
							{loading ? "Creating..." : "Create Item"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}