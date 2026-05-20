"use client"

import type { FuneralFormData } from "./types"

interface Props {
  data: FuneralFormData
  onChange: (patch: Partial<FuneralFormData>) => void
}

export default function Step1Deceased({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        1단계 — 고인 정보
      </h2>

      <Field label="고인 성함 *">
        <input
          type="text"
          value={data.deceasedName}
          onChange={(e) => onChange({ deceasedName: e.target.value })}
          required
          placeholder="예: 김하루"
          className={inputClass}
          style={inputStyle}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="출생일">
          <input
            type="date"
            value={data.birthDate}
            onChange={(e) => onChange({ birthDate: e.target.value })}
            className={inputClass}
            style={inputStyle}
          />
        </Field>
        <Field label="별세일 *">
          <input
            type="date"
            value={data.deathDate}
            onChange={(e) => onChange({ deathDate: e.target.value })}
            required
            className={inputClass}
            style={inputStyle}
          />
        </Field>
      </div>

      <Field label="향년">
        <input
          type="text"
          value={data.ageText}
          onChange={(e) => onChange({ ageText: e.target.value })}
          placeholder="예: 향년 78세"
          className={inputClass}
          style={inputStyle}
        />
      </Field>

      <Field label="고인 사진 URL">
        <input
          type="url"
          value={data.deceasedPhoto}
          onChange={(e) => onChange({ deceasedPhoto: e.target.value })}
          placeholder="https://..."
          className={inputClass}
          style={inputStyle}
        />
        {data.deceasedPhoto && (
          <img
            src={data.deceasedPhoto}
            alt="고인 사진 미리보기"
            className="mt-2 w-20 h-20 object-cover rounded-lg"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
      </Field>

      <Field label="부고 본문">
        <textarea
          value={data.obituaryText}
          onChange={(e) => onChange({ obituaryText: e.target.value })}
          rows={4}
          placeholder="가족의 소중한 분이 평온히 영면하셨기에 삼가 알려드립니다."
          className={inputClass}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </Field>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass = "rounded-lg px-4 py-3 text-base outline-none w-full"
const inputStyle = {
  backgroundColor: "var(--bg-elevated)",
  color: "var(--text-primary)",
  border: "1px solid var(--border)",
}
