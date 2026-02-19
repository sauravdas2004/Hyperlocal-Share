"use client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { MapPin, Search, Navigation, Filter } from "lucide-react";

// Note: MapLibre GL doesn't require accessToken like Mapbox does
// Using MapLibre GL for map rendering

export default function MapPage() {
	const container = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const [center, setCenter] = useState<[number, number] | null>(null);
	const [radiusKm, setRadiusKm] = useState(1);
	const [category, setCategory] = useState("");
	const [items, setItems] = useState<Array<{id: string; title: string; category: string; exchangeType: string; lng: number; lat: number}>>([]); 
	const markers = useRef<maplibregl.Marker[]>([]);

	useEffect(() => {
		if (!container.current || mapRef.current) return;
		const map = new maplibregl.Map({
			container: container.current,
			style: "https://demotiles.maplibre.org/style.json",
			center: [0, 0],
			zoom: 2,
		});
		mapRef.current = map;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((pos) => {
				const c: [number, number] = [pos.coords.longitude, pos.coords.latitude];
				setCenter(c);
				map.jumpTo({ center: c, zoom: 13 });
			});
		}
		return () => { map.remove(); };
	}, []);

	async function search() {
		if (!center) return;
		const [lng, lat] = center;
		const params = new URLSearchParams({
			lat: String(lat),
			lng: String(lng),
			radiusKm: String(radiusKm),
			...(category ? { category } : {}),
		});
		const res = await fetch(`/api/search?${params.toString()}`);
		const results: Array<{id: string; title: string; category: string; exchangeType: string; lng: number; lat: number}> = await res.json();
		setItems(results);

		markers.current.forEach((m) => m.remove());
		markers.current = results.map((i: {id: string; lng: number; lat: number; title: string; category: string; exchangeType: string}) => {
			const marker = new maplibregl.Marker({ color: "#0d9488" })
				.setLngLat([i.lng, i.lat])
				.setPopup(
					new maplibregl.Popup().setHTML(`
					<div class="p-2 min-w-[140px]">
						<h3 class="font-semibold text-gray-900">${i.title}</h3>
						<p class="text-sm text-gray-600">${i.category} • ${i.exchangeType}</p>
						<a href="/items/${i.id}" class="text-teal-600 hover:text-teal-700 text-sm font-medium">View details →</a>
					</div>
				`)
				)
				.addTo(mapRef.current!);
			return marker;
		});
	}

	return (
		<div className="relative min-h-screen flex flex-col bg-[var(--background)]">
			<div className="bg-[var(--surface)] border-b border-[var(--border)] shadow-[var(--shadow-sm)] p-4">
				<div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
					<h1 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
						<span className="w-9 h-9 rounded-lg bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center">
							<MapPin className="h-5 w-5" />
						</span>
						Map view
					</h1>
					<div className="flex flex-wrap items-center gap-3">
						<div className="flex items-center gap-2">
							<Filter className="h-4 w-4 text-[var(--muted)]" />
							<input
								className="input-base w-40"
								placeholder="Category"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							/>
						</div>
						<div className="flex items-center gap-2 text-sm text-[var(--muted)]">
							<span>Radius:</span>
							<input
								className="input-base w-20"
								type="number"
								min={0.1}
								max={10}
								step={0.1}
								value={radiusKm}
								onChange={(e) => setRadiusKm(Number(e.target.value))}
							/>
							<span>km</span>
						</div>
						<button
							className="btn-secondary text-sm py-2.5"
							onClick={() => {
								if (!navigator.geolocation) return;
								navigator.geolocation.getCurrentPosition((pos) => {
									const c: [number, number] = [pos.coords.longitude, pos.coords.latitude];
									setCenter(c);
									mapRef.current?.jumpTo({ center: c, zoom: 13 });
								});
							}}
						>
							<Navigation className="h-4 w-4" />
							My location
						</button>
						<button className="btn-primary text-sm py-2.5" onClick={search}>
							<Search className="h-4 w-4" />
							Search
						</button>
					</div>
				</div>
			</div>

			<div className="flex-1 relative min-h-[70vh]">
				<div ref={container} className="w-full h-full absolute inset-0" />

				{items.length > 0 && (
					<div className="absolute top-4 right-4 w-72 max-h-[320px] bg-[var(--surface)] rounded-[var(--radius)] shadow-[var(--shadow-lg)] border border-[var(--border)] p-4 overflow-hidden flex flex-col">
						<h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">
							Found {items.length} items
						</h3>
						<div className="space-y-1 overflow-y-auto flex-1 min-h-0">
							{items.map((i: any) => (
								<button
									key={i.id}
									type="button"
									className="w-full text-left p-3 rounded-[var(--radius)] hover:bg-[var(--background)] border border-transparent hover:border-[var(--border)] transition-colors"
									onClick={() => mapRef.current?.flyTo({ center: [i.lng, i.lat], zoom: 15 })}
								>
									<div className="font-medium text-sm text-[var(--foreground)] truncate">
										{i.title}
									</div>
									<div className="text-xs text-[var(--muted)]">
										{i.category} • {i.exchangeType}
									</div>
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
