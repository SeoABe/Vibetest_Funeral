"use client"

import { useState, useRef } from "react"
import type { FuneralFormData } from "./types"
import type { KakaoAddressResult } from "@/lib/kakao-address"

interface Props {
  data: FuneralFormData
  onChange: (patch: Partial<FuneralFormData>) => void
}

export default function Step4Location({ data, onChange }: Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<KakaoAddressResult[]>([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function search(q: string) {
    if (!q.trim()) { setResults([]); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/kakao-address?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
    } finally {
      setSearching(false)
    }
  }

  function handleQueryChange(q: string) {
    setQuery(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(q), 400)
  }

  function selectPlace(r: KakaoAddressResult) {
    onChange({
      funeralHome: r.placeName,
      funeralAddress: r.roadAddressName || r.addressName,
      funeralLat: r.lat,
      funeralLng: r.lng,
    })
    setQuery(r.placeName)
    setResults([])
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        4단계 — 장례식장 위치
      </h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          장례식장 검색 *
        </label>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="장례식장 이름으로 검색"
            className={inputClass}
            style={inputStyle}
          />
          {searching && (
            <span className="absolute right-3 top-3 text-sm" style={{ color: "var(--text-muted)" }}>
              검색 중…
            </span>
          )}
        </div>

        {results.length > 0 && (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {results.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectPlace(r)}
                className="w-full text-left px-4 py-3 flex flex-col gap-0.5 transition-colors min-h-[44px]"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderBottom: i < results.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {r.placeName}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {r.roadAddressName || r.addressName}
                </span>
              </button>
            ))}
          </div>
        )}

        {data.funeralHome && (
          <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: "#1a2a1a", color: "#6fcf6f" }}>
            선택됨: {data.funeralHome} ({data.funeralAddress})
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          빈소 호실
        </label>
        <input
          type="text"
          value={data.funeralHall}
          onChange={(e) => onChange({ funeralHall: e.target.value })}
          placeholder="예: 2층 목련실"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm" style={{ color: "var(--text-muted)" }}>위도 (자동)</label>
          <input type="number" value={data.funeralLat || ""}
            onChange={(e) => onChange({ funeralLat: parseFloat(e.target.value) })}
            placeholder="37.xxx" className={inputClass} style={inputStyle} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm" style={{ color: "var(--text-muted)" }}>경도 (자동)</label>
          <input type="number" value={data.funeralLng || ""}
            onChange={(e) => onChange({ funeralLng: parseFloat(e.target.value) })}
            placeholder="127.xxx" className={inputClass} style={inputStyle} />
        </div>
      </div>
    </div>
  )
}

const inputClass = "rounded-lg px-4 py-3 text-base outline-none w-full"
const inputStyle = {
  backgroundColor: "var(--bg-elevated)",
  color: "var(--text-primary)",
  border: "1px solid var(--border)",
}
