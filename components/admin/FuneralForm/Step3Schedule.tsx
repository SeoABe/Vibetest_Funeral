"use client"

import type { FuneralFormData } from "./types"

interface Props {
  data: FuneralFormData
  onChange: (patch: Partial<FuneralFormData>) => void
}

export default function Step3Schedule({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        3단계 — 장례 일정
      </h2>

      <Field label="입관 일시">
        <input type="datetime-local" value={data.shroudingAt}
          onChange={(e) => onChange({ shroudingAt: e.target.value })}
          className={inputClass} style={inputStyle} />
      </Field>

      <div className="flex flex-col gap-3 p-4 rounded-xl" style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>빈소 시간</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="시작">
            <input type="datetime-local" value={data.visitationStartsAt}
              onChange={(e) => onChange({ visitationStartsAt: e.target.value })}
              className={inputClass} style={inputStyle} />
          </Field>
          <Field label="종료">
            <input type="datetime-local" value={data.visitationEndsAt}
              onChange={(e) => onChange({ visitationEndsAt: e.target.value })}
              className={inputClass} style={inputStyle} />
          </Field>
        </div>
        <Field label="안내 문구">
          <input type="text" value={data.visitationNote}
            onChange={(e) => onChange({ visitationNote: e.target.value })}
            placeholder="예: 조문은 오전 10시부터 가능합니다."
            className={inputClass} style={inputStyle} />
        </Field>
      </div>

      <Field label="발인 일시 *">
        <input type="datetime-local" value={data.processionAt}
          onChange={(e) => onChange({ processionAt: e.target.value })}
          required className={inputClass} style={inputStyle} />
      </Field>

      <Field label="장지">
        <input type="text" value={data.burialPlace}
          onChange={(e) => onChange({ burialPlace: e.target.value })}
          placeholder="예: 평온추모공원"
          className={inputClass} style={inputStyle} />
      </Field>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</label>
      {children}
    </div>
  )
}

const inputClass = "rounded-lg px-4 py-3 text-base outline-none w-full"
const inputStyle = {
  backgroundColor: "var(--bg-secondary)",
  color: "var(--text-primary)",
  border: "1px solid var(--border)",
}
