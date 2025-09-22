import Link from "next/link";
import { Plus, MessageSquare, User, LogIn, MapPin } from "lucide-react";

export default function Navbar() {
	return (
		<header className="bg-white shadow-sm border-b sticky top-0 z-50">
			<div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
				<Link href="/" className="text-2xl font-bold text-blue-600">
					Hyperlocal
				</Link>
				<nav className="flex items-center gap-6">
					<Link href="/items/new" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
						<Plus className="h-4 w-4" />
						New Item
					</Link>
					<Link href="/map" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
						<MapPin className="h-4 w-4" />
						Map
					</Link>
					<Link href="/inbox" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
						<MessageSquare className="h-4 w-4" />
						Inbox
					</Link>
					<Link href="/signup" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
						<User className="h-4 w-4" />
						Sign Up
					</Link>
					<Link href="/login" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
						<LogIn className="h-4 w-4" />
						Log In
					</Link>
				</nav>
			</div>
		</header>
	);
}