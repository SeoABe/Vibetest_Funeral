// 카카오 공유 SDK 타입 정의 및 유틸
export interface KakaoShareParams {
  title: string
  description: string
  imageUrl: string
  webUrl: string
  mobileWebUrl: string
}

declare global {
  interface Window {
    Kakao: {
      isInitialized: () => boolean
      init: (key: string) => void
      Share: {
        sendDefault: (params: {
          objectType: "feed"
          content: {
            title: string
            description: string
            imageUrl: string
            link: { mobileWebUrl: string; webUrl: string }
          }
          buttons: Array<{ title: string; link: { mobileWebUrl: string; webUrl: string } }>
        }) => void
      }
    }
  }
}

export function initKakao() {
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY
  if (!key || typeof window === "undefined") return
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(key)
  }
}

export function shareKakao({ title, description, imageUrl, webUrl, mobileWebUrl }: KakaoShareParams) {
  if (typeof window === "undefined" || !window.Kakao) return
  window.Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title,
      description,
      imageUrl,
      link: { mobileWebUrl, webUrl },
    },
    buttons: [{ title: "부고 보기", link: { mobileWebUrl, webUrl } }],
  })
}
