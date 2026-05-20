"use client"

import type { FuneralFormData, Account } from "./types"

interface Props {
  data: FuneralFormData
  onChange: (patch: Partial<FuneralFormData>) => void
}

export default function Step5Accounts({ data, onChange }: Props) {
  function updateAccount(i: number, patch: Partial<Account>) {
    const next = data.accounts.map((a, idx) => (idx === i ? { ...a, ...patch } : a))
    onChange({ accounts: next })
  }

  function addAccount() {
    onChange({
      accounts: [
        ...data.accounts,
        { id: crypto.randomUUID(), bank: "", holder: "", number: "", relation: "", displayMode: "tapToReveal" },
      ],
    })
  }

  function removeAccount(i: number) {
    onChange({ accounts: data.accounts.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        5단계 — 조의금 계좌
      </h2>

      {data.accounts.map((a, i) => (
        <div
          key={a.id}
          className="flex flex-col gap-3 p-4 rounded-xl"
          style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              계좌 {i + 1}
            </span>
            <button
              type="button"
              onClick={() => removeAccount(i)}
              className="text-sm px-3 py-1 rounded-lg min-h-[36px]"
              style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
            >
              삭제
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: "var(--text-muted)" }}>은행</label>
              <input type="text" value={a.bank}
                onChange={(e) => updateAccount(i, { bank: e.target.value })}
                placeholder="예: 국민은행"
                className={inputClass} style={inputStyle} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: "var(--text-muted)" }}>관계</label>
              <input type="text" value={a.relation}
                onChange={(e) => updateAccount(i, { relation: e.target.value })}
                placeholder="예: 아들"
                className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>예금주</label>
            <input type="text" value={a.holder}
              onChange={(e) => updateAccount(i, { holder: e.target.value })}
              placeholder="예: 김도윤"
              className={inputClass} style={inputStyle} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>계좌번호</label>
            <input type="text" value={a.number}
              onChange={(e) => updateAccount(i, { number: e.target.value })}
              placeholder="예: 123-456-789012"
              className={inputClass} style={inputStyle} />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs" style={{ color: "var(--text-muted)" }}>표시 방식</label>
            <select
              value={a.displayMode}
              onChange={(e) => updateAccount(i, { displayMode: e.target.value as Account["displayMode"] })}
              className={inputClass}
              style={{ ...inputStyle, width: "auto" }}
            >
              <option value="tapToReveal">탭 후 표시 (권장)</option>
              <option value="visible">즉시 표시</option>
            </select>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addAccount}
        className="text-sm py-2 rounded-lg min-h-[44px]"
        style={{ color: "var(--accent)", border: "1px dashed var(--accent)" }}
      >
        + 계좌 추가
      </button>
    </div>
  )
}

const inputClass = "rounded-lg px-3 py-2.5 text-sm outline-none w-full"
const inputStyle = {
  backgroundColor: "var(--bg-secondary)",
  color: "var(--text-primary)",
  border: "1px solid var(--border)",
}
