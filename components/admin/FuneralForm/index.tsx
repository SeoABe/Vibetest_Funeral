"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { defaultFormData, type FuneralFormData } from "./types"
import Step1Deceased from "./Step1Deceased"
import Step2Family from "./Step2Family"
import Step3Schedule from "./Step3Schedule"
import Step4Location from "./Step4Location"
import Step5Accounts from "./Step5Accounts"
import Step6Settings from "./Step6Settings"
import Step7Preview from "./Step7Preview"

const STEPS = ["고인 정보", "상주/가족", "장례 일정", "장례식장", "조의금 계좌", "공개 설정", "최종 확인"]

interface Props {
  initialData?: Partial<FuneralFormData>
  funeralId?: string
}

export default function FuneralForm({ initialData, funeralId }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FuneralFormData>({ ...defaultFormData, ...initialData })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function patch(p: Partial<FuneralFormData>) {
    setData((prev) => ({ ...prev, ...p }))
  }

  function buildSlug() {
    const name = data.deceasedName.replace(/\s/g, "-")
    const year = data.deathDate ? new Date(data.deathDate).getFullYear() : new Date().getFullYear()
    return `${name}-${year}-${Date.now().toString(36)}`
  }

  function buildPayload() {
    return {
      slug: buildSlug(),
      deceasedName: data.deceasedName,
      deceasedPhoto: data.deceasedPhoto || null,
      birthDate: data.birthDate || null,
      deathDate: data.deathDate,
      ageText: data.ageText || null,
      obituaryText: data.obituaryText || null,
      chiefMourner: data.chiefMourner,
      familyList: data.familyList.filter((m) => m.name),
      shroudingAt: data.shroudingAt || null,
      visitation: data.visitationStartsAt
        ? { startsAt: data.visitationStartsAt, endsAt: data.visitationEndsAt, note: data.visitationNote }
        : null,
      processionAt: data.processionAt || null,
      burialPlace: data.burialPlace || null,
      funeralHome: data.funeralHome,
      funeralHall: data.funeralHall || null,
      funeralAddress: data.funeralAddress,
      funeralLat: data.funeralLat,
      funeralLng: data.funeralLng,
      accounts: data.accounts.filter((a) => a.bank && a.number),
      guestbookRequiresApproval: data.guestbookRequiresApproval,
      guestbookMaxLength: data.guestbookMaxLength,
      guestbookAllowAnonymous: data.guestbookAllowAnonymous,
      isPublished: data.isPublished,
      expiresAt: data.expiresAt || null,
    }
  }

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const url = funeralId ? `/api/funeral/${funeralId}` : "/api/funeral"
      const method = funeralId ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      })
      if (!res.ok) throw new Error(await res.text())
      router.push("/admin/dashboard")
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했습니다.")
    } finally {
      setSaving(false)
    }
  }

  const stepProps = { data, onChange: patch }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 스텝 인디케이터 */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setStep(i)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs transition-colors"
            style={{
              backgroundColor: i === step ? "var(--accent)" : i < step ? "var(--bg-elevated)" : "var(--bg-secondary)",
              color: i === step ? "#1a1a1a" : i < step ? "var(--text-secondary)" : "var(--text-muted)",
            }}
          >
            {i + 1}. {s}
          </button>
        ))}
      </div>

      {/* 현재 단계 */}
      <div className="mb-8">
        {step === 0 && <Step1Deceased {...stepProps} />}
        {step === 1 && <Step2Family {...stepProps} />}
        {step === 2 && <Step3Schedule {...stepProps} />}
        {step === 3 && <Step4Location {...stepProps} />}
        {step === 4 && <Step5Accounts {...stepProps} />}
        {step === 5 && <Step6Settings {...stepProps} />}
        {step === 6 && <Step7Preview data={data} />}
      </div>

      {error && (
        <p className="text-sm mb-4 text-center" style={{ color: "#e57373" }}>{error}</p>
      )}

      {/* 네비게이션 */}
      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="px-6 py-3 rounded-lg text-sm transition-colors min-h-[44px]"
          style={{
            backgroundColor: "var(--bg-elevated)",
            color: step === 0 ? "var(--text-muted)" : "var(--text-primary)",
            opacity: step === 0 ? 0.4 : 1,
          }}
        >
          이전
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px]"
            style={{ backgroundColor: "var(--accent)", color: "#1a1a1a" }}
          >
            다음
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px]"
            style={{
              backgroundColor: saving ? "var(--bg-elevated)" : "var(--accent)",
              color: saving ? "var(--text-muted)" : "#1a1a1a",
            }}
          >
            {saving ? "저장 중…" : funeralId ? "수정 완료" : "부고 저장"}
          </button>
        )}
      </div>
    </div>
  )
}
