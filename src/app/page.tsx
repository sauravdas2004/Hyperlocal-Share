"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, Search, Plus, Users, Heart, Star } from "lucide-react";

export default function Home() {
	const [lat, setLat] = useState<number | "">("");
	const [lng, setLng] = useState<number | "">("");
	const [radiusKm, setRadiusKm] = useState(1);
	const [category, setCategory] = useState("");

	const { data: items = [], refetch, isFetching } = useQuery({
		queryKey: ["search", lat, lng, radiusKm, category],
		queryFn: async () => {
			if (lat === "" || lng === "") return [];
			const params = new URLSearchParams({
				lat: String(lat),
				lng: String(lng),
				radiusKm: String(radiusKm),
				...(category ? { category } : {}),
			});
			const res = await fetch(`/api/search?${params.toString()}`);
			return res.json();
		},
		enabled: false,
	});

	function useMyLocation(autoSearch = true) {
		if (!("geolocation" in navigator)) {
			alert("Geolocation not supported by your browser");
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setLat(Number(pos.coords.latitude.toFixed(6)));
				setLng(Number(pos.coords.longitude.toFixed(6)));
				if (autoSearch) setTimeout(() => refetch(), 0);
			},
			(err) => {
				console.error(err);
				alert("Couldn't get your location. Please allow permission or enter manually.");
			},
			{ enableHighAccuracy: true, timeout: 10000 }
		);
	}

  return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			{/* Hero Section */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-6xl mx-auto px-4 py-12">
					<div className="text-center">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							Connect with Your Community
						</h1>
						<p className="text-xl text-gray-600 mb-8">
							Share, borrow, and trade items with neighbors in your area
						</p>
					</div>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 py-8">
				{/* Search Section */}
				<div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
						<Search className="h-6 w-6 text-blue-600" />
						Find Items Near You
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Latitude</label>
							<input 
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
								placeholder="23.844393" 
								value={lat} 
								onChange={(e)=>setLat(e.target.value ? Number(e.target.value) : "")} 
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Longitude</label>
							<input 
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
								placeholder="91.421444" 
								value={lng} 
								onChange={(e)=>setLng(e.target.value ? Number(e.target.value) : "")} 
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Radius (km)</label>
							<input 
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
								type="number" 
								min={0.1} 
								max={10} 
								step="0.1" 
								value={radiusKm} 
								onChange={(e)=>setRadiusKm(Number(e.target.value))} 
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Category</label>
							<input 
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
								placeholder="electronics, books, tools..." 
								value={category} 
								onChange={(e)=>setCategory(e.target.value)} 
							/>
						</div>
					</div>
					<div className="flex flex-wrap gap-3">
						<button 
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium" 
							onClick={()=>refetch()} 
							disabled={isFetching}
						>
							<Search className="h-4 w-4" />
							{isFetching ? "Searching..." : "Search"}
						</button>
						<button 
							className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium" 
							onClick={()=>useMyLocation(true)}
						>
							<MapPin className="h-4 w-4" />
							Use my location
						</button>
						<button
							className="px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2 font-medium"
							onClick={async ()=>{
								const payload: any = {};
								if (lat !== "" && lng !== "") { payload.lat = Number(lat); payload.lng = Number(lng); }
								await fetch("/api/dev/seed", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
								await refetch();
							}}
						>
							<Plus className="h-4 w-4" />
							Add demo data
						</button>
					</div>
				</div>

				{/* Results Section */}
				{items.length > 0 && (
					<div className="bg-white rounded-2xl shadow-lg p-6">
						<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
							<Heart className="h-5 w-5 text-red-500" />
							Found {items.length} items
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{items.map((i: any) => (
								<div key={i.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
									<div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
										<Users className="h-12 w-12 text-gray-400" />
									</div>
									<h4 className="font-semibold text-gray-900 mb-2">{i.title}</h4>
									<div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
										<span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{i.category}</span>
										<span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">{i.exchangeType}</span>
									</div>
									<a 
										href={`/items/${i.id}`} 
										className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
									>
										View details →
									</a>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
    </div>
  );
}