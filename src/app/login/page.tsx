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
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
				<div className="text-center mb-8">
					<Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
						<ArrowLeft className="h-4 w-4" />
						Back to home
					</Link>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
					<p className="text-gray-600">Sign in to your account</p>
				</div>

				<div className="space-y-6">
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
							<Mail className="h-4 w-4" />
							Email
						</label>
						<input 
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
							placeholder="your@email.com" 
							value={email} 
							onChange={(e)=>setEmail(e.target.value)} 
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
							<Lock className="h-4 w-4" />
							Password
						</label>
						<input 
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
							placeholder="••••••••" 
							type="password" 
							value={password} 
							onChange={(e)=>setPassword(e.target.value)} 
						/>
					</div>

					<button 
						className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50" 
						onClick={submit} 
						disabled={loading}
					>
						<LogIn className="h-4 w-4" />
						{loading ? "Signing in..." : "Sign In"}
					</button>

					<div className="text-center">
						<p className="text-gray-600">
							Don't have an account?{" "}
							<Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}