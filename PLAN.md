# 모바일 부고장 (디지털 부고 서비스) 개발 계획서

## 개요

모바일 최적화된 디지털 부고장 웹 서비스. 유족이 부고를 생성하면 링크로 공유하고, 조문객은 장례 일정·위치를 확인하거나 조의금 계좌를 조회하고 방명록을 남길 수 있다. 가족에게 남긴 글(비공개 추모글) 기능은 비밀번호로 잠가 지정된 유족만 열람 가능하다.

> 이 계획은 바이브코딩 실증 MVP 기준이다. 모든 시나리오·데이터는 허구이며 실제 서비스 출시 전에는 이용약관·개인정보처리방침·법적 고지 검토가 별도로 필요하다.

---

## 기술 스택

| 영역 | 선택 |
|---|---|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| DB | PostgreSQL (Supabase) |
| ORM | Prisma |
| 인증 | NextAuth.js (관리자) + bcrypt (비공개 추모글) |
| 지도 | 카카오맵 API |
| 주소검색 | 카카오 주소검색 REST API |
| 공유 | 카카오 공유 SDK |
| QR코드 | qrcode 라이브러리 |
| 이미지 생성 | Satori (OG / 인쇄용) |
| 배포 | Vercel |

---

## 프로젝트 구조

```
funeral-app/
├── app/
│   ├── (public)/
│   │   ├── [id]/                        # 부고 상세 페이지 (공개)
│   │   │   ├── page.tsx
│   │   │   ├── guestbook/               # 방명록 작성
│   │   │   └── private-message/         # 가족에게 남긴 글 (비밀번호 잠금)
│   │   └── page.tsx                     # 랜딩
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx           # 부고 목록 + 승인 대기 현황
│   │   ├── create/page.tsx              # 부고 생성 (8단계 멀티스텝 폼)
│   │   └── [id]/
│   │       ├── edit/page.tsx            # 부고 수정
│   │       └── guestbook/page.tsx       # 방명록 관리
│   └── api/
│       ├── funeral/route.ts             # 부고 CRUD
│       ├── guestbook/route.ts           # 방명록 CRUD
│       ├── private-message/
│       │   └── unlock/route.ts          # 비공개 추모글 잠금해제 (rate limit)
│       └── share/
│           ├── og/route.ts              # OG 이미지 동적 생성 (Satori)
│           └── print/route.ts           # 인쇄용 부고 이미지 생성 (Satori)
├── components/
│   ├── funeral/
│   │   ├── HeroSection.tsx              # 고인 사진 + 이름 + 요약
│   │   ├── DeceasedInfo.tsx             # 고인 정보
│   │   ├── FamilyList.tsx               # 상주 목록
│   │   ├── FuneralSchedule.tsx          # 일정 (입관/빈소/발인/장지)
│   │   ├── LocationMap.tsx              # 카카오맵 장례식장 위치
│   │   ├── AccountInfo.tsx              # 조의금 계좌 (tap-to-reveal)
│   │   ├── GuestbookSection.tsx         # 방명록 목록 + 작성 폼
│   │   ├── PrivateMessageSection.tsx    # 가족에게 남긴 글 (잠금/열람)
│   │   └── StickyActionBar.tsx          # 고정 액션바 (지도/계좌/방명록)
│   ├── share/
│   │   ├── KakaoShareButton.tsx         # 카카오톡 공유 버튼
│   │   └── QRCodeButton.tsx             # QR코드 표시
│   └── admin/
│       ├── FuneralForm/                 # 8단계 멀티스텝 폼
│       │   ├── Step1Deceased.tsx
│       │   ├── Step2Family.tsx
│       │   ├── Step3Schedule.tsx
│       │   ├── Step4Location.tsx        # 카카오 주소검색 연동
│       │   ├── Step5Accounts.tsx
│       │   ├── Step6Settings.tsx
│       │   └── Step7Preview.tsx
│       └── GuestbookManager.tsx         # 방명록 승인/삭제
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── kakao.ts                         # 공유 SDK 유틸
│   ├── kakao-address.ts                 # 주소검색 REST API 유틸
│   └── crypto.ts                        # 비공개 추모글 AES-256 암호화
└── prisma/
    └── schema.prisma
```

