import { getSession } from "@/lib/serverAuth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const postSchema = z.object({ conversationId: z.string().cuid(), content: z.string().min(1).max(2000) });

export async function GET(req: Request) {
	const session = await getSession();
	if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
	const { searchParams } = new URL(req.url);
	const conversationId = searchParams.get("conversationId");
	if (!conversationId) return new Response("Missing conversationId", { status: 400 });
	const messages = await prisma.message.findMany({
		where: { conversationId, conversation: { participants: { some: { userId: session.user.id } } } },
		orderBy: { createdAt: "asc" },
	});
	return Response.json(messages);
}

export async function POST(req: Request) {
	const session = await getSession();
	if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
	const { conversationId, content } = postSchema.parse(await req.json());

	const isParticipant = await prisma.conversationParticipant.findFirst({ where: { conversationId, userId: session.user.id } });
	if (!isParticipant) return new Response("Forbidden", { status: 403 });

	const msg = await prisma.$transaction(async (tx) => {
		const m = await tx.message.create({ data: { conversationId, senderId: session.user.id, content } });
		await tx.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
		return m;
	});

	return Response.json(msg);
}


