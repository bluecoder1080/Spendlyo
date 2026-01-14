import { ChatInterface } from "@/components/chat/chat-interface"

export default function ChatPage() {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Chat</h2>
      </div>
      <ChatInterface />
    </div>
  )
}
