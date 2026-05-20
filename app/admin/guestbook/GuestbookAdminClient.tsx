"use client"

import { useState } from "react"

interface Item {
  id: string
  authorName: string
  message: string
  createdAt: string
  deceasedName: string
  slug: string
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

export default function GuestbookAdminClient({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems)
  const [busy, setBusy] = useState<string | null>(null)

  async function approve(id: string) {
    setBusy(id)
    try {
      const res = await fetch(`/api/guestbook/${id}/approve`, { method: "PATCH" })
      if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id))
    } finally {
      setBusy(null)
    }
  }

  async function remove(id: string) {
    setBusy(id)
    try {
      const res = await fetch(`/api/guestbook/${id}`, { method: "DELETE" })
      if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id))
    } finally {
      setBusy(null)
    }
  }

  if (items.length === 0) {
    return <p style={{ color: "var(--text-muted)" }}>승인 대기 중인 방명록이 없습니다.</p>
  }

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-xl p-4"
          style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {item.deceasedName} 님 부고 · {fmtDate(item.createdAt)}
            </span>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
            {item.authorName}
          </p>
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            {item.message}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => approve(item.id)}
              disabled={busy === item.id}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium min-h-[44px] transition-colors"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--bg-primary)",
                opacity: busy === item.id ? 0.5 : 1,
              }}
            >
              승인
            </button>
            <button
              onClick={() => remove(item.id)}
              disabled={busy === item.id}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium min-h-[44px] transition-colors"
              style={{
                backgroundColor: "var(--bg-elevated)",
                color: "#e05c5c",
                border: "1px solid var(--border)",
                opacity: busy === item.id ? 0.5 : 1,
              }}
            >
              삭제
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
