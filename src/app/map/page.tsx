"use client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Search, Navigation, Filter, Plus } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function MapPage() {
	const container = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const [center, setCenter] = useState<[number, number] | null>(null);
	const [radiusKm, setRadiusKm] = useState(1);
	const [category, setCategory] = useState("");
	const [items, setItems] = useState<any[]>([]);
	const markers = useRef<mapboxgl.Marker[]>([]);

	useEffect(() => {
		if (!container.current || mapRef.current) return;
		const map = new mapboxgl.Map({
			container: container.current,
			style: "mapbox://styles/mapbox/streets-v12",
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
		const results = await res.json();
		setItems(results);
		
		// Clear existing markers
		markers.current.forEach((m)=>m.remove());
		
		// Add new markers
		markers.current = results.map((i: any) => {
			const marker = new mapboxgl.Marker({ color: '#3B82F6' })
				.setLngLat([i.lng, i.lat])
				.setPopup(new mapboxgl.Popup().setHTML(`
					<div class="p-2">
						<h3 class="font-semibold text-gray-900">${i.title}</h3>
						<p class="text-sm text-gray-600">${i.category} • ${i.exchangeType}</p>
						<a href="/items/${i.id}" class="text-blue-600 hover:text-blue-700 text-sm">View details →</a>
					</div>
				`))
				.addTo(mapRef.current!);
			return marker;
		});
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
			<div className="h-screen flex flex-col">
				{/* Header */}
				<div className="bg-white shadow-sm border-b p-4">
					<div className="max-w-6xl mx-auto flex items-center justify-between">
						<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
							<MapPin className="h-6 w-6 text-blue-600" />
							Map View
						</h1>
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2">
								<Filter className="h-4 w-4 text-gray-500" />
								<input 
									className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
									placeholder="Category filter" 
									value={category} 
									onChange={(e)=>setCategory(e.target.value)} 
								/>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-600">Radius:</span>
								<input 
									className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
									type="number" 
									min={0.1} 
									max={10} 
									step={0.1} 
									value={radiusKm} 
									onChange={(e)=>setRadiusKm(Number(e.target.value))} 
								/>
								<span className="text-sm text-gray-600">km</span>
							</div>
							<button 
								className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm" 
								onClick={()=>{
									if (!navigator.geolocation) return;
									navigator.geolocation.getCurrentPosition((pos)=>{
										const c: [number, number] = [pos.coords.longitude, pos.coords.latitude];
										setCenter(c);
										mapRef.current?.jumpTo({ center: c, zoom: 13 });
									});
								}}
							>
								<Navigation className="h-4 w-4" />
								My Location
							</button>
							<button 
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm" 
								onClick={search}
							>
								<Search className="h-4 w-4" />
								Search
							</button>
						</div>
					</div>
				</div>

				{/* Map */}
				<div className="flex-1 relative">
					<div ref={container} className="w-full h-full" />
					
					{/* Results overlay */}
					{items.length > 0 && (
						<div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
							<h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
								<Plus className="h-4 w-4 text-green-600" />
								Found {items.length} items
							</h3>
							<div className="space-y-2 max-h-64 overflow-y-auto">
								{items.map((i: any) => (
									<div key={i.id} className="p-2 hover:bg-gray-50 rounded cursor-pointer" onClick={() => {
										mapRef.current?.flyTo({ center: [i.lng, i.lat], zoom: 15 });
									}}>
										<div className="font-medium text-sm text-gray-900">{i.title}</div>
										<div className="text-xs text-gray-600">{i.category} • {i.exchangeType}</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}