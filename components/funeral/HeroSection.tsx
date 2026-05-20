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
  const photoSrc = (photo || "/mock-assets/images/default-memorial.svg")
    .replace("/mock-assets/images/deceased-kim-haru.svg", "/mock-assets/images/deceased-kim-haru.png")
    .replace("/mock-assets/images/deceased-lee-jungmin.svg", "/mock-assets/images/deceased-lee-jungmin.png")
  const birthYear = formatYear(birthDate)
  const deathYear = formatYear(deathDate)

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-72 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 18%, rgba(226,168,92,0.24), transparent 58%)",
        }}
        aria-hidden
      />

      {/* 고인 사진 */}
      <div className="relative w-full p-5 pb-0">
        <div
          className="relative overflow-hidden rounded-lg"
          style={{
            aspectRatio: "3/4",
            backgroundColor: "#111",
            border: "1px solid rgba(202,168,107,0.38)",
            boxShadow: "0 18px 52px rgba(0,0,0,0.38), inset 0 0 0 1px rgba(255,255,255,0.035)",
          }}
        >
          <div
            className="absolute inset-2 z-10 rounded"
            style={{ border: "1px solid rgba(246,239,228,0.12)" }}
            aria-hidden
          />
        {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoSrc}
            alt={`${name} 님`}
            className="w-full h-full object-cover"
            style={{ opacity: 0.72, filter: "saturate(0.82) contrast(1.04)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(20,19,18,0.08) 55%, rgba(20,19,18,0.16))",
            }}
            aria-hidden
          />
        </div>
      </div>

      {/* 이름 + 생몰 + 요약 */}
      <div className="px-5 pb-6 pt-5">
        <p
          className="mb-3 text-center text-xs tracking-[0.22em]"
          style={{ color: "var(--accent)" }}
        >
          삼가 고인의 명복을 빕니다
        </p>
        {/* 이름 */}
        <h1
          className="text-4xl font-semibold mb-2 relative z-10 text-center"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}
        >
          {name}
        </h1>

        {/* 생몰 연도 */}
        <p className="text-base mb-5 text-center" style={{ color: "var(--text-muted)" }}>
          {birthYear && deathYear ? `${birthYear} — ${deathYear}` : deathYear}
          {ageText && <span className="ml-2">{ageText}</span>}
        </p>

        {/* 발인 요약 카드 */}
        <div
          className="memorial-card rounded-lg p-4 flex flex-col gap-2"
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
