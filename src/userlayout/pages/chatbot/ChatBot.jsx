import React, { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";

const renderText = (text) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s\n]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      const productMatch = part.match(/\/product\/([a-f0-9]+)/);
      const workshopMatch = part.match(/\/workshop(?:det)?\/([a-f0-9]+)/);
      const id = productMatch?.[1] || workshopMatch?.[1];
      const isProduct = !!productMatch;

      if (id) {
        const path = isProduct ? `/product/${id}` : `/workshopdet/${id}`;
        return (
          <a
            key={i}
            href={path}
            className="inline-flex items-center gap-1 text-[#D84040] underline underline-offset-2 font-semibold hover:text-[#8E1616] transition-colors"
          >
            {isProduct ? "🛍 View Product" : "🎨 View Workshop"}
          </a>
        );
      }
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#D84040] underline underline-offset-2 hover:text-[#8E1616] transition-colors break-all"
        >
          {part}
        </a>
      );
    }
    return part.split("\n").map((line, j, arr) => {
      const boldParts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={`${i}-${j}`}>
          {boldParts.map((bp, k) =>
            k % 2 === 1 ? (
              <strong key={k} className="font-bold text-[#1D1616]">
                {bp}
              </strong>
            ) : (
              bp
            ),
          )}
          {j < arr.length - 1 && <br />}
        </span>
      );
    });
  });
};

const Message = ({ role, content, isStreaming }) => {
  const isUser = role === "user";
  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} items-end`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#D84040] flex items-center justify-center shrink-0 shadow-sm">
          <SparklesIcon className="h-4 w-4 text-white" />
        </div>
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "bg-[#D84040] text-white rounded-br-sm"
            : "bg-white text-gray-700 rounded-bl-sm border border-[#D84040]/10"
        }`}
      >
        {isUser ? (
          <p>{content}</p>
        ) : (
          <p className="whitespace-pre-wrap">
            {renderText(content)}
            {isStreaming && (
              <span className="inline-block w-1.5 h-4 bg-[#D84040] ml-0.5 animate-pulse rounded-sm align-middle" />
            )}
          </p>
        )}
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex gap-3 items-end">
    <div className="w-8 h-8 rounded-full bg-[#D84040] flex items-center justify-center shrink-0 shadow-sm">
      <SparklesIcon className="h-4 w-4 text-white" />
    </div>
    <div className="bg-white rounded-2xl rounded-bl-sm border border-[#D84040]/10 px-4 py-3 shadow-sm">
      <div className="flex gap-1 items-center h-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-[#D84040] rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

const SUGGESTIONS = [
  "What products do you have?",
  "Show me upcoming workshops",
  "What are Aswani products?",
  "What's the price range?",
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "مرحباً! 👋 Hi! I'm your Turathna assistant. I can help you explore our handcrafted products and workshops. What are you looking for?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const sendMessage = async (userText) => {
    const text = (userText || input).trim();
    if (!text || isLoading) return;

    setError(null);
    setInput("");

    const userMsg = { role: "user", content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      abortRef.current = new AbortController();

      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = token;

      const res = await fetch("http://localhost:5000/api/v1/chatbot/", {
        method: "POST",
        headers,
        signal: abortRef.current.signal,
        body: JSON.stringify({
          messages: newHistory.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`${res.status}: ${body}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      setIsLoading(false);
      setIsStreaming(true);

      let buffer = "";
      let gotContent = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;

          const dataStr = trimmed.slice(6).trim();
          if (dataStr === "[DONE]") {
            setIsStreaming(false);
            return;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.text) {
              gotContent = true;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: updated[updated.length - 1].content + parsed.text,
                };
                return updated;
              });
            }
            if (parsed.error) throw new Error(parsed.error);
          } catch {
            // skip malformed lines
          }
        }
      }

      // If stream ended with no content
      if (!gotContent) throw new Error("Empty response from server");
    } catch (err) {
      if (err.name === "AbortError") return;

      const errMsg = err.message || "Unknown error";
      setError(errMsg);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "⚠️ Sorry, I couldn't get a response. Please try again.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([
      {
        role: "assistant",
        content:
          "مرحباً! 👋 Hi! I'm your Turathna assistant. I can help you explore our handcrafted products and workshops. What are you looking for?",
      },
    ]);
    setInput("");
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);
  };

  const showSuggestions = messages.length === 1;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#D84040] hover:bg-[#8E1616] text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ boxShadow: "0 8px 24px -4px rgba(216,64,64,0.5)" }}
        aria-label="Open chat"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{
          background: "#EEEEEE",
          height: "520px",
          boxShadow: "0 24px 64px -12px rgba(29,22,22,0.25)",
        }}
      >
        {/* Header */}
        <div className="bg-[#1D1616] px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#D84040] flex items-center justify-center shadow">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Turathna Assistant</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-gray-400 text-xs">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            title="Clear chat"
          >
            <ArrowPathIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border-b border-red-100 px-4 py-2 shrink-0">
            <p className="text-red-500 text-xs font-mono truncate">⚠ {error}</p>
          </div>
        )}

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
          style={{ scrollbarWidth: "none" }}
        >
          {messages.map((msg, i) => (
            <Message
              key={i}
              role={msg.role}
              content={msg.content}
              isStreaming={
                isStreaming &&
                i === messages.length - 1 &&
                msg.role === "assistant"
              }
            />
          ))}
          {isLoading && !isStreaming && <TypingIndicator />}

          {showSuggestions && (
            <div className="space-y-2 pt-1">
              <p className="text-xs text-gray-400 text-center">Try asking:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs bg-white border border-[#D84040]/20 text-[#8E1616] px-3 py-1.5 rounded-full hover:bg-[#D84040] hover:text-white hover:border-transparent transition-all duration-200 font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 bg-white border-t border-[#D84040]/10 shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about products or workshops..."
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none bg-[#EEEEEE] rounded-xl px-3 py-2.5 text-sm text-[#1D1616] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#D84040]/30 disabled:opacity-50 transition-all max-h-24"
              style={{ scrollbarWidth: "none" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 bg-[#D84040] hover:bg-[#8E1616] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-300 mt-2">
            Powered by Turathna AI
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
