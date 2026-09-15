import React, { useState } from "react";
import { INITIAL_CHAT_MESSAGES } from "../data/initialChat";
import { ChatMessage, StudentProfile } from "../types";
import { Send, Sparkles, MessageSquare, ThumbsUp, HelpCircle, Bot, User } from "lucide-react";

interface StudyGroupChatProps {
  profile: StudentProfile;
}

export default function StudyGroupChat({ profile }: StudyGroupChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const quickPrompts = [
    "How do I use the P.E.E. technique on 10-mark questions?",
    "Why are near-misses classified as reactive monitoring?",
    "What are the 4 key sections of a Permit-to-Work (PTW)?",
    "What are the 3 pillars of health and safety?"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: `${profile.name} (You)`,
      role: "student",
      avatar: "🎓",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      likes: 0,
      tag: "Question"
    };

    const updated = [...messages, userMessage];
    setMessages(updated);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated,
          userContext: {
            userName: profile.name,
            level: profile.level,
            streakDays: profile.streakDays,
          },
        }),
      });

      const data = await res.json();
      if (data?.reply) {
        const tutorMessage: ChatMessage = {
          id: `msg_ai_${Date.now()}`,
          sender: "Dr. Phelpstead (Lead HSE Tutor)",
          role: "tutor",
          avatar: "👨‍🏫",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          likes: 2,
          tag: "Tutor Feedback"
        };
        setMessages((prev) => [...prev, tutorMessage]);
      }
    } catch (err) {
      console.error("Chat fetch error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLike = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likes: (m.likes || 0) + 1 } : m))
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header Info - Compact & Smart */}
      <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-700/60 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live Study Room • 24 Students Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            HSE Collaborative Study Cohort
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Discuss difficult concepts with fellow peers and get instant guidance from Dr. Phelpstead (Lead Tutor).
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-400" />
          <span>AI Tutor Ready</span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-hidden flex flex-col h-[540px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => {
            const isTutor = msg.role === "tutor";
            const isMe = msg.sender.includes("(You)");

            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs leading-relaxed max-w-3xl ${
                  isMe ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <div className="text-2xl shrink-0 mt-0.5">{msg.avatar}</div>

                <div
                  className={`p-4 rounded-2xl border space-y-1.5 shadow-sm ${
                    isTutor
                      ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60 text-slate-900 dark:text-slate-100"
                      : isMe
                      ? "bg-rose-600 border-rose-600 text-white"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span>{msg.sender}</span>
                      {msg.tag && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                            isMe
                              ? "bg-white/20 text-white"
                              : isTutor
                              ? "bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {msg.tag}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] ${isMe ? "text-rose-200" : "text-slate-400"}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  <p className="whitespace-pre-line text-xs md:text-sm font-normal">
                    {msg.content}
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleLike(msg.id)}
                      className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded transition ${
                        isMe
                          ? "hover:bg-rose-700 text-white"
                          : "hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{msg.likes || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
              <span className="text-lg">👨‍🏫</span>
              <span>Dr. Phelpstead is typing exam guidance...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap pl-1">
            Quick Inquiries:
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="py-1 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] whitespace-nowrap hover:border-rose-400 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask a question about HSE syllabus, command words, or scenario exams..."
            className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
