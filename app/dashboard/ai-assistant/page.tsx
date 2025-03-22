"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, Send, StopCircle } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function AIAssistantPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I can help you schedule your tennis and padel lessons. Just tell me your availability and preferences.",
    },
  ])
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: input,
        system:
          "You are an AI assistant for a tennis and padel lesson booking platform. Help users schedule lessons based on their availability and preferences. Suggest optimal times for lessons and help organize their calendar.",
      })

      setMessages((prev) => [...prev, { role: "assistant", content: text }])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request. Please try again.",
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Implement speech recognition logic here
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">Get help with scheduling and managing your lessons</p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Generator</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="mt-6">
          <Card className="h-[calc(100vh-250px)] flex flex-col">
            <CardHeader>
              <CardTitle>Chat with AI Assistant</CardTitle>
              <CardDescription>Ask questions or get help with scheduling</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message.content} isUser={message.role === "user"} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <div className="flex w-full items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleRecording}
                  className={isRecording ? "text-red-500" : ""}
                >
                  {isRecording ? <StopCircle /> : <Mic />}
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isProcessing}
                />
                <Button onClick={handleSendMessage} disabled={!input.trim() || isProcessing}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Schedule Generator</CardTitle>
              <CardDescription>Let AI create an optimal schedule based on your availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Describe your availability and preferences, and our AI will generate an optimal schedule for your
                  lessons.
                </p>
                <textarea
                  className="w-full min-h-[200px] p-4 rounded-md border"
                  placeholder="Example: I'm available on Mondays and Wednesdays from 4-8pm, and Saturday mornings. I prefer to teach advanced students in the evenings and beginners in the morning. I need a 30-minute break between lessons."
                ></textarea>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Clear</Button>
              <Button>Generate Schedule</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

