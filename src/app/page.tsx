
"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import rules from "./rules.json";

type Message = {
  role: "bot" | "user";
  text: string;
};

const quickTopics = [
  { label: "Menu", message: "menu" },
  { label: "Deals", message: "deals" },
  { label: "Timings", message: "timings" },
  { label: "Location", message: "location" },
  { label: "Delivery", message: "delivery" },
  { label: "Payment", message: "payment" },
];

const fallbackReply =
  "Sorry, I didn't quite understand that. 😊 You can ask me about our menu, deals, timings, location, delivery, payment, or how to order.";

function findReply(userMessage: string): string {
  const message = userMessage.toLowerCase().trim();

  // Check specific topics first. The greeting rule is last in rules.json.
  for (const rule of rules) {
    const matched = rule.keywords.some((keyword) => {
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const wholeWordPattern = new RegExp(`\\b${escapedKeyword}\\b`, "i");
      return wholeWordPattern.test(message);
    });

    if (matched) {
      return rule.reply;
    }
  }

  return fallbackReply;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Assalam-o-Alaikum! 👋 Welcome to Desi Bites — your demo restaurant chatbot in Sargodha.\n\nI can help you explore our menu, deals, opening hours, location, delivery, and payment options.\n\nHow can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  function sendMessage(messageText: string) {
    const text = messageText.trim();

    if (!text || isTyping) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      { role: "user", text },
    ]);
    setInput("");
    setIsTyping(true);

    const reply = findReply(text);

    window.setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        { role: "bot", text: reply },
      ]);
      setIsTyping(false);
    }, 500);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <main className="min-h-screen bg-orange-50 px-3 py-5 text-stone-800 sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl">
        {/* Restaurant header */}
        <header className="bg-orange-600 px-5 py-5 text-white sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl">
              🍔
            </div>

            <div>
              <h1 className="text-xl font-bold sm:text-2xl">
                Desi Bites
              </h1>
              <p className="mt-1 text-sm text-orange-100">
                Restaurant Chatbot · Sargodha
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-orange-50">
            <span className="h-2 w-2 rounded-full bg-green-300" />
            Online · Ready to help
          </div>
        </header>

        {/* Quick topic buttons */}
        <section className="border-b border-orange-100 bg-orange-50/70 px-4 py-4 sm:px-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-500">
            Quick questions
          </p>

          <div className="flex flex-wrap gap-2">
            {quickTopics.map((topic) => (
              <button
                key={topic.label}
                type="button"
                disabled={isTyping}
                onClick={() => sendMessage(topic.message)}
                className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-700 transition hover:border-orange-500 hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {topic.label}
              </button>
            ))}
          </div>
        </section>

        {/* Chat messages */}
        <section
          aria-live="polite"
          aria-label="Chat messages"
          className="flex flex-1 flex-col gap-4 overflow-y-auto bg-white px-4 py-5 sm:px-6"
        >
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.role === "bot" && (
                <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm">
                  🍔
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[80%] ${
                  message.role === "user"
                    ? "rounded-br-sm bg-orange-600 text-white"
                    : "rounded-bl-sm border border-orange-100 bg-orange-50 text-stone-800"
                }`}
              >
                <p className="whitespace-pre-line break-words">
                  {message.text}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm">
                🍔
              </div>

              <div className="rounded-2xl rounded-bl-sm border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-stone-500">
                <span className="animate-pulse">Typing...</span>
              </div>
            </div>
          )}
        </section>

        {/* Message input */}
        <footer className="border-t border-orange-100 bg-white p-4 sm:p-5">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about our menu, deals..."
              aria-label="Type your message"
              disabled={isTyping}
              className="min-w-0 flex-1 rounded-full border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </form>

          <p className="mt-3 text-center text-xs text-stone-400">
            Desi Bites demo · Automated rule-based replies
          </p>
        </footer>
      </div>
    </main>
  );
}
