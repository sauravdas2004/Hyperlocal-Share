import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import MessageOwnerButton from "./MessageOwnerButton";
import { MapPin, Tag, Calendar, User, ArrowLeft } from "lucide-react";

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const item = await prisma.item.findUnique({
		where: { id },
		include: { owner: true }
	});
	if (!item) return <div className="max-w-3xl mx-auto p-4 text-[var(--foreground)]">Item not found</div>;

	return (
		<div className="relative min-h-screen">
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow)] border border-[var(--border)] overflow-hidden">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
						{/* Image */}
						<div className="p-6 lg:p-8">
							<div className="aspect-square rounded-xl bg-gradient-to-br from-[var(--border)] to-[var(--border)]/60 overflow-hidden flex items-center justify-center relative">
								{Array.isArray(item.photos) && item.photos.length > 0 ? (
									<Image
										src={item.photos[0]}
										alt={item.title}
										fill
										className="object-cover"
										sizes="(max-width: 1024px) 100vw, 50vw"
									/>
								) : (
									<div className="text-center text-[var(--muted)]">
										<div className="text-5xl mb-3">📦</div>
										<p className="text-sm font-medium">No image available</p>
									</div>
								)}
							</div>
						</div>

						{/* Details */}
						<div className="p-6 lg:p-8 flex flex-col">
							<div className="flex items-start gap-4 mb-6">
								<Link
									href="/"
									className="p-2 rounded-[var(--radius)] text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)] transition-colors shrink-0"
								>
									<ArrowLeft className="h-5 w-5" />
								</Link>
								<div className="min-w-0 flex-1">
									<h1 className="text-2xl lg:text-3xl font-bold text-[var(--foreground)] mb-3 tracking-tight">
										{item.title}
									</h1>
									<div className="flex flex-wrap gap-2">
										<span className="px-3 py-1.5 bg-[var(--brand-muted)] text-[var(--brand)] rounded-full text-sm font-medium inline-flex items-center gap-1.5">
											<Tag className="h-3.5 w-3.5" />
											{item.category}
										</span>
										<span className="px-3 py-1.5 bg-[var(--accent-muted)] text-[var(--accent)] rounded-full text-sm font-medium">
											{item.exchangeType}
										</span>
									</div>
								</div>
							</div>

							<div className="mb-6">
								<h3 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">
									Description
								</h3>
								<p className="text-[var(--foreground)] leading-relaxed">
									{item.description}
								</p>
							</div>

							{item.exchangeType === "TRADE" && item.tradeFor && (
								<div className="mb-6 p-4 rounded-[var(--radius)] bg-[var(--accent-muted)]/50 border border-[var(--accent)]/20">
									<h4 className="font-semibold text-[var(--accent)] mb-1">Looking for</h4>
									<p className="text-[var(--foreground)] text-sm">{item.tradeFor}</p>
								</div>
							)}

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
								<div className="p-4 rounded-[var(--radius)] bg-[var(--background)] border border-[var(--border)]">
									<div className="flex items-center gap-2 text-[var(--brand)] mb-1">
										<MapPin className="h-4 w-4" />
										<span className="text-xs font-semibold uppercase tracking-wider">Location</span>
									</div>
									<p className="text-sm text-[var(--muted)]">{item.lat}, {item.lng}</p>
								</div>
								<div className="p-4 rounded-[var(--radius)] bg-[var(--background)] border border-[var(--border)]">
									<div className="flex items-center gap-2 text-[var(--brand)] mb-1">
										<User className="h-4 w-4" />
										<span className="text-xs font-semibold uppercase tracking-wider">Owner</span>
									</div>
									<p className="text-sm text-[var(--muted)]">{item.owner.name}</p>
								</div>
								<div className="p-4 rounded-[var(--radius)] bg-[var(--background)] border border-[var(--border)]">
									<div className="flex items-center gap-2 text-[var(--brand)] mb-1">
										<Calendar className="h-4 w-4" />
										<span className="text-xs font-semibold uppercase tracking-wider">Posted</span>
									</div>
									<p className="text-sm text-[var(--muted)]">
										{new Date(item.createdAt).toLocaleDateString()}
									</p>
								</div>
							</div>

							<MessageOwnerButton ownerId={item.ownerId} itemId={item.id} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
