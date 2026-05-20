"use client"

import { useState } from "react"

interface Props {
  funeralId: string
  label: string
}

export default function PrivateMessageSection({ funeralId, label }: Props) {
  const [password, setPassword] = useState("")
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/private-message/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funeralId, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setContent(data.content)
      } else {
        setError(data.error ?? "오류가 발생했습니다.")
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="memorial-section px-5 py-6">
      <h2
        className="text-lg font-semibold mb-1"
        style={{ color: "var(--accent)", fontFamily: "var(--font-serif)" }}
      >
        {label}
      </h2>
      <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
        가족만 열람할 수 있는 개인 메시지입니다. 비밀번호를 입력해주세요.
      </p>

      {content === null ? (
        <form onSubmit={handleUnlock} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[44px]"
            style={{
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          />

          {error && (
            <p className="text-sm" style={{ color: "#e05c5c" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px]"
            style={{
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
              opacity: loading || !password.trim() ? 0.5 : 1,
            }}
          >
            {loading ? "확인 중…" : "열람하기"}
          </button>
        </form>
      ) : (
        <div>
          <p
            className="text-base leading-relaxed whitespace-pre-wrap"
            style={{ color: "var(--text-secondary)" }}
          >
            {content}
          </p>
          <p className="text-xs mt-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
            이 메시지는 고인의 개인적인 뜻이며 법적 효력이 없습니다.
          </p>
        </div>
      )}
    </section>
  )
}
