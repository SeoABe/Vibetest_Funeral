"use client"

import type { FuneralFormData } from "./types"

interface Props {
  data: FuneralFormData
  onChange: (patch: Partial<FuneralFormData>) => void
}

export default function Step6Settings({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        6단계 — 방명록/공개 설정
      </h2>

      <section className="flex flex-col gap-4 p-4 rounded-xl" style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>방명록 정책</p>

        <Toggle
          label="관리자 승인 후 공개"
          description="작성 직후 방명록이 즉시 공개되지 않습니다."
          checked={data.guestbookRequiresApproval}
          onChange={(v) => onChange({ guestbookRequiresApproval: v })}
        />

        <Toggle
          label="익명 작성 허용"
          description="이름 없이 방명록을 남길 수 있습니다."
          checked={data.guestbookAllowAnonymous}
          onChange={(v) => onChange({ guestbookAllowAnonymous: v })}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
            최대 글자 수
          </label>
          <input
            type="number"
            value={data.guestbookMaxLength}
            onChange={(e) => onChange({ guestbookMaxLength: parseInt(e.target.value) || 300 })}
            min={50}
            max={1000}
            className="rounded-lg px-4 py-3 text-base outline-none w-32"
            style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 p-4 rounded-xl" style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>공개 설정</p>

        <Toggle
          label="즉시 공개"
          description="저장 후 바로 공개 URL로 접근 가능합니다."
          checked={data.isPublished}
          onChange={(v) => onChange({ isPublished: v })}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
            공개 만료일 (선택)
          </label>
          <input
            type="date"
            value={data.expiresAt}
            onChange={(e) => onChange({ expiresAt: e.target.value })}
            className="rounded-lg px-4 py-3 text-base outline-none w-full max-w-xs"
            style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
          />
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            설정 시 해당 날짜 이후 자동으로 비공개 처리됩니다.
          </p>
        </div>
      </section>
    </div>
  )
}

function Toggle({
  label, description, checked, onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className="w-10 h-6 rounded-full transition-colors"
          style={{ backgroundColor: checked ? "var(--accent)" : "var(--border)" }}
        />
        <div
          className="absolute top-1 w-4 h-4 rounded-full transition-transform bg-white"
          style={{ left: checked ? "22px" : "4px" }}
        />
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{description}</p>
      </div>
    </label>
  )
}
