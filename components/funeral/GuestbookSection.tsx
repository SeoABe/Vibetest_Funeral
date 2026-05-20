"use client"

import { useState, useCallback } from "react"

interface Entry {
  id: string
  authorName: string
  message: string
  createdAt: string
}

interface Props {
  funeralId: string
  initialItems: Entry[]
  initialNextCursor: string | null
  requiresApproval: boolean
  maxLength: number
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export default function GuestbookSection({
  funeralId,
  initialItems,
  initialNextCursor,
  requiresApproval,
  maxLength,
}: Props) {
  const [items, setItems] = useState<Entry[]>(initialItems)
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor)
  const [loadingMore, setLoadingMore] = useState(false)

  const [authorName, setAuthorName] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<"idle" | "ok" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMore) return
    setLoadingMore(true)
    try {
      const res = await fetch(`/api/guestbook?funeralId=${funeralId}&cursor=${nextCursor}&limit=10`)
      const data = await res.json()
      setItems((prev) => [...prev, ...data.items])
      setNextCursor(data.nextCursor)
    } finally {
      setLoadingMore(false)
    }
  }, [funeralId, nextCursor, loadingMore])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!authorName.trim() || !message.trim()) return
    setSubmitting(true)
    setSubmitResult("idle")
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funeralId, authorName: authorName.trim(), message: message.trim() }),
      })
      if (res.ok) {
        setSubmitResult("ok")
        setAuthorName("")
        setMessage("")
      } else {
        const data = await res.json()
        setErrorMsg(data.error ?? "오류가 발생했습니다.")
        setSubmitResult("error")
      }
    } catch {
      setErrorMsg("네트워크 오류가 발생했습니다.")
      setSubmitResult("error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="guestbook" className="py-6" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="px-5 mb-4">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--accent)", fontFamily: "var(--font-serif)" }}
        >
          방명록
        </h2>
      </div>

      {/* 작성 폼 */}
      <form onSubmit={handleSubmit} className="px-5 mb-6">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="이름"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={20}
            required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none min-h-[44px]"
            style={{
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          />
          <div style={{ position: "relative" }}>
            <textarea
              placeholder="삼가 고인의 명복을 빕니다."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={maxLength}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            />
            <span
              className="text-xs"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "14px",
                color: "var(--text-muted)",
              }}
            >
              {message.length}/{maxLength}
            </span>
          </div>

          {submitResult === "ok" && (
            <p className="text-sm text-center" style={{ color: "var(--accent)" }}>
              {requiresApproval
                ? "방명록이 등록되었습니다. 관리자 승인 후 공개됩니다."
                : "방명록이 등록되었습니다."}
            </p>
          )}
          {submitResult === "error" && (
            <p className="text-sm text-center" style={{ color: "#e05c5c" }}>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !authorName.trim() || !message.trim()}
            className="w-full py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px]"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--bg-primary)",
              opacity: submitting || !authorName.trim() || !message.trim() ? 0.5 : 1,
            }}
          >
            {submitting ? "등록 중…" : "방명록 남기기"}
          </button>
        </div>

        {/* 개인정보 수집 안내 */}
        <p className="text-xs mt-3 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          방명록 등록 시 이름이 수집되며, 장례 종료 후 삭제됩니다.
          이름 외 개인정보는 수집하지 않습니다.
        </p>
      </form>

      {/* 목록 */}
      {items.length === 0 ? (
        <p className="px-5 text-sm" style={{ color: "var(--text-muted)" }}>
          아직 등록된 방명록이 없습니다.
        </p>
      ) : (
        <ul className="flex flex-col">
          {items.map((entry, i) => (
            <li
              key={entry.id}
              className="px-5 py-4"
              style={{
                borderTop: i === 0 ? "1px solid var(--border)" : "none",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {entry.authorName}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }} suppressHydrationWarning>
                  {fmtDate(entry.createdAt)}
                </span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
                {entry.message}
              </p>
            </li>
          ))}
        </ul>
      )}

      {nextCursor && (
        <div className="px-5 mt-4">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="w-full py-3 rounded-xl text-sm transition-colors min-h-[44px]"
            style={{
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            {loadingMore ? "불러오는 중…" : "방명록 더 보기"}
          </button>
        </div>
      )}
    </section>
  )
}
