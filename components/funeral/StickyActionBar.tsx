"use client"

interface Props {
  funeralAddress: string
  lat: number
  lng: number
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

function ActionIcon({ type }: { type: "map" | "account" | "guestbook" }) {
  if (type === "map") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    )
  }

  if (type === "account") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3.5" y="6.5" width="17" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M3.5 10h17M7 14h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 6.5h14v9.5H8.5L5 19.5v-13Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8.5 10h7M8.5 13h4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export default function StickyActionBar({ funeralAddress, lat, lng }: Props) {
  void funeralAddress
  void lat
  void lng

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50"
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        paddingBottom: "env(safe-area-inset-bottom)",
        background: "linear-gradient(180deg, rgba(42,40,36,0.92), rgba(22,21,19,0.98))",
        borderTop: "1px solid rgba(202,168,107,0.28)",
        boxShadow: "0 -18px 38px rgba(0,0,0,0.35)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex">
        {[
          { label: "지도", icon: "map" as const, target: "location" },
          { label: "계좌", icon: "account" as const, target: "accounts" },
          { label: "방명록", icon: "guestbook" as const, target: "guestbook" },
        ].map(({ label, icon, target }) => (
          <button
            key={label}
            onClick={() => scrollTo(target)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors min-h-[56px]"
            style={{ color: "var(--text-secondary)" }}
          >
            <ActionIcon type={icon} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
