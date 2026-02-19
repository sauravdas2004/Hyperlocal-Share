"use client";
import { useState } from "react";
import { ArrowLeft, User, Mail, Lock, UserPlus } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	async function submit() {
		setLoading(true);
		try {
			const res = await fetch("/api/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});
			if (res.ok) {
				alert("Account created. Please log in.");
				location.href = "/login";
			} else {
				alert("Failed to sign up");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--accent-muted)]/20 via-[var(--background)] to-[var(--brand-muted)]/30">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(234,88,12,0.06),transparent)]" />
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
							Join the community
						</h1>
						<p className="text-[var(--muted)] text-sm">Create your account to start sharing</p>
					</div>

					<div className="space-y-5">
						<div className="space-y-2">
							<label className="text-sm font-medium text-[var(--foreground)] flex items-center gap-2">
								<User className="h-4 w-4 text-[var(--brand)]" />
								Full name
							</label>
							<input
								className="input-base"
								placeholder="John Doe"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
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
							<UserPlus className="h-4 w-4" />
							{loading ? "Creating..." : "Create account"}
						</button>
						<p className="text-center text-sm text-[var(--muted)]">
							Already have an account?{" "}
							<Link href="/login" className="text-[var(--brand)] hover:underline font-medium">
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