---

## 데이터 모델 (Prisma Schema)

```prisma
model Funeral {
  id          String    @id @default(cuid())
  slug        String    @unique               // URL용 단축 ID

  // 고인 정보
  deceasedName   String
  deceasedPhoto  String?                      // 이미지 URL (직접 입력)
  birthDate      DateTime?
  deathDate      DateTime
  ageText        String?                      // "향년 78세" 등

  // 상주/가족
  chiefMourner   String
  familyList     Json                         // { relation, name }[]
  obituaryText   String?

  // 장례 일정
  funeralHome    String
  funeralHall    String?                      // 빈소 호실 ("2층 목련실")
  funeralAddress String
  funeralLat     Float
  funeralLng     Float
  shroudingAt    DateTime?                    // 입관
  visitation     Json?                        // { startsAt, endsAt, note }
  processionAt   DateTime?                    // 발인
  burialPlace    String?                      // 장지

  // 조의금 계좌
  // accounts: { id, bank, holder, number, relation, displayMode: "tapToReveal" | "visible" }[]
  accounts       Json

  // 방명록 정책
  guestbookRequiresApproval Boolean @default(true)
  guestbookMaxLength        Int     @default(300)
  guestbookAllowAnonymous   Boolean @default(true)

  // 가족에게 남긴 글 (비공개 추모글)
  privateMessageContent     String?           // AES-256-GCM 암호화 저장
  privateMessagePassword    String?           // bcrypt 해시
  privateMessageLabel       String?           // 표시 라벨 (기본: "가족에게 남긴 글")

  // 공개 설정
  isPublished  Boolean   @default(false)
  publishedAt  DateTime?
  expiresAt    DateTime?                      // 공개 만료일

  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  guestbook    Guestbook[]
}

model Guestbook {
  id         String   @id @default(cuid())
  funeralId  String
  funeral    Funeral  @relation(fields: [funeralId], references: [id])
  authorName String
  message    String
  status     String   @default("pending")    // pending | approved | deleted
  isApproved Boolean  @default(false)
  approvedAt DateTime?
  createdAt  DateTime @default(now())
}
```

---

## 주요 기능 상세

### 1. 부고 공개 페이지 `/[id]`

- 모바일 중심 단일 스크롤, 최대 너비 480px
- **상단 요약**: 고인명 + 발인일 + 장례식장 + 대표 상주를 즉시 노출
- **Sticky 액션바**: 지도 / 조의금 계좌 / 방명록 바로가기 (하단 고정)
- 섹션 순서: 고인 정보 → 상주 → 일정 → 위치 → 조의금 → 방명록 → 가족에게 남긴 글
- `generateMetadata`로 부고별 OG 메타 생성 (카카오톡 미리보기 카드)
- 공개 페이지는 캐시 전략 명시 (`revalidate` 또는 ISR)

### 2. 카카오톡 공유

- 카카오 공유 SDK (`Kakao.Share.sendDefault`)
- 썸네일: 고인 사진 or 기본 추모 이미지
- 내용: 고인 이름, 상주, 장례식장, 발인 일시
- 버튼: "부고 보기" → 링크 이동
- 공유 전 미리보기 UI 제공

### 3. 지도 연동 (카카오맵)

- 카카오맵 마커로 장례식장 위치 표시
- 외부 지도 앱 링크: 카카오맵 / 네이버지도 / 티맵
- 주소 복사 버튼 (복사 성공 시 토스트 + 텍스트 상태 변경)
- 지도 컴포넌트는 지연 로딩 (dynamic import)

### 4. 조의금 계좌 안내

- 계좌번호 기본 숨김, 탭 시 표시 (tapToReveal)
- 복사 버튼: 은행명 + 예금주 + 번호 함께 복사
- 여러 상주 계좌 동시 등록 가능
- 복사 성공 시 토스트 + 버튼 텍스트 상태 변경

