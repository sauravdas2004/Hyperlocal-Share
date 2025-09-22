import { prisma } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";

const schema = z.object({
	email: z.string().email(),
	name: z.string().min(2),
	password: z.string().min(6),
});

export async function POST(req: Request) {
	const parsed = schema.safeParse(await req.json());
	if (!parsed.success) return new Response("Invalid", { status: 400 });
	const { email, name, password } = parsed.data;

	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) return new Response("Email in use", { status: 409 });

	const hashed = await bcrypt.hash(password, 10);
	const user = await prisma.user.create({
		data: { email, name, hashedPassword: hashed },
	});
	return Response.json({ id: user.id, email: user.email, name: user.name });
}

