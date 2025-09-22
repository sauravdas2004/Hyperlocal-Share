import { prisma } from "@/lib/db";
import { getSession } from "@/lib/serverAuth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const item = await prisma.item.findUnique({ where: { id } });
	if (!item) return new Response("Not found", { status: 404 });
	return Response.json(item);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const session = await getSession();
	if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
	const existing = await prisma.item.findUnique({ where: { id } });
	if (!existing || existing.ownerId !== session.user.id) return new Response("Forbidden", { status: 403 });
	await prisma.item.update({ where: { id }, data: { isActive: false } });
	return new Response(null, { status: 204 });
}



