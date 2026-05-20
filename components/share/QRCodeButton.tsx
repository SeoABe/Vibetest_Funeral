"use client"

import { useState, useEffect, useRef } from "react"
import QRCode from "qrcode"

interface Props {
  url: string
}

export default function QRCodeButton({ url }: Props) {
  const [open, setOpen] = useState(false)
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!open) return
    QRCode.toDataURL(url, {
      width: 280,
      margin: 2,
      color: { dark: "#1a1a1a", light: "#f5f0e8" },
    }).then(setDataUrl)
  }, [open, url])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px]"
        style={{
          backgroundColor: "var(--bg-elevated)",
          color: "var(--text-secondary)",
          border: "1px solid var(--border)",
        }}
      >
        QR 코드 보기
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "20px",
              padding: "32px 24px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              width: "100%",
              maxWidth: "320px",
              border: "1px solid var(--border)",
            }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              QR 코드로 공유하기
            </p>

            {dataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dataUrl}
                alt="QR 코드"
                width={240}
                height={240}
                style={{ borderRadius: "12px" }}
              />
            ) : (
              <div
                style={{
                  width: "240px",
                  height: "240px",
                  backgroundColor: "var(--bg-elevated)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>생성 중…</span>
              </div>
            )}

            <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
              카메라로 스캔하면 부고 페이지로 이동합니다
            </p>

            {dataUrl && (
              <a
                href={dataUrl}
                download="funeral-qr.png"
                className="w-full py-3 rounded-xl text-sm font-medium text-center transition-colors min-h-[44px] flex items-center justify-center"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                QR 이미지 저장
              </a>
            )}

            <button
              onClick={() => setOpen(false)}
              className="w-full py-3 rounded-xl text-sm transition-colors min-h-[44px]"
              style={{ color: "var(--text-muted)" }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  )
}