### 5. 방명록

- 이름 + 메시지 작성 (익명 허용 여부는 설정값에 따름)
- 최대 글자 수: DB의 `guestbookMaxLength` 값으로 서버 검증
- 작성 직후 "관리자 승인 후 공개됩니다" 안내 노출
- 페이지네이션 (무한 스크롤)
- IP 기반 rate limit (스팸 방지)
- 관리자 페이지에서 승인 / 삭제 / 상태 관리

### 6. 가족에게 남긴 글 (비공개 추모글)

- 유족 지정 비밀번호 입력 후 열람
- 내용은 AES-256-GCM으로 암호화하여 DB 저장
- 비밀번호는 bcrypt 해시로 저장
- 잠금 해제 API: rate limit 10회/시간 (IP 기반)
- 실패 메시지는 비밀번호 존재 여부를 노출하지 않음
- 새로고침 후 다시 잠금 상태로 전환
- 관리자만 내용 등록/수정 가능
- 법적 효력 없음 고지 문구 필수 표시

### 7. QR코드

- `qrcode` 라이브러리로 공개 URL QR 생성
- 관리자 부고 상세 페이지에서 표시 + 다운로드
- 공개 페이지 하단에서도 표시 가능

### 8. 인쇄용 부고 이미지

- `/api/share/print/[id]` — Satori로 이미지 생성
- 포함 정보: 고인명, 생몰일, 향년, 발인 일시, 장례식장, 대표 상주
- OG 이미지 생성과 코드 재사용
- 관리자 페이지에서 다운로드 링크 제공

### 9. 관리자 페이지 `/admin`

- NextAuth 세션 기반 인증 (이메일/패스워드)
- 부고 목록: 공개 상태, 만료일, 승인 대기 방명록 수 표시
- 부고 생성/수정: 8단계 멀티스텝 폼 + 미리보기
- 방명록: 승인 대기 / 승인 / 삭제 후보 상태별 관리
- 가족에게 남긴 글 내용 등록 및 비밀번호 설정
- 관리자 작업 실패 시 재시도 안내

---

## 관리자 부고 생성 폼 — 8단계

| 단계 | 내용 |
|---|---|
| 1. 고인 정보 | 이름, 생몰일, 사진 URL, 향년, 부고 본문 |
| 2. 상주/가족 | 대표 상주, 가족 목록 (관계 + 이름) |
| 3. 장례 일정 | 입관 일시, 빈소 시간, 발인 일시, 장지 |
| 4. 장례식장 위치 | 카카오 주소검색 → 주소/좌표 자동 입력, 빈소 호실 |
| 5. 조의금 계좌 | 여러 계좌 등록, displayMode 설정 |
| 6. 방명록/공개 설정 | 승인 여부, 최대 글자 수, 익명 허용, 공개 만료일 |
| 7. 미리보기 + 공개 | 최종 확인 후 공개 처리, 공유 링크 복사 |

---

## 개발 단계

### Phase 1 — 기반 구축 (1~2일)
- [ ] Next.js 프로젝트 초기화 (TypeScript, Tailwind, ESLint)
- [ ] Prisma + Supabase 연결 및 스키마 마이그레이션
- [ ] NextAuth 관리자 인증 설정
- [ ] 기본 레이아웃 / 폰트 / 색상 시스템 정의
- [ ] fixtures 데이터 seed 스크립트

### Phase 2 — 관리자 폼 + 장례식장 검색 (2~3일)
- [ ] 8단계 멀티스텝 폼 구현
- [ ] 카카오 주소검색 API 연동 (`lib/kakao-address.ts`)
- [ ] 부고 생성/수정 API (`/api/funeral`)
- [ ] 작성 중 미리보기 UI

