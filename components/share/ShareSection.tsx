"use client"

import { useState } from "react"
import KakaoShareButton from "./KakaoShareButton"
import QRCodeButton from "./QRCodeButton"

interface Props {
  title: string
  description: string
  funeralSlug: string
  deceasedPhoto: string | null
}

export default function ShareSection({ title, description, funeralSlug, deceasedPhoto }: Props) {
  const [copied, setCopied] = useState(false)

  const pageUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${funeralSlug}`
    : `/${funeralSlug}`

  const imageUrl = deceasedPhoto ?? ""

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: do nothing
    }
  }

  return (
    <section className="memorial-section px-5 py-6">
      <h2
        className="memorial-heading text-lg font-semibold mb-4"
      >
        공유하기
      </h2>

      <div className="flex flex-col gap-3">
        <KakaoShareButton
          title={title}
          description={description}
          imageUrl={imageUrl}
          pageUrl={pageUrl}
        />

        <button
          onClick={copyLink}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px]"
          style={{
            backgroundColor: copied ? "var(--bg-elevated)" : "var(--bg-secondary)",
            color: copied ? "var(--accent)" : "var(--text-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          {copied ? "링크 복사됨 ✓" : "링크 복사"}
        </button>

        <QRCodeButton url={pageUrl} />
      </div>
    </section>
  )
}
