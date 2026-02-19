import type { DefaultSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: { id: string } & DefaultSession["user"];
	}
}

const credentialsSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
	session: { strategy: "jwt" },
	providers: [
		Credentials({
			name: "credentials",
			credentials: { email: {}, password: {} },
			async authorize(raw) {
				const parsed = credentialsSchema.safeParse(raw);
				if (!parsed.success) return null;
				const { email, password } = parsed.data;
				const user = await prisma.user.findUnique({ where: { email } });
				if (!user) return null;
				const ok = await bcrypt.compare(password, user.hashedPassword);
				if (!ok) return null;
				return { id: user.id, email: user.email, name: user.name, image: user.image ?? undefined };
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user && "id" in user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token?.id) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(session.user as any).id = token.id as string;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};


