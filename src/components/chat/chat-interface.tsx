"use client"

import { useEffect, useRef, useState } from "react"
import { useMessageStore } from "@/store/useMessageStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChatInterface() {
  const { messages, fetchMessages, sendMessage, isLoading } = useMessageStore()
  const [inputValue, setInputValue] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim()) return
    await sendMessage(inputValue)
    setInputValue("")
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-background shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && messages.length === 0 && (
             <div className="text-center text-muted-foreground text-sm">Loading chat...</div>
        )}
        {messages.length === 0 && !isLoading && (
            <div className="text-center text-muted-foreground text-sm flex flex-col items-center justify-center h-full opacity-50">
                <p>No messages yet.</p>
                <p>Start tracking your expenses!</p>
            </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full mb-2",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-foreground rounded-bl-none"
              )}
            >
              {msg.content}
              <div className={cn("text-[10px] mt-1 opacity-70", msg.role === 'user' ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 border-t flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="New expense... (e.g. 'Lunch 350')"
          className="flex-1"
        />
        <Button size="icon" onClick={handleSend} disabled={!inputValue.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
