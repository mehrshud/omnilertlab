"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

const WELCOME: Message = {
  role: "assistant",
  id: "welcome",
  content: "Hey 👋 I'm OmnilertBot. Ask me anything about Mehrshad's work, skills, or projects.",
};

// Generate a simple visitor session ID
const SESSION_ID = Math.random().toString(36).slice(2, 9);

export function ChatWidget() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [mode, setMode]         = useState<"ai" | "telegram">("ai");
  const panelRef   = useRef<HTMLDivElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  const openPanel = () => {
    setOpen(true);
    setTimeout(() => {
      gsap.from(panelRef.current, {
        scale: 0.9, opacity: 0, y: 20, duration: 0.4, ease: "back.out(1.7)",
      });
      inputRef.current?.focus();
    }, 10);
  };

  const closePanel = () => {
    gsap.to(panelRef.current, {
      scale: 0.9, opacity: 0, y: 20, duration: 0.25, ease: "power2.in",
      onComplete: () => setOpen(false),
    });
  };

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: text, id: Date.now().toString() };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    if (mode === "ai") {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        const data = await res.json();
        const reply = data.reply ?? "Sorry, I couldn't get a response right now.";
        setMessages((m) => [...m, { role: "assistant", content: reply, id: Date.now().toString() }]);
      } catch {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Network error — try again.", id: Date.now().toString() },
        ]);
      }
    } else {
      // Telegram mode
      try {
        await fetch("/api/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, visitorId: SESSION_ID }),
        });
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: "✅ Message sent to Mehrshad via Telegram. He'll reply shortly!",
            id: Date.now().toString(),
          },
        ]);
      } catch {
        setMessages((m) => [...m, { role: "assistant", content: "Failed to send.", id: Date.now().toString() }]);
      }
    }
    setLoading(false);
  }, [input, loading, messages, mode]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* ── Floating toggle button ─────────────────────── */}
      <button
        onClick={open ? closePanel : openPanel}
        aria-label={open ? "Close chat" : "Open AI chat"}
        data-cursor="Chat"
        style={{
          position: "fixed",
          bottom: 32, right: 32,
          zIndex: 800,
          width: 52, height: 52,
          borderRadius: "50%",
          background: "var(--color-accent)",
          border: "none",
          color: "#fff",
          fontSize: 22,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(123,97,255,0.4)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.12, duration: 0.3 })}
        onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3 })}
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* ── Chat panel ─────────────────────────────────── */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="OmnilertBot chat"
          style={{
            position: "fixed",
            bottom: 96, right: 32,
            zIndex: 799,
            width: "min(380px, calc(100vw - 48px))",
            height: 520,
            borderRadius: 20,
            background: "rgba(10,10,20,0.88)",
            border: "1px solid var(--color-border)",
            backdropFilter: "blur(32px)",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--color-accent), #5eead4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14,
                }}
              >
                🤖
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>OmnilertBot</p>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#28c840" }} />
                  <span className="label">Online</span>
                </div>
              </div>
            </div>

            {/* Mode toggle */}
            <div style={{ display: "flex", gap: 4 }}>
              {(["ai", "telegram"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    background: mode === m ? "var(--color-accent)" : "transparent",
                    border: "1px solid var(--color-border)",
                    borderRadius: 6, padding: "3px 10px",
                    fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "var(--color-text)",
                    cursor: "pointer",
                  }}
                >
                  {m === "ai" ? "AI" : "📲"}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div
            style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}
            aria-live="polite"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "82%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.role === "user"
                    ? "var(--color-accent)"
                    : "rgba(255,255,255,0.06)",
                  border: msg.role === "assistant" ? "1px solid var(--color-border)" : "none",
                  fontSize: 13, lineHeight: 1.6,
                }}
              >
                {msg.content}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "10px 14px",
                  borderRadius: "16px 16px 16px 4px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--color-border)",
                  display: "flex", gap: 4,
                }}
                aria-label="Bot is typing"
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "var(--color-muted)",
                      animation: `blink 1.2s ${i * 0.2}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid var(--color-border)",
              display: "flex", gap: 8, alignItems: "center",
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={mode === "ai" ? "Ask OmnilertBot…" : "Message Mehrshad directly…"}
              aria-label="Chat message input"
              style={{
                flex: 1, background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--color-border)",
                borderRadius: 10, padding: "9px 14px",
                color: "var(--color-text)", fontSize: 13,
                fontFamily: "var(--font-sans)",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: loading || !input.trim() ? "var(--color-border)" : "var(--color-accent)",
                border: "none", color: "#fff", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
