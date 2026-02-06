"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <h1 className="text-4xl font-bold mb-8 sm:text-5xl">Hello, World!</h1>
      
      <div className="w-full max-w-2xl flex flex-col flex-1 border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[60vh]">
          {messages.length === 0 && (
            <p className="text-gray-500 text-center mt-8">
              Start a conversation! Type a message below.
            </p>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-800">
                <p className="animate-pulse">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
        <form onSubmit={sendMessage} className="border-t border-gray-300 p-4 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
