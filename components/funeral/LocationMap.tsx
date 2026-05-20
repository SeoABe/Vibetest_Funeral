"use client"

import { useEffect, useRef, useState } from "react"

interface Props {
  lat: number
  lng: number
  funeralHome: string
  funeralHall: string | null
  funeralAddress: string
}

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (cb: () => void) => void
        Map: new (el: HTMLElement, opts: object) => object
        LatLng: new (lat: number, lng: number) => object
        Marker: new (opts: object) => { setMap: (m: object) => void }
      }
    }
  }
}

export default function LocationMap({ lat, lng, funeralHome, funeralHall, funeralAddress }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY
    if (!key) return

    function initMap() {
      if (!window.kakao?.maps) return
      window.kakao.maps.load(() => {
        if (!mapRef.current) return
        try {
          const position = new window.kakao.maps.LatLng(lat, lng)
          const map = new window.kakao.maps.Map(mapRef.current, { center: position, level: 4 }) as object
          const marker = new window.kakao.maps.Marker({ position })
          marker.setMap(map)
        } catch {
          // 지도 초기화 실패 — 폴백 UI 유지
        }
      })
    }

    const existing = document.getElementById("kakao-map-sdk")
    if (existing) {
      initMap()
      return
    }

    const script = document.createElement("script")
    script.id = "kakao-map-sdk"
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`
    script.onload = initMap
    script.onerror = () => { /* 스크립트 로드 실패 — 폴백 UI 유지 */ }
    document.head.appendChild(script)
  }, [lat, lng])

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(funeralAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: do nothing
    }
  }

  const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(funeralHome)},${lat},${lng}`
  const naverMapUrl = `https://map.naver.com/p/search/${encodeURIComponent(funeralAddress)}`
  const tmapUrl = `https://tmap.life/?lat=${lat}&lng=${lng}&name=${encodeURIComponent(funeralHome)}`

  return (
    <section id="location" className="py-6" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="px-5 mb-3">
        <h2
          className="text-lg font-semibold mb-1"
          style={{ color: "var(--accent)", fontFamily: "var(--font-serif)" }}
        >
          장례식장 위치
        </h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {funeralHome}{funeralHall && ` ${funeralHall}`}
        </p>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{funeralAddress}</p>
      </div>

      {/* 지도 */}
      <div style={{ position: "relative", width: "100%", height: "220px", backgroundColor: "#1e1e1e" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        {/* 폴백: 지도 미로드 시 주소 표시 */}
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>📍 {funeralAddress}</span>
        </div>
      </div>

      {/* 주소 복사 + 외부 지도 */}
      <div className="px-5 mt-4 flex flex-col gap-3">
        <button
          onClick={copyAddress}
          className="w-full py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px]"
          style={{
            backgroundColor: copied ? "var(--bg-elevated)" : "var(--bg-secondary)",
            color: copied ? "var(--accent)" : "var(--text-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          {copied ? "주소 복사됨 ✓" : "주소 복사"}
        </button>

        <div className="flex gap-2">
          {[
            { label: "카카오맵", url: kakaoMapUrl },
            { label: "네이버지도", url: naverMapUrl },
            { label: "티맵", url: tmapUrl },
          ].map(({ label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-lg text-sm text-center transition-colors min-h-[44px] flex items-center justify-center"
              style={{
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