### Phase 3 — 공개 부고 페이지 (2일)
- [ ] 부고 상세 페이지 UI (모바일 퍼스트, 480px)
- [ ] 상단 요약 + Sticky 액션바
- [ ] 고인 정보 / 상주 / 일정 / 위치 섹션
- [ ] 카카오맵 장례식장 위치 (지연 로딩)
- [ ] 조의금 계좌 tap-to-reveal + 복사

### Phase 4 — 카카오 공유 + OG 이미지 (1일)
- [ ] 카카오 공유 SDK 연동
- [ ] `generateMetadata`로 부고별 OG 메타 생성
- [ ] Satori로 동적 OG 이미지 생성 (`/api/share/og`)
- [ ] 카카오맵 / 네이버지도 / 티맵 외부 링크

### Phase 5 — 방명록 (1~2일)
- [ ] 방명록 작성 폼 (서버 액션, 글자 수 제한)
- [ ] IP 기반 rate limit
- [ ] 방명록 목록 (무한 스크롤, 승인된 항목만)
- [ ] 관리자 승인/삭제 워크플로우

### Phase 6 — 가족에게 남긴 글 (1일)
- [ ] 비밀번호 잠금 UI
- [ ] 잠금 해제 API (rate limit 10회/시간)
- [ ] AES-256-GCM 암호화 저장 (`lib/crypto.ts`)
- [ ] 법적 효력 없음 고지 문구

### Phase 7 — QR코드 + 인쇄용 이미지 (1일)
- [ ] `qrcode` 라이브러리로 QR 생성 (`components/share/QRCodeButton.tsx`)
- [ ] Satori로 인쇄용 부고 이미지 생성 (`/api/share/print`)
- [ ] 관리자 페이지에서 다운로드 링크 제공

### Phase 8 — 관리자 대시보드 + 배포 (1일)
- [ ] 관리자 대시보드 완성 (부고 목록, 승인 대기 카운트)
- [ ] 반응형 최종 점검 + 접근성 검토
- [ ] Vercel 배포 + 환경변수 설정
- [ ] 카카오 앱 도메인 등록

---

## 환경변수

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

KAKAO_JS_KEY=                # 공유 SDK JavaScript 키
KAKAO_MAP_APP_KEY=           # 지도 API 키
KAKAO_REST_API_KEY=          # 주소검색 REST API 키

PRIVATE_MESSAGE_ENCRYPTION_KEY=   # AES-256-GCM 키 (32바이트)

ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
```

---

## 디자인 방향

- **색상**: 짙은 회색(`#1a1a1a`) 배경, 아이보리(`#f5f0e8`) 텍스트, 골드(`#c9a96e`) 포인트
- **폰트**: Noto Serif KR (제목), Noto Sans KR (본문)
- **모티프**: 국화, 연꽃 등 수묵화 스타일 SVG 장식
- **애니메이션**: 페이드인 스크롤, 은은한 전환 효과

### 접근성 기준

- 본문 최소 16px
- 버튼/터치 영역 최소 44×44px
- 명도 대비 WCAG AA 기준 (일반 텍스트 4.5:1 이상)
- 복사 성공 시 토스트 알림 + 버튼 텍스트 상태 변경 병행
- 링크와 버튼 시각적 구분 명확히
- `prefers-reduced-motion` 대응

---

## 법적 고지 (MVP 기준)

| 항목 | 위치 |
|---|---|
| 조의금 계좌는 서비스가 송금 대행하지 않음 | 계좌 섹션 하단 |
| 가족에게 남긴 글은 법적 효력 없음 | 비공개 추모글 섹션 |
| 방명록 작성자 개인정보 수집 안내 | 방명록 작성 폼 |

---

## 추후 확장 아이디어

> MVP 완성 후 검토. 구현 복잡도 또는 법적 검토가 필요한 항목.

- 조회 통계 (방문자 수)
- 추모 사진첩
- 장례 후 추모 페이지 전환
- 온라인 조의금 결제 연동 (PG 필요)
- 본인인증 기반 가족 권한 관리
- 공개 검색 가능한 추모관
- 법적 유언장 보관 서비스

---

## 예상 총 개발 기간

**8~13일** (1인 기준, 풀스택)
