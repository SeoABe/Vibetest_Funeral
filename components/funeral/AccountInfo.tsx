"use client"

import { useState } from "react"

interface Account {
  id: string
  bank: string
  holder: string
  number: string
  relation: string
  displayMode: "tapToReveal" | "visible"
}

interface Props {
  accounts: Account[]
}

function AccountCard({ account }: { account: Account }) {
  const [revealed, setRevealed] = useState(account.displayMode === "visible")
  const [copied, setCopied] = useState(false)

  async function copyAccount() {
    const text = `${account.bank} ${account.number} ${account.holder}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {account.bank}
          </span>
          {account.relation && (
            <span className="ml-2 text-xs" style={{ color: "var(--text-muted)" }}>
              {account.relation}
            </span>
          )}
        </div>
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{account.holder}</span>
      </div>

      {revealed ? (
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-base font-medium tracking-wide"
            style={{ color: "var(--text-primary)" }}
          >
            {account.number}
          </span>
          <button
            onClick={copyAccount}
            className="px-3 py-1.5 rounded-lg text-sm transition-colors min-h-[36px]"
            style={{
              backgroundColor: copied ? "var(--bg-elevated)" : "var(--accent)",
              color: copied ? "var(--accent)" : "#1a1a1a",
            }}
          >
            {copied ? "복사됨 ✓" : "복사"}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-2 rounded-lg text-sm transition-colors min-h-[44px]"
          style={{
            backgroundColor: "var(--bg-elevated)",
            color: "var(--text-muted)",
            border: "1px dashed var(--border)",
          }}
        >
          탭하여 계좌번호 확인
        </button>
      )}
    </div>
  )
}

export default function AccountInfo({ accounts }: Props) {
  const validAccounts = accounts.filter((a) => a.bank && a.number)
  if (validAccounts.length === 0) return null

  return (
    <section id="accounts" className="px-5 py-6" style={{ borderTop: "1px solid var(--border)" }}>
      <h2
        className="text-lg font-semibold mb-4"
        style={{ color: "var(--accent)", fontFamily: "var(--font-serif)" }}
      >
        조의금 계좌
      </h2>

      <div className="flex flex-col gap-3">
        {validAccounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
        ※ 조의금 송금은 개인 간 금융 거래이며, 본 서비스는 송금을 대행하지 않습니다.
      </p>
    </section>
  )
}
