"use client"

import type { FuneralFormData } from "./types"

interface Props {
  data: FuneralFormData
  onChange: (patch: Partial<FuneralFormData>) => void
}

const MAX = 1000

export default function Step7Will({ data, onChange }: Props) {
  const len = data.deceasedLetter.length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          7단계 — 유언장
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          고인이 방문자에게 남기는 편지입니다. 작성 시 부고 페이지 방명록 위에 공개됩니다.
        </p>
      </div>

      {/* 안내 카드 */}
      <div
        className="rounded-xl p-4 flex flex-col gap-1.5"
        style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <p className="text-xs font-medium" style={{ color: "var(--accent)" }}>작성 예시</p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          살면서 감사했던 것, 가족·지인에게 전하고 싶은 말, 삶의 소회 등을 자유롭게 작성하세요.
          비워두면 해당 섹션이 노출되지 않습니다.
        </p>
      </div>

      {/* 편지 입력 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          고인의 편지 (선택)
        </label>
        <textarea
          value={data.deceasedLetter}
          onChange={(e) => onChange({ deceasedLetter: e.target.value })}
          placeholder={"사랑하는 여러분께\n\n살아오는 동안 함께해주셔서 감사했습니다…"}
          maxLength={MAX}
          rows={14}
          className="rounded-xl px-4 py-4 text-base outline-none resize-none leading-8"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            fontFamily: "var(--font-serif)",
          }}
        />
        <p className="text-xs text-right" style={{ color: len > MAX * 0.9 ? "#e57373" : "var(--text-muted)" }}>
          {len} / {MAX}자
        </p>
      </div>

      {/* 미리보기 */}
      {data.deceasedLetter.trim() && (
        <div
          className="rounded-2xl px-6 py-6"
          style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
        >
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>미리보기</p>
          <span
            className="block text-5xl leading-none mb-2 select-none"
            style={{ color: "var(--border)", fontFamily: "Georgia, serif" }}
            aria-hidden
          >
            &quot;
          </span>
          {data.deceasedLetter.split("\n").map((line, i) =>
            line.trim() === "" ? (
              <br key={i} />
            ) : (
              <p
                key={i}
                className="text-base leading-8"
                style={{ color: "var(--text-secondary)", fontFamily: "var(--font-serif)" }}
              >
                {line}
              </p>
            )
          )}
          <p className="mt-4 text-sm text-right" style={{ color: "var(--text-muted)" }}>
            — {data.deceasedName || "고인명"}
          </p>
        </div>
      )}
    </div>
  )
}
