"use client";
import { useEffect, useRef, useState } from "react";

type Message = { sender: "user" | "bot"; text: string };

export default function FAQChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const safePush = (msg: Message) => setMessages((prev) => [...prev, msg]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    // push user message
    safePush({ sender: "user", text });
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      // If backend returns non-JSON (or error), get text for debugging
      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText);
        safePush({ sender: "bot", text: `Error: ${errText || "Request failed"}` });
        return;
      }

      // try parse json safely
      let data: any;
      try {
        data = await res.json();
      } catch (e) {
        const txt = await res.text().catch(() => "");
        console.error(e)
        safePush({ sender: "bot", text: `Invalid response: ${txt || "no body"}` });
        return;
      }

      const answer = data?.answer ?? data?.error ?? "Sorry, no answer available.";
      safePush({ sender: "bot", text: String(answer) });
    } catch (err) {
      console.error("Chat fetch error:", err);
      safePush({ sender: "bot", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) sendMessage();
    }
  };

  const clearChat = () => setMessages([]);

  // Minimized state icon
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open support chat"
        className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[320px] sm:w-[380px] ">
      <div className="flex flex-col h-[520px] bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">IX</div>
            <div>
              <div className="text-sm font-semibold">Intervuex Support</div>
              <div className="text-xs text-gray-200">FAQ bot</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              title="Clear chat"
              className="px-2 py-1 text-xs bg-white text-black rounded hover:bg-gray-100 cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              title="Minimize"
              className="px-2 py-1 text-lg font-bold bg-transparent hover:text-gray-300 cursor-pointer"
            >
              _
            </button>
          </div>
        </div>

        {/* Messages area (fixed size with scrollbar) */}
        <div
          ref={scrollRef}
          className="flex-1 p-3 bg-gray-50 overflow-y-auto space-y-3"
          style={{ scrollbarWidth: "thin" }}
        >
          {messages.length === 0 && (
            <div className="text-sm text-gray-600">
              Ask me about scheduling, joining, recording, or deleting interviews.
            </div>
          )}

          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`max-w-[85%] px-3 py-2 rounded-lg break-words ${
                m.sender === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-white border border-gray-200 text-black"
              }`}
            >
              {m.text}
            </div>
          ))}

          {loading && <div className="text-sm text-gray-600 italic">Thinking...</div>}
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-gray-200 bg-white flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 border border-gray-300 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Ask question"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-4 py-2 rounded-lg cursor-pointer bg-blue-600 text-white disabled:opacity-60 hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
