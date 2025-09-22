import { getSession } from "@/lib/serverAuth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
	rateeId: z.string().cuid(),
	itemId: z.string().cuid().optional(),
	score: z.number().int().min(1).max(5),
	comment: z.string().max(500).optional(),
});

export async function POST(req: Request) {
	const session = await getSession();
	if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
	const { rateeId, itemId, score, comment } = schema.parse(await req.json());

	const rating = await prisma.$transaction(async (tx) => {
		const r = await tx.rating.create({ data: { raterId: session.user.id, rateeId, itemId: itemId ?? null, score, comment } });
		const agg = await tx.rating.groupBy({
			by: ["rateeId"],
			where: { rateeId },
			_sum: { score: true },
			_count: { _all: true },
		});
		const sum = agg[0]?._sum.score ?? 0;
		const count = agg[0]?._count._all ?? 0;
		await tx.user.update({ where: { id: rateeId }, data: { ratingAverage: count ? sum / count : 0, ratingCount: count } });
		return r;
	});

	return Response.json(rating);
}


