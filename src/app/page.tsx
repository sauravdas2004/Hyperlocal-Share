"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, Search, Plus, Users, Heart } from "lucide-react";

export default function Home() {
	const queryClient = useQueryClient();
	const [lat, setLat] = useState<number | "">("");
	const [lng, setLng] = useState<number | "">("");
	const [radiusKm, setRadiusKm] = useState(1);
	const [category, setCategory] = useState("");
	const [locationLoading, setLocationLoading] = useState(false);
	const [locationError, setLocationError] = useState<string | null>(null);

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

	function getMyLocation(autoSearch = true) {
		setLocationError(null);
		if (!("geolocation" in navigator)) {
			setLocationError("Geolocation is not supported by your browser.");
			return;
		}
		// Geolocation only works on https or localhost
		if (typeof window !== "undefined" && !window.isSecureContext) {
			setLocationError("Location only works on HTTPS or localhost. Try opening this page at http://localhost:3000");
			return;
		}
		setLocationLoading(true);
		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				setLocationLoading(false);
				setLocationError(null);
				const newLat = Number(pos.coords.latitude.toFixed(6));
				const newLng = Number(pos.coords.longitude.toFixed(6));
				setLat(newLat);
				setLng(newLng);
				if (autoSearch) {
					const params = new URLSearchParams({
						lat: String(newLat),
						lng: String(newLng),
						radiusKm: String(radiusKm),
						...(category ? { category } : {}),
					});
					const res = await fetch(`/api/search?${params.toString()}`);
					const data = await res.json();
					queryClient.setQueryData(["search", newLat, newLng, radiusKm, category], data);
				}
			},
			(err) => {
				setLocationLoading(false);
				const code = (err as GeolocationPositionError)?.code;
				const message =
					code === 1
						? "Location permission denied. Please allow location access and try again."
						: code === 2
							? "Location unavailable. Please enter coordinates manually."
							: code === 3
								? "Location request timed out. Please try again or enter manually."
								: "Couldn't get your location. Please allow permission or enter manually.";
				setLocationError(message);
			},
			{ enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
		);
	}

	return (
		<div className="relative min-h-screen">
			{/* Hero */}
			<div className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-br from-[var(--brand-muted)]/40 via-[var(--surface)] to-[var(--accent-muted)]/30">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(13,148,136,0.15),transparent)]" />
				<div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
					<h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] tracking-tight mb-4">
						Connect with Your{" "}
						<span className="text-[var(--brand)]">Community</span>
					</h1>
					<p className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto">
						Share, borrow, and trade items with neighbors in your area. Build a stronger community through local exchanges.
					</p>
				</div>
			</div>

			<div className="relative max-w-6xl mx-auto px-4 py-10">
				{/* Search card */}
				<div className="bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] border border-[var(--border)] p-6 md:p-8 mb-10">
					<h2 className="text-xl font-semibold text-[var(--foreground)] mb-6 flex items-center gap-2">
						<span className="w-9 h-9 rounded-lg bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center">
							<Search className="h-5 w-5" />
						</span>
						Find Items Near You
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-[var(--foreground)]">Latitude</label>
							<input
								className="input-base"
								placeholder="23.844393"
								type="text"
								inputMode="decimal"
								value={lat === "" ? "" : String(lat)}
								onChange={(e) => setLat(e.target.value === "" ? "" : Number(e.target.value))}
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-[var(--foreground)]">Longitude</label>
							<input
								className="input-base"
								placeholder="91.421444"
								type="text"
								inputMode="decimal"
								value={lng === "" ? "" : String(lng)}
								onChange={(e) => setLng(e.target.value === "" ? "" : Number(e.target.value))}
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-[var(--foreground)]">Radius (km)</label>
							<input
								className="input-base"
								type="number"
								min={0.1}
								max={10}
								step="0.1"
								value={radiusKm}
								onChange={(e) => setRadiusKm(Number(e.target.value))}
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-[var(--foreground)]">Category</label>
							<input
								className="input-base"
								placeholder="electronics, books, tools..."
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex flex-wrap gap-3">
						<button
							className="btn-primary"
							onClick={() => refetch()}
							disabled={isFetching}
						>
							<Search className="h-4 w-4" />
							{isFetching ? "Searching..." : "Search"}
						</button>
						<button
							className="btn-secondary"
							type="button"
							onClick={() => getMyLocation(true)}
							disabled={locationLoading}
						>
							<MapPin className="h-4 w-4" />
							{locationLoading ? "Getting location…" : "Use my location"}
						</button>
						{locationError && (
							<p className="text-sm text-red-600 mt-1 w-full" role="alert">
								{locationError}
							</p>
						)}
						<button
							className="px-6 py-3 rounded-[var(--radius)] font-medium inline-flex items-center gap-2 bg-[var(--accent-muted)] text-[var(--accent)] hover:opacity-90 transition-opacity"
							onClick={async () => {
							const payload: Record<string, number> = {};
								if (lat !== "" && lng !== "") {
									payload.lat = Number(lat);
									payload.lng = Number(lng);
								}
								await fetch("/api/dev/seed", {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify(payload),
								});
								await refetch();
							}}
						>
							<Plus className="h-4 w-4" />
							Add demo data
						</button>
					</div>
				</div>

				{/* Results */}
				{items.length > 0 && (
					<div className="bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] border border-[var(--border)] p-6 md:p-8">
						<h3 className="text-lg font-semibold text-[var(--foreground)] mb-6 flex items-center gap-2">
							<span className="w-8 h-8 rounded-lg bg-[var(--accent-muted)] text-[var(--accent)] flex items-center justify-center">
								<Heart className="h-4 w-4" />
							</span>
							Found {items.length} items
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{items.map((i: {id: string; title: string; category: string; exchangeType: string; photos: string}) => (
								<a
									key={i.id}
									href={`/items/${i.id}`}
									className="group block bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] p-5 transition-all duration-300 hover:shadow-[var(--shadow-lg)] hover:border-[var(--brand)]/30 hover:-translate-y-1"
								>
									<div className="aspect-square rounded-xl bg-[var(--border)]/50 mb-4 flex items-center justify-center overflow-hidden">
										<Users className="h-14 w-14 text-[var(--muted)] group-hover:scale-110 transition-transform duration-300" />
									</div>
									<h4 className="font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--brand)] transition-colors">
										{i.title}
									</h4>
									<div className="flex flex-wrap gap-2 text-sm mb-3">
										<span className="px-2.5 py-1 bg-[var(--brand-muted)] text-[var(--brand)] rounded-full font-medium">
											{i.category}
										</span>
										<span className="px-2.5 py-1 bg-[var(--accent-muted)] text-[var(--accent)] rounded-full font-medium">
											{i.exchangeType}
										</span>
									</div>
									<span className="inline-flex items-center gap-1 text-[var(--brand)] font-medium text-sm">
										View details →
									</span>
								</a>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
