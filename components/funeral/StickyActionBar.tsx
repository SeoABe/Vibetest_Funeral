"use client"

interface Props {
  funeralAddress: string
  lat: number
  lng: number
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
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
        backgroundColor: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="flex">
        {[
          { label: "지도", icon: "📍", target: "location" },
          { label: "계좌", icon: "💳", target: "accounts" },
          { label: "방명록", icon: "✉️", target: "guestbook" },
        ].map(({ label, icon, target }) => (
          <button
            key={label}
            onClick={() => scrollTo(target)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors min-h-[56px]"
            style={{ color: "var(--text-secondary)" }}
          >
            <span className="text-lg leading-none">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
