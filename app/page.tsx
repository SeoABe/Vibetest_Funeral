import Link from "next/link"

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ backgroundColor: "#111", color: "var(--text-primary)" }}
    >
      {/* 로고 영역 */}
      <div className="mb-10 text-center">
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--text-muted)" }}>
          디지털 부고 서비스
        </p>
        <h1
          className="text-4xl font-semibold"
          style={{ color: "var(--accent)", fontFamily: "var(--font-serif)" }}
        >
          모바일 부고장
        </h1>
      </div>

      {/* 안내 카드 */}
      <div
        className="w-full max-w-md rounded-2xl p-6 mb-10 flex flex-col gap-4"
        style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}
      >
        <div className="flex gap-3">
          <span className="mt-0.5 shrink-0 text-base" style={{ color: "var(--accent)" }}>①</span>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            모바일 최적화 디지털 부고장 발송 서비스입니다.
          </p>
        </div>
        <div className="flex gap-3">
          <span className="mt-0.5 shrink-0 text-base" style={{ color: "var(--accent)" }}>②</span>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            바이브코딩으로 만들어진 테스트용 사이트로, 현재는 더미 데이터로 구성되어 있습니다.
          </p>
        </div>
        <div className="flex gap-3">
          <span className="mt-0.5 shrink-0 text-base" style={{ color: "var(--accent)" }}>③</span>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            사이트에 사용된 이미지는 전부 생성형 AI로 제작되었음을 밝힙니다.
          </p>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="w-full max-w-md flex flex-col gap-3">
        <a
          href="/kim-haru-2026"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-medium transition-opacity hover:opacity-80 min-h-[52px]"
          style={{ backgroundColor: "var(--accent)", color: "#fff" }}
        >
          샘플 부고 페이지 보기
        </a>
        <Link
          href="/admin/login"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-medium transition-opacity hover:opacity-80 min-h-[52px]"
          style={{ backgroundColor: "#1a1a1a", color: "var(--text-secondary)", border: "1px solid #2a2a2a" }}
        >
          관리자 페이지
        </Link>
      </div>

      <p className="mt-12 text-xs" style={{ color: "#444" }}>
        © 2026 바이브코딩 테스트 프로젝트
      </p>
    </div>
  )
}
