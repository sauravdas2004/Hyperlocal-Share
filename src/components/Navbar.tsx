import Link from "next/link";
import { Plus, MessageSquare, User, LogIn, MapPin } from "lucide-react";

export default function Navbar() {
	return (
		<header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md shadow-[var(--shadow-sm)]">
			<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
				<Link
					href="/"
					className="text-xl font-bold tracking-tight text-[var(--foreground)] hover:text-[var(--brand)] transition-colors flex items-center gap-2"
				>
					<span className="w-8 h-8 rounded-lg bg-[var(--brand)] text-white flex items-center justify-center text-sm font-extrabold">
						H
					</span>
					Hyperlocal
				</Link>
				<nav className="flex items-center gap-1">
					<Link
						href="/items/new"
						className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] text-[var(--muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-muted)]/50 transition-colors text-sm font-medium"
					>
						<Plus className="h-4 w-4" />
						New Item
					</Link>
					<Link
						href="/map"
						className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] text-[var(--muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-muted)]/50 transition-colors text-sm font-medium"
					>
						<MapPin className="h-4 w-4" />
						Map
					</Link>
					<Link
						href="/inbox"
						className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] text-[var(--muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-muted)]/50 transition-colors text-sm font-medium"
					>
						<MessageSquare className="h-4 w-4" />
						Inbox
					</Link>
					<Link
						href="/signup"
						className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm font-medium"
					>
						<User className="h-4 w-4" />
						Sign Up
					</Link>
					<Link
						href="/login"
						className="flex items-center gap-2 bg-[var(--brand)] text-white px-4 py-2.5 rounded-[var(--radius)] hover:bg-[var(--brand-hover)] shadow-[var(--shadow)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-0.5 transition-all duration-200 text-sm font-medium"
					>
						<LogIn className="h-4 w-4" />
						Log In
					</Link>
				</nav>
			</div>
		</header>
	);
}
