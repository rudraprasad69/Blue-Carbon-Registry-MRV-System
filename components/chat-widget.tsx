"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X } from "lucide-react"

// The static QA logic has been permanently removed.
// All intelligence is now powered dynamically by the Gemini via /api/chat.

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ from: "user" | "bot"; text: string }>>([])
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    
    // Add user message to state
    const newMessages = [...messages, { from: "user" as const, text: userMsg }]
    setMessages(newMessages)
    setInput("")

    // Indicate typing state
    setMessages((m) => [...m, { from: "bot", text: "..." }])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      setMessages((m) => {
        const msgs = [...m]
        const idx = msgs.map((x) => x.text).lastIndexOf("...")
        if (idx !== -1) {
          msgs[idx] = { from: "bot", text: data.reply || data.error }
        } else {
          msgs.push({ from: "bot", text: data.reply || data.error })
        }
        return msgs
      })

    } catch (error) {
      setMessages((m) => {
        const msgs = [...m]
        const idx = msgs.map((x) => x.text).lastIndexOf("...")
        if (idx !== -1) {
          msgs[idx] = { from: "bot", text: "A network error occurred. Please try again." }
        }
        return msgs
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="w-[350px] max-w-[90vw] h-[500px] mb-6 bg-white/90 backdrop-blur-2xl border border-white/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden animate-fade-in origin-bottom-right">
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-primary to-slate-800 text-primary-foreground border-b border-primary/20">
            <span className="font-semibold text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-secondary" /> Registry Assistant
            </span>
            <button
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" id="chat-messages">
            {messages.length === 0 && (
              <div className="text-center text-sm text-slate-500 mt-10">
                <p>Hello! How can I help you regarding</p>
                <p className="font-semibold text-primary">Blue Carbon Credits?</p>
              </div>
            )}
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={
                  m.from === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    m.from === "user"
                      ? "max-w-[85%] bg-secondary text-secondary-foreground font-medium px-4 py-2.5 rounded-2xl rounded-br-sm shadow-sm"
                      : "max-w-[85%] bg-white border border-slate-200/60 text-slate-700 px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm whitespace-pre-wrap leading-relaxed text-sm"
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-200/60 bg-white flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border border-slate-300 text-sm bg-slate-50/50 rounded-full px-4 py-2 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
              placeholder="Ask a question..."
            />
            <button
              className="bg-primary text-primary-foreground font-medium px-5 rounded-full hover:bg-primary/90 transition-all active:scale-95"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      )}
      <button
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-300 hover:scale-[1.05] hover:animate-pulse-glow hover:bg-slate-800"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  )
}

export default ChatWidget
