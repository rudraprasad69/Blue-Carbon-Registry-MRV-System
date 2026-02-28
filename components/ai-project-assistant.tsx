"use client"

import { useState, useRef, useEffect } from "react"
import { getAIProjectAssistant, ProjectData } from "@/lib/ai-project-assistant"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, User, Bot, Sparkles } from "lucide-react"

export function AiProjectAssistant() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const assistant = getAIProjectAssistant()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    const response = await assistant.answerQuery(input)
    
    const assistantMessage = { role: 'assistant' as const, content: response.response }
    setMessages(prev => [...prev, assistantMessage])
    setLoading(false)
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages])

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          AI Project Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                <div className={`p-3 rounded-lg max-w-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && <User className="h-6 w-6 text-muted-foreground flex-shrink-0" />}
              </div>
            ))}
             {loading && (
                <div className="flex items-start gap-3">
                    <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                    <div className="p-3 rounded-lg bg-muted"><Sparkles className="h-5 w-5 animate-pulse" /></div>
                </div>
             )}
          </div>
        </ScrollArea>
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about projects, market trends, or prices..."
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
