interface Props {
  name: string
  letter: string
}

export default function DeceasedLetterSection({ name, letter }: Props) {
  return (
    <section className="memorial-section px-5 py-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-px h-4 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
        <h2 className="text-sm font-medium tracking-wide uppercase" style={{ color: "var(--accent)" }}>
          고인의 편지
        </h2>
      </div>

      {/* 편지 카드 */}
      <div
        className="memorial-card relative rounded-lg px-6 py-6 overflow-hidden"
      >
        {/* 장식 따옴표 */}
        <span
          className="absolute top-4 left-4 text-5xl leading-none select-none pointer-events-none"
          style={{ color: "var(--border)", fontFamily: "Georgia, serif" }}
          aria-hidden
        >
          &quot;
        </span>

        {/* 편지 본문 */}
        <div className="relative z-10 mt-4">
          {letter.split("\n").map((line, i) =>
            line.trim() === "" ? (
              <br key={i} />
            ) : (
              <p
                key={i}
                className="text-base leading-8"
                style={{ color: "var(--text-secondary)", fontFamily: "var(--font-serif)" }}
              >
                {line}
              </p>
            )
          )}
        </div>

        {/* 발신자 */}
        <p className="mt-5 text-sm text-right" style={{ color: "var(--text-muted)" }}>
          — {name}
        </p>
      </div>
    </section>
  )
}
