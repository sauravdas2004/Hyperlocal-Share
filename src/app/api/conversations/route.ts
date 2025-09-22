import { getSession } from "@/lib/serverAuth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({ userId: z.string().cuid(), itemId: z.string().cuid().optional() });

export async function POST(req: Request) {
	try {
		const session = await getSession();
		if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
		
		const body = await req.json();
		console.log("Conversation request body:", body);
		
		const { userId, itemId } = createSchema.parse(body);

		// Get the actual owner ID from the item if itemId is provided
		let ownerId = userId;
		if (itemId) {
			const item = await prisma.item.findUnique({ where: { id: itemId }, select: { ownerId: true } });
			if (!item) return new Response("Item not found", { status: 404 });
			ownerId = item.ownerId;
		}

		// Don't create conversation with yourself
		if (ownerId === session.user.id) {
			return new Response("Cannot message yourself", { status: 400 });
		}

		// Check if conversation already exists
		const existing = await prisma.conversation.findFirst({
			where: {
				itemId: itemId ?? null,
				participants: {
					some: {
						userId: session.user.id
					}
				}
			},
			include: { participants: true }
		});

		if (existing) {
			return Response.json(existing);
		}

		const conversation = await prisma.$transaction(async (tx) => {
			const c = await tx.conversation.create({ data: { itemId: itemId ?? null } });
			await tx.conversationParticipant.createMany({
				data: [
					{ conversationId: c.id, userId: session.user.id },
					{ conversationId: c.id, userId: ownerId },
				],
			});
			return c;
		});

		return Response.json(conversation);
	} catch (error) {
		console.error("Conversation creation error:", error);
		return new Response("Internal server error: " + (error as Error).message, { status: 500 });
	}
}

export async function GET() {
	const session = await getSession();
	if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
	const list = await prisma.conversation.findMany({
		where: { participants: { some: { userId: session.user.id } } },
		include: { participants: { include: { user: true } }, item: true },
		orderBy: { updatedAt: "desc" },
	});
	return Response.json(list);
}


