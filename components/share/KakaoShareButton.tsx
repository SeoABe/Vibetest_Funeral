"use client"

import { useEffect } from "react"
import { initKakao, shareKakao } from "@/lib/kakao"

interface Props {
  title: string
  description: string
  imageUrl: string
  pageUrl: string
}

export default function KakaoShareButton({ title, description, imageUrl, pageUrl }: Props) {
  useEffect(() => {
    const existing = document.getElementById("kakao-sdk")
    if (existing) {
      initKakao()
      return
    }

    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY
    if (!key) return

    const script = document.createElement("script")
    script.id = "kakao-sdk"
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
    script.crossOrigin = "anonymous"
    script.onload = () => initKakao()
    document.head.appendChild(script)
  }, [])

  function handleShare() {
    shareKakao({
      title,
      description,
      imageUrl: imageUrl || `${pageUrl}/og-default.png`,
      webUrl: pageUrl,
      mobileWebUrl: pageUrl,
    })
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px]"
      style={{
        backgroundColor: "#FEE500",
        color: "#1a1a1a",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 1C4.582 1 1 3.896 1 7.462c0 2.29 1.516 4.3 3.797 5.434L3.9 16.5l3.78-2.498A9.3 9.3 0 0 0 9 14c4.418 0 8-2.896 8-6.538C17 3.896 13.418 1 9 1Z"
          fill="#1a1a1a"
        />
      </svg>
      카카오톡으로 공유
    </button>
  )
}
