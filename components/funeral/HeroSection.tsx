interface Props {
  name: string
  photo: string | null
  birthDate: Date | null
  deathDate: Date
  ageText: string | null
  chiefMourner: string
  funeralHome: string
  funeralHall: string | null
  processionAt: Date | null
}

function formatYear(d: Date | null): string {
  if (!d) return ""
  return new Date(d).getFullYear().toString()
}

function formatDateTime(d: Date | null): string {
  if (!d) return ""
  return new Date(d).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function HeroSection({
  name,
  photo,
  birthDate,
  deathDate,
  ageText,
  chiefMourner,
  funeralHome,
  funeralHall,
  processionAt,
}: Props) {
  const photoSrc = photo || "/default-memorial.svg"
  const birthYear = formatYear(birthDate)
  const deathYear = formatYear(deathDate)

  return (
    <section className="relative">
      {/* 고인 사진 */}
      <div className="relative w-full" style={{ aspectRatio: "4/3", backgroundColor: "#111" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc}
          alt={`${name} 님`}
          className="w-full h-full object-cover"
          style={{ opacity: 0.75 }}
        />
        {/* 하단 그라데이션 */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "60%",
            background: "linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* 이름 + 생몰 + 요약 */}
      <div className="px-5 pb-6" style={{ marginTop: "-4rem" }}>
        {/* 이름 */}
        <h1
          className="text-4xl font-semibold mb-2 relative z-10"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
        >
          {name}
        </h1>

        {/* 생몰 연도 */}
        <p className="text-base mb-4" style={{ color: "var(--text-muted)" }}>
          {birthYear && deathYear ? `${birthYear} — ${deathYear}` : deathYear}
          {ageText && <span className="ml-2">{ageText}</span>}
        </p>

        {/* 발인 요약 카드 */}
        <div
          className="rounded-xl p-4 flex flex-col gap-2"
          style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-start gap-3">
            <span className="text-sm shrink-0" style={{ color: "var(--accent)" }}>상주</span>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{chiefMourner}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-sm shrink-0" style={{ color: "var(--accent)" }}>장례식장</span>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {funeralHome}{funeralHall && ` ${funeralHall}`}
            </span>
          </div>
          {processionAt && (
            <div className="flex items-start gap-3">
              <span className="text-sm shrink-0" style={{ color: "var(--accent)" }}>발인</span>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {formatDateTime(processionAt)}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
