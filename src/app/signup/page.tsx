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
		<div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
				<div className="text-center mb-8">
					<Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
						<ArrowLeft className="h-4 w-4" />
						Back to home
					</Link>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Join the Community</h1>
					<p className="text-gray-600">Create your account to start sharing</p>
				</div>

				<div className="space-y-6">
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
							<User className="h-4 w-4" />
							Full Name
						</label>
						<input 
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
							placeholder="John Doe" 
							value={name} 
							onChange={(e)=>setName(e.target.value)} 
						/>
					</div>

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
						className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50" 
						onClick={submit} 
						disabled={loading}
					>
						<UserPlus className="h-4 w-4" />
						{loading ? "Creating..." : "Create Account"}
					</button>

					<div className="text-center">
						<p className="text-gray-600">
							Already have an account?{" "}
							<Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}