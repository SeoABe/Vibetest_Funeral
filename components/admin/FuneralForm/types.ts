export interface FamilyMember {
  relation: string
  name: string
}

export interface Account {
  id: string
  bank: string
  holder: string
  number: string
  relation: string
  displayMode: "tapToReveal" | "visible"
}

export interface FuneralFormData {
  // Step 1 — 고인 정보
  deceasedName: string
  deceasedPhoto: string
  birthDate: string
  deathDate: string
  ageText: string
  obituaryText: string

  // Step 2 — 상주/가족
  chiefMourner: string
  familyList: FamilyMember[]

  // Step 3 — 장례 일정
  shroudingAt: string
  visitationStartsAt: string
  visitationEndsAt: string
  visitationNote: string
  processionAt: string
  burialPlace: string

  // Step 4 — 장례식장 위치
  funeralHome: string
  funeralHall: string
  funeralAddress: string
  funeralLat: number
  funeralLng: number

  // Step 5 — 조의금 계좌
  accounts: Account[]

  // Step 6 — 방명록/공개 설정
  guestbookRequiresApproval: boolean
  guestbookMaxLength: number
  guestbookAllowAnonymous: boolean
  isPublished: boolean
  expiresAt: string

  // Step 7 — 유언장
  deceasedLetter: string
}

export const defaultFormData: FuneralFormData = {
  deceasedName: "",
  deceasedPhoto: "",
  birthDate: "",
  deathDate: "",
  ageText: "",
  obituaryText: "",
  chiefMourner: "",
  familyList: [{ relation: "배우자", name: "" }],
  shroudingAt: "",
  visitationStartsAt: "",
  visitationEndsAt: "",
  visitationNote: "",
  processionAt: "",
  burialPlace: "",
  funeralHome: "",
  funeralHall: "",
  funeralAddress: "",
  funeralLat: 0,
  funeralLng: 0,
  accounts: [{ id: crypto.randomUUID(), bank: "", holder: "", number: "", relation: "", displayMode: "tapToReveal" }],
  guestbookRequiresApproval: true,
  guestbookMaxLength: 300,
  guestbookAllowAnonymous: true,
  isPublished: false,
  expiresAt: "",
  deceasedLetter: "",
}
