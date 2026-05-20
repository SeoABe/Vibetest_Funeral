"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "funeral-fictional-notice-dismissed"

export default function FictionalNoticeModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (window.sessionStorage.getItem(STORAGE_KEY) !== "true") {
      setOpen(true)
    }
  }, [])

  function close() {
    window.sessionStorage.setItem(STORAGE_KEY, "true")
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fictional-notice-title"
      className="fixed inset-0 z-[100] flex items-center justify-center px-5"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.72)" }}
    >
      <div
        className="memorial-card w-full max-w-sm rounded-lg px-5 py-6"
        style={{ boxShadow: "0 24px 70px rgba(0,0,0,0.5)" }}
      >
        <p className="mb-2 text-xs tracking-[0.2em]" style={{ color: "var(--accent)" }}>
          테스트 안내
        </p>
        <h2
          id="fictional-notice-title"
          className="mb-3 text-xl font-semibold"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
        >
          본 페이지는 가상 부고장입니다
        </h2>
        <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          인물, 장례 일정, 장소, 계좌, 방명록 등 모든 정보는 테스트를 위해 만든 허구의 데이터입니다.
          실제 인물이나 기관과 관련이 없습니다.
        </p>
        <button
          type="button"
          onClick={close}
          autoFocus
          className="memorial-button mt-5 w-full rounded-lg py-3 text-sm font-medium transition-colors min-h-[44px]"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg-primary)" }}
        >
          확인했습니다
        </button>
      </div>
    </div>
  )
}
