"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { ArrowLeft, Mail, Lock, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	async function submit() {
		setLoading(true);
		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: true,
				callbackUrl: "/",
			});
			if ((result as any)?.error) alert("Invalid credentials");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--brand-muted)]/30 via-[var(--background)] to-[var(--accent-muted)]/20">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(13,148,136,0.08),transparent)]" />
			<div className="relative w-full max-w-md">
				<div className="bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--border)] p-8">
					<div className="text-center mb-8">
						<Link
							href="/"
							className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] mb-6 transition-colors text-sm font-medium"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to home
						</Link>
						<h1 className="text-2xl font-bold text-[var(--foreground)] mb-1 tracking-tight">
							Welcome back
						</h1>
						<p className="text-[var(--muted)] text-sm">Sign in to your account</p>
					</div>

					<div className="space-y-5">
						<div className="space-y-2">
							<label className="text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
								<Mail className="h-4 w-4 text-[var(--brand)]" />
								Email
							</label>
							<input
								className="input-base"
								placeholder="your@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
								<Lock className="h-4 w-4 text-[var(--brand)]" />
								Password
							</label>
							<input
								className="input-base"
								placeholder="••••••••"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<button
							className="btn-primary w-full"
							onClick={submit}
							disabled={loading}
						>
							<LogIn className="h-4 w-4" />
							{loading ? "Signing in..." : "Sign In"}
						</button>
						<p className="text-center text-sm text-[var(--muted)]">
							Don&apos;t have an account?{" "}
							<Link href="/signup" className="text-[var(--brand)] hover:underline font-medium">
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
