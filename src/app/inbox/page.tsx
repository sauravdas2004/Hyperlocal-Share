"use client";
import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Send, ArrowLeft, Users, Clock } from "lucide-react";
import Link from "next/link";

export default function InboxPage() {
	const [conversations, setConversations] = useState<any[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [messages, setMessages] = useState<any[]>([]);
	const [input, setInput] = useState("");

	useEffect(() => {
		fetch("/api/conversations").then(r=>{
			if (r.status===401) { location.href = "/login"; return []; }
			return r.json();
		}).then(setConversations).catch(console.error);
	}, []);

	useEffect(() => {
		let timer: any;
		async function load() {
			if (!selectedId) return;
			const res = await fetch(`/api/messages?conversationId=${selectedId}`);
			if (res.ok) setMessages(await res.json());
		}
		load();
		timer = setInterval(load, 3000);
		return () => clearInterval(timer);
	}, [selectedId]);

	async function send() {
		if (!selectedId || !input.trim()) return;
		const res = await fetch(`/api/messages`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ conversationId: selectedId, content: input }),
		});
		if (res.ok) {
			setInput("");
			const next = await fetch(`/api/messages?conversationId=${selectedId}`).then(r=>r.json());
			setMessages(next);
		}
	}

	const selectedConv = conversations.find(c => c.id === selectedId);

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div className="flex h-[600px]">
						{/* Conversations List */}
						<div className="w-1/3 border-r border-gray-200 bg-gray-50">
							<div className="p-4 border-b border-gray-200">
								<div className="flex items-center gap-3">
									<Link href="/" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
										<ArrowLeft className="h-4 w-4" />
									</Link>
									<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
										<MessageSquare className="h-5 w-5 text-blue-600" />
										Messages
									</h2>
								</div>
							</div>
							<div className="overflow-y-auto h-full">
								{conversations.map((c)=>{
									const others = c.participants.filter((p:any)=>p.userId!==c.participants[0].userId);
									return (
										<button 
											key={c.id} 
											onClick={()=>setSelectedId(c.id)} 
											className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-100 transition-colors ${
												selectedId===c.id ? "bg-blue-50 border-blue-200" : ""
											}`}
										>
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
													<Users className="h-5 w-5 text-blue-600" />
												</div>
												<div className="flex-1 min-w-0">
													<div className="font-medium text-gray-900 truncate">
														{c.item?.title ?? "Direct chat"}
													</div>
													<div className="text-sm text-gray-500 truncate">
														{others[0]?.user?.name ?? "Unknown user"}
													</div>
												</div>
											</div>
										</button>
									);
								})}
								{conversations.length === 0 && (
									<div className="p-8 text-center text-gray-500">
										<MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
										<p>No conversations yet</p>
										<p className="text-sm">Start by messaging an item owner</p>
									</div>
								)}
							</div>
						</div>

						{/* Chat Area */}
						<div className="flex-1 flex flex-col">
							{selectedConv ? (
								<>
									{/* Chat Header */}
									<div className="p-4 border-b border-gray-200 bg-white">
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
												<Users className="h-4 w-4 text-green-600" />
											</div>
											<div>
												<h3 className="font-semibold text-gray-900">
													{selectedConv.item?.title ?? "Direct chat"}
												</h3>
												<p className="text-sm text-gray-500">
													{selectedConv.participants.find((p:any)=>p.userId!==selectedConv.participants[0].userId)?.user?.name ?? "Unknown user"}
												</p>
											</div>
										</div>
									</div>

									{/* Messages */}
									<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
										{messages.map((m)=> (
											<div key={m.id} className="flex justify-end">
												<div className="max-w-xs lg:max-w-md px-4 py-2 bg-blue-600 text-white rounded-2xl rounded-br-sm">
													<p className="text-sm">{m.content}</p>
													<p className="text-xs text-blue-100 mt-1 flex items-center gap-1">
														<Clock className="h-3 w-3" />
														{new Date(m.createdAt).toLocaleTimeString()}
													</p>
												</div>
											</div>
										))}
										{messages.length === 0 && (
											<div className="text-center text-gray-500 py-8">
												<MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
												<p>No messages yet</p>
											</div>
										)}
									</div>

									{/* Message Input */}
									<div className="p-4 border-t border-gray-200 bg-white">
										<div className="flex gap-2">
											<input 
												className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
												placeholder="Type a message..." 
												value={input} 
												onChange={(e)=>setInput(e.target.value)}
												onKeyPress={(e) => e.key === 'Enter' && send()}
											/>
											<button 
												className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2" 
												onClick={send}
											>
												<Send className="h-4 w-4" />
											</button>
										</div>
									</div>
								</>
							) : (
								<div className="flex-1 flex items-center justify-center text-gray-500">
									<div className="text-center">
										<MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
										<p className="text-lg font-medium">Select a conversation</p>
										<p className="text-sm">Choose a chat from the sidebar to start messaging</p>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}