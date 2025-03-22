"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type ChatMessageProps = {
  message: string
  isUser: boolean
}

export function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>
        <Avatar className="h-8 w-8">
          {isUser ? (
            <>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </>
          ) : (
            <>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
              <AvatarFallback>AI</AvatarFallback>
            </>
          )}
        </Avatar>
        <div className={`p-3 rounded-lg ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        </div>
      </div>
    </div>
  )
}

