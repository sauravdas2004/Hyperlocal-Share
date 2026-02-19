import { getSession } from "@/lib/serverAuth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { ExchangeType } from "@/generated/prisma";

const createSchema = z.object({
	title: z.string().min(2, "Title too short"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	category: z.string().min(2, "Category is required"),
	exchangeType: z.enum(["BORROW", "GIVE", "TRADE"], {
		message: "Invalid exchange type"
	}),
	tradeFor: z.string().optional(),
	photos: z.array(z.string().url("Photo must be a valid URL")).max(6, "Max 6 photos"),
	lat: z.number({
		message: "Latitude required"
	}),
	lng: z.number({
		message: "Longitude required"
	}),
});

export async function POST(req: Request) {
	const session = await getSession();
	if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return new Response("Invalid JSON", { status: 400 });
	}
	const parsed = createSchema.safeParse(body);
	if (!parsed.success) {
		return new Response(parsed.error.flatten().formErrors.join("; ") || "Validation error", { status: 400 });
	}
	const data = parsed.data;
	try {
		const item = await prisma.item.create({
			data: {
				ownerId: session.user.id,
				title: data.title,
				description: data.description,
				category: data.category,
				exchangeType: data.exchangeType as ExchangeType,
				tradeFor: data.tradeFor ?? null,
				photos: data.photos,
				lat: data.lat,
				lng: data.lng,
			},
		});
		return Response.json(item);
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : "Failed to create";
		return new Response(message, { status: 500 });
	}
}

export async function GET() {
	const items = await prisma.item.findMany({
		where: { isActive: true },
		orderBy: { createdAt: "desc" },
		take: 50,
	});
	return Response.json(items);
}


