import Link from "next/link";
import { prisma } from "@/lib/db";
import MessageOwnerButton from "./MessageOwnerButton";
import { MapPin, Tag, Calendar, User } from "lucide-react";

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const item = await prisma.item.findUnique({
		where: { id },
		include: { owner: true }
	});
	if (!item) return <div className="max-w-3xl mx-auto p-4">Item not found</div>;

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Image Gallery */}
						<div className="p-8">
							<div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
								{Array.isArray(item.photos) && item.photos.length > 0 ? (
									<img 
										src={item.photos[0]} 
										alt={item.title}
										className="w-full h-full object-cover rounded-xl"
									/>
								) : (
									<div className="text-center text-gray-400">
										<div className="text-6xl mb-4">📦</div>
										<p className="text-lg">No image available</p>
									</div>
								)}
							</div>
						</div>
						
						{/* Item Details */}
						<div className="p-8 space-y-6">
							<div className="flex items-center gap-4 mb-6">
								<Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
									← Back
								</Link>
								<div className="flex-1">
									<h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
									<div className="flex items-center gap-3">
										<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
											<Tag className="h-3 w-3" />
											{item.category}
										</span>
										<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
											{item.exchangeType}
										</span>
									</div>
								</div>
							</div>
							
							<div className="prose max-w-none">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
								<p className="text-gray-700 leading-relaxed text-lg">{item.description}</p>
							</div>

							{item.exchangeType === "TRADE" && item.tradeFor && (
								<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
									<h4 className="font-semibold text-yellow-800 mb-2">Looking for:</h4>
									<p className="text-yellow-700">{item.tradeFor}</p>
								</div>
							)}
							
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="bg-gray-50 rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
										<MapPin className="h-4 w-4 text-blue-600" />
										Location
									</h4>
									<p className="text-sm text-gray-600">{item.lat}, {item.lng}</p>
								</div>
								
								<div className="bg-gray-50 rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
										<User className="h-4 w-4 text-green-600" />
										Owner
									</h4>
									<p className="text-sm text-gray-600">{item.owner.name}</p>
								</div>
								
								<div className="bg-gray-50 rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
										<Calendar className="h-4 w-4 text-purple-600" />
										Posted
									</h4>
									<p className="text-sm text-gray-600">
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