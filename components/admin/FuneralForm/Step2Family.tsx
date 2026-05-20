"use client"

import type { FuneralFormData, FamilyMember } from "./types"

interface Props {
  data: FuneralFormData
  onChange: (patch: Partial<FuneralFormData>) => void
}

export default function Step2Family({ data, onChange }: Props) {
  function updateMember(i: number, patch: Partial<FamilyMember>) {
    const next = data.familyList.map((m, idx) => (idx === i ? { ...m, ...patch } : m))
    onChange({ familyList: next })
  }

  function addMember() {
    onChange({ familyList: [...data.familyList, { relation: "", name: "" }] })
  }

  function removeMember(i: number) {
    onChange({ familyList: data.familyList.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        2단계 — 상주/가족 정보
      </h2>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          대표 상주 *
        </label>
        <input
          type="text"
          value={data.chiefMourner}
          onChange={(e) => onChange({ chiefMourner: e.target.value })}
          required
          placeholder="예: 김도윤"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          가족 목록
        </label>

        {data.familyList.map((m, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={m.relation}
              onChange={(e) => updateMember(i, { relation: e.target.value })}
              placeholder="관계 (예: 아들)"
              className={inputClass}
              style={{ ...inputStyle, width: "120px", flexShrink: 0 }}
            />
            <input
              type="text"
              value={m.name}
              onChange={(e) => updateMember(i, { name: e.target.value })}
              placeholder="이름"
              className={`${inputClass} flex-1`}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => removeMember(i)}
              className="shrink-0 text-sm px-3 py-3 rounded-lg min-h-[44px] min-w-[44px]"
              style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addMember}
          className="text-sm py-2 rounded-lg transition-colors min-h-[44px]"
          style={{ color: "var(--accent)", border: "1px dashed var(--accent)" }}
        >
          + 가족 추가
        </button>
      </div>
    </div>
  )
}

const inputClass = "rounded-lg px-4 py-3 text-base outline-none"
const inputStyle = {
  backgroundColor: "var(--bg-elevated)",
  color: "var(--text-primary)",
  border: "1px solid var(--border)",
}
