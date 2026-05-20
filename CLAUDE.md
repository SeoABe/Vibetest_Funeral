# 모바일 부고장 — Claude Code 가이드

## 프로젝트 개요

모바일 최적화 디지털 부고장 서비스. Next.js 15 App Router 기반 MVP.
바이브코딩 실증용이며 모든 시나리오·seed 데이터는 허구다.

---

## 주요 명령어

```bash
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint
npx prisma migrate dev   # DB 마이그레이션
npx prisma db seed       # seed 데이터 투입
npx prisma studio        # DB GUI
```

---

## 기술 스택

- **프레임워크**: Next.js 15 (App Router, Server Components)
- **언어**: TypeScript (strict)
- **스타일**: Tailwind CSS
- **DB**: PostgreSQL via Supabase + Prisma ORM
- **인증**: NextAuth.js (관리자), bcrypt (비공개 추모글)
- **지도**: 카카오맵 API (지연 로딩 필수)
- **주소검색**: 카카오 REST API (`lib/kakao-address.ts`)
- **공유**: 카카오 공유 SDK
- **이미지 생성**: Satori (OG + 인쇄용)
- **QR**: qrcode 라이브러리
- **배포**: Vercel

---

## 디렉터리 구조 핵심

```
app/(public)/[id]/          # 공개 부고 페이지 — 인증 불필요
app/admin/                  # 관리자 전용 — NextAuth 세션 필수
app/api/                    # Route Handlers
  funeral/                  # 부고 CRUD
  guestbook/                # 방명록 CRUD
  private-message/unlock/   # 비공개 추모글 잠금해제 (rate limit)
  share/og/                 # OG 이미지 (Satori)
  share/print/              # 인쇄용 이미지 (Satori)
components/funeral/         # 공개 페이지 섹션 컴포넌트
components/admin/FuneralForm/  # 7단계 멀티스텝 폼
lib/                        # 유틸
  prisma.ts
  auth.ts
  kakao.ts                  # 공유 SDK
  kakao-address.ts          # 주소검색 REST API
  crypto.ts                 # AES-256-GCM
fixtures/                   # MVP 테스트용 가상 데이터 (수정 금지)
  data/funerals.seed.json
  data/guestbook.seed.json
  scenarios/user-scenarios.md
```

---

## 개발 규칙

### 라우트 구분
- 공개 페이지(`(public)`)는 인증 미들웨어 제외
- 관리자 페이지(`admin`)와 관리용 API는 NextAuth 세션 검증 필수
- 서버 액션은 폼 제출에, Route Handler는 클라이언트 fetch에 사용

### 데이터 모델 주의사항
- `accounts` 필드는 Json 타입: `{ id, bank, holder, number, relation, displayMode }[]`
- `displayMode`는 `"tapToReveal" | "visible"` — 계좌번호 노출 방식
- `familyList`는 `{ relation, name }[]`
- `visitation`은 `{ startsAt, endsAt, note }`
- `privateMessageContent`는 반드시 AES-256-GCM 암호화 후 저장

### 보안 필수 사항
- 비공개 추모글 잠금해제 API: IP 기반 rate limit 10회/시간
- 방명록 작성 API: IP 기반 rate limit + `guestbookMaxLength` 서버 검증
- 잠금 실패 메시지에서 비밀번호 존재 여부 노출 금지
- 계좌번호는 공개 페이지에서 tap-to-reveal 방식으로만 표시

### 접근성 기준
- 본문 최소 `text-base` (16px)
- 터치 영역 최소 44×44px (`min-h-[44px] min-w-[44px]`)
- 명도 대비 WCAG AA (일반 텍스트 4.5:1 이상)
- 복사 성공: 토스트 + 버튼 텍스트 상태 병행
- 지도 컴포넌트: `dynamic import` + `prefers-reduced-motion` 대응

### 카카오맵
- 클라이언트 전용 — `dynamic(() => import(...), { ssr: false })`
- 앱 미설치 시 웹 fallback URL 포함

### 이미지
- 고인 사진: URL 직접 입력 (파일 업로드 없음)
- 미입력 시 `fixtures/assets/images/default-memorial.svg` 경로 사용
- 실제 서비스 시 Supabase Storage 업로드로 교체 예정

---

## Seed 데이터 (테스트용)

| 슬러그 | 상태 | 용도 |
|---|---|---|
| `kim-haru-2026` | published | 핵심 플로우 검증 (A~D 시나리오) |
| `lee-jungmin-private-demo` | draft | 비공개 상태, 일부 필드 누락 케이스 |

- 비공개 추모글 테스트 비밀번호: `haru-family-0427` (김하루), `jungmin-family-1010` (이정민)
- seed 파일 위치: `fixtures/data/` — 테스트 외 목적으로 수정 금지

---

## 환경변수

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

KAKAO_JS_KEY=                     # 공유 SDK
KAKAO_MAP_APP_KEY=                # 지도 API
KAKAO_REST_API_KEY=               # 주소검색 REST API

PRIVATE_MESSAGE_ENCRYPTION_KEY=  # AES-256-GCM 32바이트 키

ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
```

---

## 법적 고지 (코드에 반드시 포함)

| 항목 | 위치 |
|---|---|
| 조의금 계좌는 서비스가 송금 대행하지 않음 | `AccountInfo.tsx` 하단 |
| 가족에게 남긴 글은 법적 효력 없음 | `PrivateMessageSection.tsx` |
| 방명록 작성자 개인정보 수집 안내 | `GuestbookSection.tsx` 폼 |
