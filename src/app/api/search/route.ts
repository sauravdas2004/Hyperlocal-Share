import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
	lat: z.coerce.number(),
	lng: z.coerce.number(),
	radiusKm: z.coerce.number().min(0.1).max(10),
	category: z.string().optional(),
});

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const parsed = schema.safeParse({
		lat: searchParams.get("lat"),
		lng: searchParams.get("lng"),
		radiusKm: searchParams.get("radiusKm"),
		category: searchParams.get("category") ?? undefined,
	});
	if (!parsed.success) return new Response("Invalid", { status: 400 });
	const { lat, lng, radiusKm, category } = parsed.data;

	const delta = radiusKm / 111;
	const minLat = lat - delta, maxLat = lat + delta;
	const minLng = lng - delta, maxLng = lng + delta;

	const candidates = await prisma.item.findMany({
		where: {
			isActive: true,
			lat: { gte: minLat, lte: maxLat },
			lng: { gte: minLng, lte: maxLng },
			...(category ? { category } : {}),
		},
		take: 200,
	});

	const toRad = (d: number) => (d * Math.PI) / 180;
	const R = 6371;
	const results = candidates.filter((i) => {
		const dLat = toRad(i.lat - lat);
		const dLng = toRad(i.lng - lng);
		const a =
			Math.sin(dLat / 2) ** 2 +
			Math.cos(toRad(lat)) * Math.cos(toRad(i.lat)) * Math.sin(dLng / 2) ** 2;
		const d = 2 * R * Math.asin(Math.sqrt(a));
		return d <= radiusKm;
	});

	return Response.json(results);
}



