# MVP Test Fixtures

이 폴더는 모바일 부고장 MVP의 바이브코딩 실증을 위한 가상 데이터와 이미지 자산을 모아둔 곳이다. 모든 인물, 가족관계, 주소, 계좌, 유언장 내용은 테스트용 허구 데이터다.

## 폴더 구조

```text
fixtures/
├── data/
│   ├── admins.seed.json
│   ├── asset-manifest.json
│   ├── funerals.seed.json
│   └── guestbook.seed.json
├── scenarios/
│   └── user-scenarios.md
└── assets/
    └── images/
        ├── deceased-kim-haru.svg
        ├── deceased-lee-jungmin.svg
        ├── default-memorial.svg
        ├── funeral-home-map-placeholder.svg
        ├── og-kim-haru.svg
        ├── og-lee-jungmin.svg
        └── print-obituary-kim-haru.svg
```

## 사용 의도

- 관리자 플로우: 부고 생성, 수정, 공개/비공개, 방명록 승인
- 조문객 플로우: 부고 열람, 지도 확인, 계좌 복사, 방명록 작성
- 가족 플로우: 비공개 추모글 또는 유언장 열람 테스트
- 공유 플로우: 카카오톡 공유 카드와 OG 이미지 표시 테스트

## 앱 구현 시 권장 매핑

- `fixtures/data/funerals.seed.json` -> Prisma `Funeral` seed
- `fixtures/data/guestbook.seed.json` -> Prisma `Guestbook` seed
- `fixtures/assets/images/*` -> Next.js `public/mock-assets/images/*`
- JSON 내부 `assetPath` 값은 앱에서 public 경로로 복사했을 때의 경로를 기준으로 작성했다.

## 테스트 계정

관리자 계정은 `fixtures/data/admins.seed.json`에 있다. 비밀번호는 실제 운영에 사용하면 안 된다.

