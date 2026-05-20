"use client"

import type { FuneralFormData } from "./types"

interface Props {
  data: FuneralFormData
}

export default function Step7Preview({ data }: Props) {
  const rows: [string, string][] = [
    ["고인 성함", data.deceasedName],
    ["별세일", data.deathDate ? new Date(data.deathDate).toLocaleDateString("ko-KR") : "-"],
    ["향년", data.ageText || "-"],
    ["대표 상주", data.chiefMourner],
    ["가족 수", `${data.familyList.filter((m) => m.name).length}명`],
    ["장례식장", data.funeralHome || "-"],
    ["빈소 호실", data.funeralHall || "-"],
    ["주소", data.funeralAddress || "-"],
    ["발인 일시", data.processionAt ? new Date(data.processionAt).toLocaleString("ko-KR") : "-"],
    ["장지", data.burialPlace || "-"],
    ["계좌 수", `${data.accounts.filter((a) => a.bank).length}개`],
    ["방명록 승인 필요", data.guestbookRequiresApproval ? "예" : "아니오"],
    ["즉시 공개", data.isPublished ? "예" : "아니오"],
  ]

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        7단계 — 최종 미리보기
      </h2>

      {data.deceasedPhoto && (
        <img
          src={data.deceasedPhoto}
          alt={data.deceasedName}
          className="w-24 h-24 object-cover rounded-xl"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className="flex gap-4 px-4 py-3 text-sm"
            style={{
              backgroundColor: i % 2 === 0 ? "var(--bg-secondary)" : "var(--bg-elevated)",
            }}
          >
            <span className="w-28 shrink-0" style={{ color: "var(--text-muted)" }}>{label}</span>
            <span style={{ color: "var(--text-primary)" }}>{value}</span>
          </div>
        ))}
      </div>

      {data.obituaryText && (
        <div className="p-4 rounded-xl text-sm" style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}>
          <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>부고 본문</p>
          {data.obituaryText}
        </div>
      )}

      <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
        내용을 확인 후 아래 저장 버튼을 누르세요.
      </p>
    </div>
  )
}
