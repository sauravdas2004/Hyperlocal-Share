import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
	if (process.env.NODE_ENV === "production") return new Response("Forbidden", { status: 403 });
	let body: any = {};
	try { body = await req.json(); } catch {}
	const lat = typeof body.lat === "number" ? body.lat : 23.844393;
	const lng = typeof body.lng === "number" ? body.lng : 91.421444;

	const email = "demo@example.com";
	const name = "Demo User";
	const password = await bcrypt.hash("password123", 10);

	const user = await prisma.user.upsert({
		where: { email },
		update: {},
		create: { email, name, hashedPassword: password },
	});

	const item = await prisma.item.create({
		data: {
			ownerId: user.id,
			title: "Spare Phone Charger",
			description: "USB-C wall charger available to borrow.",
			category: "electronics",
			exchangeType: "BORROW" as any,
			tradeFor: null,
			photos: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80"],
			lat,
			lng,
		},
	});

	return Response.json({ user, item });
}



